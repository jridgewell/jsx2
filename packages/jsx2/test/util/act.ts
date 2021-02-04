import type { Renderable } from '../../src/render';

import { act, createElement, useEffect, useLayoutEffect, useState } from '../../src/jsx2';
import { createTree } from '../../src/diff/create-tree';
import { coerceRenderable } from '../../src/util/coerce-renderable';

describe('act', () => {
  function makeTree(renderable: Renderable, container: Node) {
    return createTree(coerceRenderable(renderable), container, false);
  }

  function expectCalledBefore(first: jest.Mock, second: jest.Mock) {
    expect(first.mock.invocationCallOrder[0]).toBeLessThan(second.mock.invocationCallOrder[0]);
  }

  class Deferred<T> {
    declare promise: Promise<T>;
    declare resolve: (value: T) => void;
    declare reject: (reason: Error) => void;

    constructor() {
      this.promise = new Promise((res, rej) => {
        this.resolve = res;
        this.reject = rej;
      });
    }
  }
  function wait(delay: number): Promise<void> {
    return new Promise((r) => setTimeout(r, delay));
  }

  describe('with async callback', () => {
    it('does not process until cb promise resolves', async () => {
      const body = document.createElement('body');
      const deferred = new Deferred<void>();
      let set: (value: number) => void;
      const effect = jest.fn();
      const layoutEffect = jest.fn();
      const C = jest.fn(() => {
        set = useState(0)[1];
        useEffect(effect);
        useLayoutEffect(layoutEffect);
      });
      act(() => {
        makeTree(createElement(C), body);
        C.mockClear();
        return deferred.promise;
      });
      expect(C).not.toHaveBeenCalled();
      expect(effect).not.toHaveBeenCalled();
      expect(layoutEffect).toHaveBeenCalledTimes(1);

      set!(1);
      await wait(20);
      expect(C).not.toHaveBeenCalled();
      expect(effect).not.toHaveBeenCalled();
      expect(layoutEffect).toHaveBeenCalledTimes(1);

      deferred.resolve();
      await deferred.promise;
      expect(C).toHaveBeenCalledTimes(1);
      expect(effect).toHaveBeenCalledTimes(1);
      expect(layoutEffect).toHaveBeenCalledTimes(2);
    });

    it('processes mutations before resolving', async () => {
      const body = document.createElement('body');
      const deferred = new Deferred<void>();
      let set: (value: number) => void;
      const effect = jest.fn();
      const layoutEffect = jest.fn();
      const C = jest.fn(() => {
        set = useState(0)[1];
        useEffect(effect);
        useLayoutEffect(layoutEffect);
      });
      const ret = act(() => {
        makeTree(createElement(C), body);
        C.mockClear();
        return deferred.promise;
      });

      set!(1);
      deferred.resolve();

      await ret;
      expect(C).toHaveBeenCalledTimes(1);
      expect(effect).toHaveBeenCalledTimes(1);
      expect(layoutEffect).toHaveBeenCalledTimes(2);
    });

    it('return promise resolves after cb promise', async () => {
      const body = document.createElement('body');
      const deferred = new Deferred<void>();
      const deferredNext = jest.fn();
      const actNext = jest.fn();
      const ret = act(() => {
        makeTree(
          createElement(() => {}),
          body,
        );
        return deferred.promise;
      });

      deferred.promise.then(deferredNext);
      ret.then(actNext);

      await wait(20);
      expect(deferredNext).not.toHaveBeenCalled();
      expect(actNext).not.toHaveBeenCalled();

      deferred.resolve();
      await ret;

      expect(deferredNext).toHaveBeenCalled();
      expect(actNext).toHaveBeenCalled();
      expectCalledBefore(deferredNext, actNext);
    });

    it('processes mutations after rejection', async () => {
      const body = document.createElement('body');
      const deferred = new Deferred<void>();
      let set: (value: number) => void;
      const effect = jest.fn();
      const C = jest.fn(() => {
        set = useState(0)[1];
        useEffect(effect);
      });
      const ret = act(() => {
        makeTree(createElement(C), body);
        C.mockClear();
        return deferred.promise;
      });
      expect(C).not.toHaveBeenCalled();
      expect(effect).not.toHaveBeenCalled();

      set!(1);
      await wait(20);
      expect(C).not.toHaveBeenCalled();
      expect(effect).not.toHaveBeenCalled();

      deferred.reject(new Error(''));
      await ret.catch(() => {});
      expect(C).toHaveBeenCalledTimes(1);
      expect(effect).toHaveBeenCalledTimes(1);
    });

    describe('reentrancy', () => {
      it('does not process mutations after inner sync cb', async () => {
        const body = document.createElement('body');
        const deferred = new Deferred<void>();
        let set: (value: number) => void;
        const effect = jest.fn();
        const layoutEffect = jest.fn();
        const C = jest.fn(() => {
          set = useState(0)[1];
          useEffect(effect);
          useLayoutEffect(layoutEffect);
        });
        act(() => {
          makeTree(createElement(C), body);
          set(1);
          C.mockClear();
          expect(layoutEffect).toHaveBeenCalledTimes(1);
          act(() => {
            makeTree(
              createElement(() => {
                useLayoutEffect(layoutEffect);
              }),
              document.createElement('div'),
            );
          });
          expect(layoutEffect).toHaveBeenCalledTimes(2);
          return deferred.promise;
        });

        await wait(20);
        expect(C).not.toHaveBeenCalled();
        expect(effect).not.toHaveBeenCalled();

        deferred.resolve();
        await deferred.promise;

        expect(C).toHaveBeenCalledTimes(1);
        expect(effect).toHaveBeenCalledTimes(1);
      });

      it('does not process mutations after inner async cb', async () => {
        const body = document.createElement('body');
        const deferred = new Deferred<void>();
        let set: (value: number) => void;
        const effect = jest.fn();
        const layoutEffect = jest.fn();
        const C = jest.fn(() => {
          set = useState(0)[1];
          useEffect(effect);
          useLayoutEffect(layoutEffect);
        });
        const ret = act(async () => {
          makeTree(createElement(C), body);
          set(1);
          C.mockClear();
          expect(layoutEffect).toHaveBeenCalledTimes(1);
          const ret = act(() => {
            makeTree(
              createElement(() => {
                useLayoutEffect(layoutEffect);
              }),
              document.createElement('div'),
            );
            return Promise.resolve();
          });
          expect(layoutEffect).toHaveBeenCalledTimes(2);
          await ret;
          return deferred.promise;
        });

        await wait(20);
        expect(C).not.toHaveBeenCalled();
        expect(effect).not.toHaveBeenCalled();

        deferred.resolve();
        await ret;

        expect(C).toHaveBeenCalledTimes(1);
        expect(effect).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('with sync callback', () => {
    it('processes mutations before returning', () => {
      const body = document.createElement('body');
      let set: (value: number) => void;
      const effect = jest.fn();
      const layoutEffect = jest.fn();
      const C = jest.fn(() => {
        set = useState(0)[1];
        useEffect(effect);
        useLayoutEffect(layoutEffect);
      });
      act(() => {
        makeTree(createElement(C), body);
        C.mockClear();
        set(1);

        expect(C).not.toHaveBeenCalled();
        expect(effect).not.toHaveBeenCalled();
        expect(layoutEffect).toHaveBeenCalledTimes(1);
      });

      expect(C).toHaveBeenCalledTimes(1);
      expect(effect).toHaveBeenCalledTimes(1);
      expect(layoutEffect).toHaveBeenCalledTimes(2);
    });

    it('processes mutations after exception', () => {
      const body = document.createElement('body');
      const effect = jest.fn();
      try {
        act(() => {
          makeTree(
            createElement(() => {
              useEffect(effect);
            }),
            body,
          );
          throw new Error('foobar');
        });
      } catch (e) {
        expect(e.message).toBe('foobar');
      }
      expect(effect).toHaveBeenCalledTimes(1);
    });

    describe('reentrancy', () => {
      it('does not process mutations after inner sync cb', () => {
        const body = document.createElement('body');
        let set: (value: number) => void;
        const effect = jest.fn();
        const layoutEffect = jest.fn();
        const C = jest.fn(() => {
          set = useState(0)[1];
          useEffect(effect);
          useLayoutEffect(layoutEffect);
        });
        act(() => {
          makeTree(createElement(C), body);
          set(1);
          C.mockClear();
          expect(layoutEffect).toHaveBeenCalledTimes(1);
          act(() => {
            makeTree(
              createElement(() => {
                useLayoutEffect(layoutEffect);
              }),
              document.createElement('div'),
            );
          });
          expect(layoutEffect).toHaveBeenCalledTimes(2);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expect(effect).toHaveBeenCalledTimes(1);
      });

      it('does not process mutations after inner async cb', async () => {
        const body = document.createElement('body');
        const deferred = new Deferred<void>();
        let set: (value: number) => void;
        const effect = jest.fn();
        const layoutEffect = jest.fn();
        const C = jest.fn(() => {
          set = useState(0)[1];
          useEffect(effect);
          useLayoutEffect(layoutEffect);
        });
        act(() => {
          makeTree(createElement(C), body);
          set(1);
          C.mockClear();
          expect(layoutEffect).toHaveBeenCalledTimes(1);
          act(() => {
            makeTree(
              createElement(() => {
                useLayoutEffect(layoutEffect);
              }),
              document.createElement('div'),
            );
            return deferred.promise;
          });
          expect(layoutEffect).toHaveBeenCalledTimes(2);
        });

        expect(C).not.toHaveBeenCalled();
        expect(effect).not.toHaveBeenCalled();

        deferred.resolve();
        await deferred.promise;

        expect(C).toHaveBeenCalledTimes(1);
        expect(effect).toHaveBeenCalledTimes(1);
      });
    });
  });
});

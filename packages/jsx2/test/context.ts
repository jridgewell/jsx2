import type { Renderable } from '../src/render';

import { createContext } from '../src/context';
import { act, createElement, useContext, useState } from '../src/jsx2';
import { createTree } from '../src/diff/create-tree';
import { coerceRenderable } from '../src/util/coerce-renderable';

describe('createContext', () => {
  function makeTree(renderable: Renderable, container: Node) {
    return createTree(coerceRenderable(renderable), container);
  }

  const defaultValue = { default: true };
  const value = { default: false };

  describe('Provider', () => {
    it('provides children with current context value', () => {
      const container = document.createElement('body');
      const Context = createContext(defaultValue);
      let v;

      act(() => {
        makeTree(
          createElement(
            Context.Provider,
            { value },
            createElement(
              'div',
              null,
              createElement(() => {
                v = useContext(Context);
              }),
            ),
          ),
          container,
        );
      });

      expect(v).toBe(value);
    });
  });

  describe('Consumer', () => {
    describe('nested inside context provider', () => {
      it('invokes children function with current context value', () => {
        const container = document.createElement('body');
        const Context = createContext(defaultValue);
        const render = jest.fn();

        act(() => {
          makeTree(
            createElement(
              Context.Provider,
              { value },
              createElement('div', null, createElement(Context.Consumer, null, render)),
            ),
            container,
          );
        });

        expect(render).toHaveBeenCalledTimes(1);
        expect(render).toHaveBeenCalledWith(value);
      });

      describe('when provider rerenders with different value', () => {
        it('rerenders children', async () => {
          const container = document.createElement('body');
          const Context = createContext(defaultValue);
          const render = jest.fn();
          let set: (v: typeof value) => void;

          act(() => {
            makeTree(
              createElement(() => {
                const [value, setValue] = useState(defaultValue);
                set = setValue;
                return createElement(
                  Context.Provider,
                  { value },
                  createElement('div', null, createElement(Context.Consumer, null, render)),
                );
              }),
              container,
            );
          });

          render.mockClear();

          act(() => {
            set!(value);
          });

          expect(render).toHaveBeenCalledTimes(1);
          expect(render).toHaveBeenCalledWith(value);
        });

        it("pierces memo'd intermediate node", async () => {
          const container = document.createElement('body');
          const Context = createContext(defaultValue);
          const render = jest.fn();
          let set: (v: typeof value) => void;

          act(() => {
            const children = createElement(
              'div',
              null,
              createElement(Context.Consumer, null, render),
            );
            makeTree(
              createElement(() => {
                const [value, setValue] = useState(defaultValue);
                set = setValue;
                return createElement(Context.Provider, { value }, children);
              }),
              container,
            );
            render.mockClear();
          });

          act(() => {
            set!(value);
          });

          expect(render).toHaveBeenCalledTimes(1);
          expect(render).toHaveBeenCalledWith(value);
        });
      });

      describe('when provider rerenders with same value', () => {
        it('rerenders children', async () => {
          const container = document.createElement('body');
          const Context = createContext(defaultValue);
          let set: (v: typeof defaultValue) => void;

          act(() => {
            makeTree(
              createElement(() => {
                // Use null so that we can pass setState's dirty check.
                const [value, setValue] = useState<typeof defaultValue | null>(null);
                set = setValue;
                return createElement(
                  Context.Provider,
                  { value: value ?? defaultValue },
                  createElement(
                    'div',
                    null,
                    createElement(Context.Consumer, null, () => {}),
                  ),
                );
              }),
              container,
            );
          });

          act(() => {
            set!(defaultValue);
          });

          expect(container.querySelector('div')).not.toBe(null);
        });

        it("does not pierce memo'd intermediate node", async () => {
          const container = document.createElement('body');
          const Context = createContext(defaultValue);
          const render = jest.fn();
          let set: (v: typeof value) => void;

          act(() => {
            const children = createElement(
              'div',
              null,
              createElement(Context.Consumer, null, render),
            );
            makeTree(
              createElement(() => {
                const [value, setValue] = useState(defaultValue);
                set = setValue;
                return createElement(Context.Provider, { value }, children);
              }),
              container,
            );
            render.mockClear();
          });

          act(() => {
            set!(defaultValue);
          });

          expect(render).not.toHaveBeenCalled();
        });
      });
    });

    describe('outside any context provider', () => {
      it('invokes children function with default context value', () => {
        const container = document.createElement('body');
        const Context = createContext(defaultValue);
        const render = jest.fn();

        makeTree(createElement(Context.Consumer, null, render), container);

        expect(render).toHaveBeenCalledTimes(1);
        expect(render).toHaveBeenCalledWith(defaultValue);
      });
    });
  });
});

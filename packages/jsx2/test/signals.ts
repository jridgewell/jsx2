import { act, createElement, render, signal, useComputed, useEffect, useSignal } from '../src/jsx2';
import { createSignal } from '../src/signals';

function expectTextNode(node: null | Node, text: string) {
  expect(node).toBeTruthy();
  expect(node!.nodeType).toBe(Node.TEXT_NODE);
  expect(node!.textContent).toBe(text);
}

describe('signals integration tests', () => {
  describe('useSignal', () => {
    it('accepts an initial value and getter reads it', () => {
      const body = document.createElement('body');
      act(() => {
        render(
          createElement(() => {
            const [get] = useSignal('init');
            return get();
          }),
          body,
        );
      });

      expectTextNode(body.firstChild, 'init');
    });

    it('preserves callback identity between renders when value changes', () => {
      const body = document.createElement('body');
      const gets: unknown[] = [];
      const sets: unknown[] = [];
      const updates: unknown[] = [];
      let set: (val: string) => void;
      const C = jest.fn(() => {
        const [get, setter, update] = useSignal('init');
        set = setter;
        gets.push(get);
        sets.push(setter);
        updates.push(update);
        return get();
      });

      act(() => {
        render(createElement(C), body);
      });

      act(() => {
        set('new');
      });

      expect(C).toHaveBeenCalledTimes(2);
      expect(gets[0]).toBe(gets[1]);
      expect(sets[0]).toBe(sets[1]);
      expect(updates[0]).toBe(updates[1]);
    });

    it('triggers rerender when setter is called', () => {
      const body = document.createElement('body');
      let set: (val: string) => void;
      const C = jest.fn(() => {
        const [get, setter] = useSignal('init');
        set = setter;
        return get();
      });

      act(() => {
        render(createElement(C), body);
      });
      expect(C).toHaveBeenCalledTimes(1);

      act(() => {
        set('new');
      });

      expect(C).toHaveBeenCalledTimes(2);
      expectTextNode(body.firstChild, 'new');
    });

    it('skips rerender when value is identical', () => {
      const body = document.createElement('body');
      let set: (val: string) => void;
      const C = jest.fn(() => {
        const [get, setter] = useSignal('init');
        set = setter;
        return get();
      });

      act(() => {
        render(createElement(C), body);
      });
      expect(C).toHaveBeenCalledTimes(1);

      act(() => {
        set('init');
      });

      expect(C).toHaveBeenCalledTimes(1);
      expectTextNode(body.firstChild, 'init');
    });

    it('update applies callback over previous state', () => {
      const body = document.createElement('body');
      let update: (cb: (prev: number) => number) => void;
      const C = jest.fn(() => {
        const [get, , upd] = useSignal(1);
        update = upd;
        return String(get());
      });

      act(() => {
        render(createElement(C), body);
      });

      act(() => {
        update((prev) => prev * 5);
      });

      expectTextNode(body.firstChild, '5');
    });

    it('drops dependencies when rerunning due to props change', () => {
      const body = document.createElement('body');
      let setB: (val: string) => void;

      const Child = jest.fn(({ useVal }: { useVal: boolean }) => {
        const [getB, setterB] = useSignal('B');
        setB = setterB;

        if (useVal) {
          return getB();
        }
        return 'C';
      });

      act(() => {
        render(createElement(Child, { useVal: true }), body);
      });
      expectTextNode(body.firstChild, 'B');
      expect(Child).toHaveBeenCalledTimes(1);

      act(() => {
        render(createElement(Child, { useVal: false }), body);
      });
      expectTextNode(body.firstChild, 'C');
      expect(Child).toHaveBeenCalledTimes(2);

      act(() => {
        setB('B2');
      });
      expect(Child).toHaveBeenCalledTimes(2);
    });

    it('drops dependencies when rerunning useEffect due to props change', () => {
      const body = document.createElement('body');
      let setB: (val: string) => void;
      const effectCb = jest.fn();

      const Child = jest.fn(({ useVal }: { useVal: boolean }) => {
        const [getB, setterB] = useSignal('B');
        setB = setterB;

        useEffect(() => {
          if (useVal) {
            effectCb(getB());
          } else {
            effectCb('C');
          }
        }, [useVal]);

        return null;
      });

      act(() => {
        render(createElement(Child, { useVal: true }), body);
      });
      expect(effectCb).toHaveBeenCalledTimes(1);
      expect(effectCb).toHaveBeenCalledWith('B');

      act(() => {
        render(createElement(Child, { useVal: false }), body);
      });
      expect(effectCb).toHaveBeenCalledTimes(2);
      expect(effectCb).toHaveBeenCalledWith('C');

      act(() => {
        setB('B2');
      });
      expect(effectCb).toHaveBeenCalledTimes(2);
    });

    it('drops dependencies when rerunning due to own signal change', () => {
      const body = document.createElement('body');
      let setA: (val: boolean) => void;
      let setB: (val: string) => void;

      const Comp = jest.fn(() => {
        const [getA, setterA] = useSignal(true);
        setA = setterA;
        const [getB, setterB] = useSignal('B');
        setB = setterB;

        if (getA()) {
          return getB();
        }
        return 'C';
      });

      act(() => {
        render(createElement(Comp), body);
      });
      expectTextNode(body.firstChild, 'B');
      expect(Comp).toHaveBeenCalledTimes(1);

      act(() => {
        setA(false);
      });
      expectTextNode(body.firstChild, 'C');
      expect(Comp).toHaveBeenCalledTimes(2);

      act(() => {
        setB('B2');
      });
      expect(Comp).toHaveBeenCalledTimes(2);
    });

    it('drops dependencies when rerunning due to outside signal change', () => {
      const body = document.createElement('body');
      let setA: (val: boolean) => void;
      let setX: (val: string) => void;

      const Child = jest.fn(({ useVal, getX }: { useVal: boolean; getX: () => string }) => {
        if (useVal) {
          return getX();
        }
        return 'C';
      });

      const Parent = jest.fn(() => {
        const [getA, setterA] = useSignal(true);
        setA = setterA;
        const [getX, setterX] = useSignal('X');
        setX = setterX;
        return createElement(Child, { useVal: getA(), getX });
      });

      act(() => {
        render(createElement(Parent), body);
      });
      expectTextNode(body.firstChild, 'X');
      expect(Child).toHaveBeenCalledTimes(1);

      act(() => {
        setA(false);
      });
      expectTextNode(body.firstChild, 'C');
      expect(Child).toHaveBeenCalledTimes(2);

      act(() => {
        setX('X2');
      });
      expect(Child).toHaveBeenCalledTimes(2);
    });
  });

  describe('useComputed', () => {
    it('caches computed value', () => {
      const body = document.createElement('body');
      const cb = jest.fn(() => 'test');
      act(() => {
        render(
          createElement(() => {
            const get = useComputed(cb);
            get();
            get();
            return get();
          }),
          body,
        );
      });

      expect(cb).toHaveBeenCalledTimes(1);
      expectTextNode(body.firstChild, 'test');
    });

    it('re-evaluates computed when signal inside updates', () => {
      const body = document.createElement('body');
      let cb: () => string;
      let set: (val: string) => void;
      const C = jest.fn(() => {
        const [get, setter] = useSignal('init');
        set = setter;
        cb ||= jest.fn(() => get() + '2');
        const getComp = useComputed(cb);
        return getComp();
      });

      act(() => {
        render(createElement(C), body);
      });
      expect(C).toHaveBeenCalledTimes(1);

      act(() => {
        set('new');
      });

      expect(C).toHaveBeenCalledTimes(2);
      expect(cb!).toHaveBeenCalledTimes(2);
      expectTextNode(body.firstChild, 'new2');
    });

    it('drops dependencies that are no longer used', () => {
      const body = document.createElement('body');
      let setA: (val: boolean) => void;
      let setB: (val: string) => void;

      const Comp = jest.fn(() => {
        const [getA, setterA] = useSignal(true);
        setA = setterA;
        const [getB, setterB] = useSignal('B');
        setB = setterB;

        const getComp = useComputed(() => {
          if (getA()) {
            return getB();
          }
          return 'C';
        });

        return getComp();
      });

      act(() => {
        render(createElement(Comp), body);
      });
      expectTextNode(body.firstChild, 'B');
      expect(Comp).toHaveBeenCalledTimes(1);

      act(() => {
        setA(false);
      });
      expectTextNode(body.firstChild, 'C');
      expect(Comp).toHaveBeenCalledTimes(2);

      act(() => {
        setB('B2');
      });
      expect(Comp).toHaveBeenCalledTimes(2);
      expectTextNode(body.firstChild, 'C');
    });

    it('persists getter among renders', () => {
      const body = document.createElement('body');
      const gets: unknown[] = [];
      const C = jest
        .fn()
        .mockImplementationOnce(() => {
          const get = useComputed(() => 'x');
          gets.push(get);
          return 'rendered';
        })
        .mockImplementationOnce(() => {
          const get = useComputed(() => 'x');
          gets.push(get);
          return 'rendered';
        });

      act(() => {
        render(createElement(C), body);
        render(createElement(C), body);
      });

      expect(C).toHaveBeenCalledTimes(2);
      expect(gets[0]).toBe(gets[1]);
    });
  });

  describe('useEffect', () => {
    it('auto-subscribes to read signals', () => {
      const body = document.createElement('body');
      let set: (val: string) => void;
      const effect = jest.fn();
      const C = jest.fn(() => {
        const [get, setter] = useSignal('init');
        set = setter;
        useEffect(() => {
          effect(get());
        });
        return 'rendered';
      });

      act(() => {
        render(createElement(C), body);
      });
      expect(effect).toHaveBeenCalledTimes(1);
      expect(effect).toHaveBeenCalledWith('init');

      act(() => {
        set('test');
      });

      expect(effect).toHaveBeenCalledTimes(2);
      expect(effect).toHaveBeenCalledWith('test');
    });

    it('drops dependencies that are no longer used', () => {
      const body = document.createElement('body');
      let setA: (val: boolean) => void;
      let setB: (val: string) => void;
      const effectCb = jest.fn();

      const Comp = jest.fn(() => {
        const [getA, setterA] = useSignal(true);
        setA = setterA;
        const [getB, setterB] = useSignal('B');
        setB = setterB;

        useEffect(() => {
          if (getA()) {
            effectCb(getB());
          } else {
            effectCb('C');
          }
        });

        return null;
      });

      act(() => {
        render(createElement(Comp), body);
      });
      expect(effectCb).toHaveBeenCalledTimes(1);
      expect(effectCb).toHaveBeenCalledWith('B');

      act(() => {
        setA(false);
      });
      expect(effectCb).toHaveBeenCalledTimes(2);
      expect(effectCb).toHaveBeenCalledWith('C');

      act(() => {
        setB('B2');
      });
      expect(effectCb).toHaveBeenCalledTimes(2);
    });
  });

  describe('signal', () => {
    it('accepts an initial value and getter reads it', () => {
      const [get] = signal('init');
      expect(get()).toBe('init');
    });

    it('updates value and notifies dependents', () => {
      const [get, set] = signal('init');
      const body = document.createElement('body');
      const C = jest.fn(() => {
        return get();
      });

      act(() => {
        render(createElement(C), body);
      });
      expect(C).toHaveBeenCalledTimes(1);
      expectTextNode(body.firstChild, 'init');

      act(() => {
        set('new');
      });

      expect(C).toHaveBeenCalledTimes(2);
      expectTextNode(body.firstChild, 'new');
    });

    it('update applies callback over previous state', () => {
      const [get, , update] = signal(1);
      const body = document.createElement('body');
      const C = jest.fn(() => {
        return String(get());
      });

      act(() => {
        render(createElement(C), body);
      });

      act(() => {
        update((prev) => prev * 5);
      });

      expectTextNode(body.firstChild, '5');
    });

    it('notifies multiple dependents', () => {
      const [get, set] = signal('init');
      const body1 = document.createElement('body');
      const body2 = document.createElement('body');
      const C1 = jest.fn(() => get());
      const C2 = jest.fn(() => get());

      act(() => {
        render(createElement(C1), body1);
        render(createElement(C2), body2);
      });

      expect(C1).toHaveBeenCalledTimes(1);
      expect(C2).toHaveBeenCalledTimes(1);

      act(() => {
        set('new');
      });

      expect(C1).toHaveBeenCalledTimes(2);
      expect(C2).toHaveBeenCalledTimes(2);
      expectTextNode(body1.firstChild, 'new');
      expectTextNode(body2.firstChild, 'new');
    });

    it('does not register dependency when reading outside component', () => {
      const [get, , , context] = createSignal('init');
      expect(get()).toBe('init');
      expect(context.dependents.size).toBe(0);
      expect(context.dependencies.size).toBe(0);
    });
  });
});

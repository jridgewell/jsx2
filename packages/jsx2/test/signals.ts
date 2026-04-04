import {
  act,
  createElement,
  memo,
  render,
  signal,
  useComputed,
  useEffect,
  useSignal,
  useState,
} from '../src/jsx2';
import { createSignal } from '../src/signals';

function expectTextNode(node: null | Node, text: string) {
  expect(node).toBeTruthy();
  expect(node!.nodeType).toBe(Node.TEXT_NODE);
  expect(node!.textContent).toBe(text);
}

describe('signals integration tests', () => {
  it('batches signal updates', () => {
    const rendered: string[] = [];
    let setA!: (v: number) => void;
    let setB!: (v: number) => void;

    const Comp = () => {
      const [getA, sA] = useSignal(1);
      const [getB, sB] = useSignal(2);
      setA = sA;
      setB = sB;

      rendered.push(`Comp: ${getA()} - ${getB()}`);
      return null;
    };

    const body = document.createElement('body');
    act(() => {
      render(createElement(Comp), body);
    });

    expect(rendered).toEqual(['Comp: 1 - 2']);

    act(() => {
      setA(3);
      setB(4);
    });

    expect(rendered).toEqual(['Comp: 1 - 2', 'Comp: 3 - 4']);
  });

  it('processes signal updates top-down', () => {
    const [getA, setA] = createSignal(1);
    const rendered: string[] = [];

    const Child = () => {
      rendered.push(`Child: ${getA()}`);
      return null;
    };

    const Parent = () => {
      rendered.push(`Parent: ${getA()}`);
      return createElement(Child);
    };

    const body = document.createElement('body');
    act(() => {
      render(createElement(Parent), body);
    });

    expect(rendered).toEqual(['Parent: 1', 'Child: 1']);
    rendered.length = 0;

    act(() => {
      setA(2);
    });

    expect(rendered).toEqual(['Parent: 2', 'Child: 2']);
  });

  it('proves SignalLink instances are not preserved', () => {
    const [getA, , , ctxA] = createSignal('A');
    const [getB, , , ctxB] = createSignal('B');

    const Comp = jest.fn(() => {
      getA();
      getB();
    });

    const body = document.createElement('body');

    act(() => {
      render(createElement(Comp), body);
    });

    const linkA1 = ctxA.nextDependent;
    const linkB1 = ctxB.nextDependent;

    expect(linkA1).toBeDefined();
    expect(linkB1).toBeDefined();

    act(() => {
      render(createElement(Comp), body);
    });

    const linkA2 = ctxA.nextDependent;
    const linkB2 = ctxB.nextDependent;

    expect(linkA2).toBe(linkA1);
    expect(linkB2).toBe(linkB1);
  });

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
            const get = useComputed(cb, []);
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
        const getComp = useComputed(cb, []);
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

    it('handles diamond dependencies without redundant evaluations', () => {
      const body = document.createElement('body');
      let set: (val: string) => void;
      const cbB = jest.fn();
      const cbC = jest.fn();

      const C = () => {
        const [getA, setter] = useSignal('a');
        set = setter;

        const getB = useComputed(() => {
          cbB();
          return getA() + 'b';
        }, []);

        const getC = useComputed(() => {
          cbC();
          return getA() + getB() + 'c';
        }, []);

        return getC();
      };

      act(() => {
        render(createElement(C), body);
      });

      expect(cbB).toHaveBeenCalledTimes(1);
      expect(cbC).toHaveBeenCalledTimes(1);
      expectTextNode(body.firstChild, 'aabc');

      act(() => {
        set('new');
      });

      expect(cbB).toHaveBeenCalledTimes(2);
      expect(cbC).toHaveBeenCalledTimes(2);
      expectTextNode(body.firstChild, 'newnewbc');
    });

    it('cleans up links in middle of dependent list', () => {
      const body = document.createElement('body');
      const [getS, setS] = createSignal('test');

      const CompA = () => {
        getS();
        return 'A';
      };

      const CompB = () => {
        getS();
        return 'B';
      };

      const CompC = () => {
        getS();
        return 'C';
      };

      const App = ({ showB }: { showB: boolean }) => {
        return [createElement(CompA), showB ? createElement(CompB) : null, createElement(CompC)];
      };

      act(() => {
        render(createElement(App, { showB: true }), body);
      });

      // List: CompA -> CompB -> CompC
      // CompB is in the middle.

      act(() => {
        render(createElement(App, { showB: false }), body);
      });

      // CompB is unmounted.
      // Its link should be removed, covering line 127.

      act(() => {
        setS('new');
      });
    });

    it('does not overwrite static attribute when component transitions it', () => {
      const body = document.createElement('body');
      const [getS, setS] = createSignal('signal-val');

      const Comp = () => {
        const s = getS();
        return createElement('div', { foo: s === 'static' ? 'static-val' : getS });
      };

      act(() => {
        render(createElement(Comp), body);
      });

      const div = body.firstChild as HTMLElement;
      expect(div.getAttribute('foo')).toBe('signal-val');

      act(() => {
        setS('static');
      });

      expect(div.getAttribute('foo')).toBe('static-val');
    });

    it('does not overwrite static child when component transitions it', () => {
      const body = document.createElement('body');
      const [getS, setS] = createSignal('signal-val');

      const Comp = () => {
        const s = getS();
        return [s === 'static' ? 'static-val' : getS];
      };

      act(() => {
        render(createElement(Comp), body);
      });

      expectTextNode(body.firstChild, 'signal-val');

      act(() => {
        setS('static');
      });

      expectTextNode(body.firstChild, 'static-val');
    });

    it('skips child work if signal child is unmounted by parent', () => {
      const body = document.createElement('body');
      const [getS, setS] = createSignal('signal-val');

      const App = ({ show }: { show: boolean }) => {
        return show ? createElement('div', null, getS) : null;
      };

      act(() => {
        render(createElement(App, { show: true }), body);
      });

      act(() => {
        setS('new');
        render(createElement(App, { show: false }), body);
      });

      expect(body.firstChild).toBeNull();
    });

    it('skips prop work if element is unmounted by parent', () => {
      const body = document.createElement('body');
      const [getS, setS] = createSignal('signal-val');

      const App = ({ show }: { show: boolean }) => {
        return show ? createElement('div', { foo: getS }) : null;
      };

      act(() => {
        render(createElement(App, { show: true }), body);
      });

      act(() => {
        setS('new');
        render(createElement(App, { show: false }), body);
      });

      expect(body.firstChild).toBeNull();
    });

    it('updates callback when component rerenders with new useState state', () => {
      const body = document.createElement('body');
      let setState: (val: number) => void;
      let setSignal: (val: string) => void;
      const C = jest.fn(() => {
        const [count, setter] = useState(0);
        setState = setter;
        const [getSig, setterSig] = useSignal('init');
        setSignal = setterSig;

        const getComp = useComputed(() => getSig() + count, [count]);
        return getComp();
      });

      act(() => {
        render(createElement(C), body);
      });
      expectTextNode(body.firstChild, 'init0');

      act(() => {
        setState(1);
      });
      expectTextNode(body.firstChild, 'init1');

      act(() => {
        setSignal('new');
      });
      expectTextNode(body.firstChild, 'new1');
    });

    it('notifies dependents when callback changes', () => {
      const body = document.createElement('body');
      let setState: (val: number) => void;
      const childMock = jest.fn(({ getComp }) => {
        return getComp();
      });
      const Child = memo(childMock);
      const Parent = jest.fn(() => {
        const [count, setter] = useState(0);
        setState = setter;
        const [getSig] = useSignal('init');

        const getComp = useComputed(() => getSig() + count, [count]);

        return createElement(Child, { getComp });
      });

      act(() => {
        render(createElement(Parent), body);
      });
      expectTextNode(body.firstChild, 'init0');
      expect(childMock).toHaveBeenCalledTimes(1);

      act(() => {
        setState(1);
      });
      expect(childMock).toHaveBeenCalledTimes(2);
      expectTextNode(body.firstChild, 'init1');
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
        }, []);

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

    it('handles changing order of getter calls', () => {
      const body = document.createElement('body');
      let setA: (val: string) => void;
      let setB: (val: string) => void;
      const cb = jest.fn();
      let first = true;

      const Comp = jest.fn(() => {
        const [getA, setterA] = useSignal('A');
        setA = setterA;
        const [getB, setterB] = useSignal('B');
        setB = setterB;

        const getComp = useComputed(() => {
          cb();
          if (first) {
            first = false;
            return getA() + getB();
          }
          return getB() + getA();
        }, []);

        return getComp();
      });

      act(() => {
        render(createElement(Comp), body);
      });
      expectTextNode(body.firstChild, 'AB');
      expect(cb).toHaveBeenCalledTimes(1);

      act(() => {
        setA('A2');
      });
      expectTextNode(body.firstChild, 'BA2');
      expect(cb).toHaveBeenCalledTimes(2);

      act(() => {
        setB('B2');
      });
      expectTextNode(body.firstChild, 'B2A2');
      expect(cb).toHaveBeenCalledTimes(3);
    });

    it('persists getter among renders', () => {
      const body = document.createElement('body');
      const gets: unknown[] = [];
      const C = jest
        .fn()
        .mockImplementationOnce(() => {
          const get = useComputed(() => 'x', []);
          gets.push(get);
          return 'rendered';
        })
        .mockImplementationOnce(() => {
          const get = useComputed(() => 'x', []);
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
      expect(context.nextDependent).toBe(null);
      expect(context.nextDependency).toBe(null);
    });
  });
});

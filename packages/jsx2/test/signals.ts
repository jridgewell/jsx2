import {
  act,
  createElement,
  render,
  useCallback,
  useComputed,
  useEffect,
  useSignal,
} from '../src/jsx2';

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
      C.mockClear();

      act(() => {
        set('new');
      });

      expect(C).toHaveBeenCalledTimes(1);
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
      C.mockClear();

      act(() => {
        set('init');
      });

      expect(C).not.toHaveBeenCalled();
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
  });

  describe('useComputed', () => {
    it('caches computed value', () => {
      const body = document.createElement('body');
      let getComputed: () => string;
      const cb = jest.fn(() => 'test');
      act(() => {
        render(
          createElement(() => {
            const get = useComputed(cb);
            getComputed = get;
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
      let set: (val: string) => void;
      const C = jest.fn(() => {
        const [get, setter] = useSignal('init');
        set = setter;
        const getComp = useComputed(() => get() + '2');
        return getComp();
      });

      act(() => {
        render(createElement(C), body);
      });
      C.mockClear();

      act(() => {
        set('new');
      });

      expect(C).toHaveBeenCalledTimes(1);
      expectTextNode(body.firstChild, 'new2');
    });

    it('persists getter among renders', () => {
      const body = document.createElement('body');
      let get1, get2;
      const C = jest
        .fn()
        .mockImplementationOnce(() => {
          const get = useComputed(() => 'x');
          get1 = get;
          return 'rendered';
        })
        .mockImplementationOnce(() => {
          const get = useComputed(() => 'x');
          get2 = get;
          return 'rendered';
        });

      act(() => {
        render(createElement(C), body);
        render(createElement(C), body);
      });

      expect(C).toHaveBeenCalledTimes(2);
      expect(get1).toBe(get2);
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

  });
});

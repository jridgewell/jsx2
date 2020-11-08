import { act, createElement, render, useState, useReducer } from '../src/jsx2';

function expectTextNode(node: null | Node, text: string) {
  expect(node).toBeTruthy();
  expect(node!.nodeType).toBe(Node.TEXT_NODE);
  expect(node!.textContent).toBe(text);
}

describe('useState', () => {
  it('accepts an initial value', () => {
    const body = document.createElement('body');
    act(() => {
      render(
        createElement(() => {
          const [state] = useState('init');
          return state;
        }),
        body,
      );
    });

    expectTextNode(body.firstChild, 'init');
  });

  it('accepts a lazy initialization function', () => {
    const body = document.createElement('body');
    act(() => {
      render(
        createElement(() => {
          const [state] = useState(() => 'init');
          return state;
        }),
        body,
      );
    });

    expectTextNode(body.firstChild, 'init');
  });

  describe('when setting value', () => {
    describe('when value is non-function', () => {
      it('skips rerender when value is identical', () => {
        const body = document.createElement('body');
        let set: (value: string) => void;
        const C = jest.fn(() => {
          const [state, setter] = useState('before');
          set = setter;
          return state;
        });

        act(() => {
          render(createElement(C), body);
        });
        C.mockClear();

        act(() => {
          set('before');
        });

        expect(C).not.toHaveBeenCalled();
        expectTextNode(body.firstChild, 'before');
      });

      it('enqueues rerender when value is changed', async () => {
        const body = document.createElement('body');
        let set: (value: string) => void;
        const C = jest.fn(() => {
          const [state, setter] = useState('before');
          set = setter;
          return state;
        });

        act(() => {
          render(createElement(C), body);
        });
        C.mockClear();

        act(() => {
          set('test');
        });

        expect(C).toHaveBeenCalledTimes(1);
        expectTextNode(body.firstChild, 'test');
      });
    });

    describe('when new value is a reducing function', () => {
      it('calls reducer with old value', () => {
        const body = document.createElement('body');
        let set: (value: string | ((prev: string) => string)) => void;
        const C = jest.fn(() => {
          const [state, setter] = useState('before');
          set = setter;
          return state;
        });

        act(() => {
          render(createElement(C), body);
        });
        C.mockClear();

        const reducer = jest.fn(() => 'test');
        act(() => {
          set(reducer);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expect(reducer).toHaveBeenCalledTimes(1);
        expect(reducer).toHaveBeenCalledWith('before');
      });

      it('skips rerender when reduced value is identical', () => {
        const body = document.createElement('body');
        let set: (value: string | ((prev: string) => string)) => void;
        const C = jest.fn(() => {
          const [state, setter] = useState('before');
          set = setter;
          return state;
        });

        act(() => {
          render(createElement(C), body);
        });
        C.mockClear();

        act(() => {
          set(() => 'before');
        });

        expect(C).not.toHaveBeenCalled();
        expectTextNode(body.firstChild, 'before');
      });

      it('enqueues rerender when reduced value is changed', async () => {
        const body = document.createElement('body');
        let set: (value: string | ((prev: string) => string)) => void;
        const C = jest.fn(() => {
          const [state, setter] = useState('before');
          set = setter;
          return state;
        });

        act(() => {
          render(createElement(C), body);
        });
        C.mockClear();

        act(() => {
          set(() => 'test');
        });

        expect(C).toHaveBeenCalledTimes(1);
        expectTextNode(body.firstChild, 'test');
      });
    });

    it('only rerenders a single time per batch', () => {
      const body = document.createElement('body');
      let set: (value: string) => void;
      const C = jest.fn(() => {
        const [state, setter] = useState('before');
        set = setter;
        return state;
      });

      act(() => {
        render(createElement(C), body);
      });
      C.mockClear();

      act(() => {
        set('first');
        set('second');
      });

      expect(C).toHaveBeenCalledTimes(1);
      expectTextNode(body.firstChild, 'second');
    });
  });

  describe('when component rerenders', () => {
    it('preserves previous value', () => {
      const body = document.createElement('body');
      const states: string[] = [];
      const C = jest
        .fn()
        .mockImplementationOnce(() => {
          const state = useState('init');
          states.push(state[0]);
        })
        .mockImplementationOnce(() => {
          const state = useState('second');
          states.push(state[0]);
        });

      act(() => {
        render(createElement(C), body);
        render(createElement(C), body);
      });

      expect(C).toHaveBeenCalledTimes(2);
      expect(states).toEqual(['init', 'init']);
    });

    it('the set function is identical', () => {
      const body = document.createElement('body');
      const sets: ((value: string) => void)[] = [];
      const C = jest
        .fn()
        .mockImplementationOnce(() => {
          const state = useState('init');
          sets.push(state[1]);
        })
        .mockImplementationOnce(() => {
          const state = useState('second');
          sets.push(state[1]);
        });

      act(() => {
        render(createElement(C), body);
        render(createElement(C), body);
      });

      expect(C).toHaveBeenCalledTimes(2);
      expect(sets[0]).toBeInstanceOf(Function);
      expect(sets[0]).toBe(sets[1]);
    });
  });

  describe('when component changes', () => {
    it('initial value is reset', () => {
      const body = document.createElement('body');
      const states: string[] = [];
      const C = jest.fn(() => {
        const state = useState('init');
        states.push(state[0]);
      });
      const C2 = jest.fn(() => {
        const state = useState('second');
        states.push(state[0]);
      });

      act(() => {
        render(createElement(C), body);
        render(createElement(C2), body);
      });

      expect(C).toHaveBeenCalledTimes(1);
      expect(C2).toHaveBeenCalledTimes(1);
      expect(states).toEqual(['init', 'second']);
    });

    it('the set function changes', () => {
      const body = document.createElement('body');
      const sets: ((value: string) => void)[] = [];
      const C = jest.fn(() => {
        const state = useState('init');
        sets.push(state[1]);
      });
      const C2 = jest.fn(() => {
        const state = useState('second');
        sets.push(state[1]);
      });

      act(() => {
        render(createElement(C), body);
        render(createElement(C2), body);
      });

      expect(C).toHaveBeenCalledTimes(1);
      expect(C2).toHaveBeenCalledTimes(1);
      expect(sets[0]).toBeInstanceOf(Function);
      expect(sets[1]).toBeInstanceOf(Function);
      expect(sets[0]).not.toBe(sets[1]);
    });

    it('cancels pending diffs to state', () => {
      const body = document.createElement('body');
      let set: (value: string) => void;
      const C = jest.fn(() => {
        const state = useState('init');
        set = state[1];
      });
      const C2 = jest.fn(() => 'second');

      act(() => {
        render(createElement(C), body);
        set('test');
        render(createElement(C2), body);
      });

      expect(C).toHaveBeenCalledTimes(1);
      expect(C2).toHaveBeenCalledTimes(1);
      expectTextNode(body.firstChild, 'second');
    });

    it('skip further changes to state', () => {
      const body = document.createElement('body');
      let set: (value: string) => void;
      const C = jest.fn(() => {
        const state = useState('init');
        set = state[1];
      });
      const C2 = jest.fn(() => 'second');

      act(() => {
        render(createElement(C), body);
        render(createElement(C2), body);
        set('test');
      });

      expect(C).toHaveBeenCalledTimes(1);
      expect(C2).toHaveBeenCalledTimes(1);
      expectTextNode(body.firstChild, 'second');
    });
  });
});

describe('useReducer', () => {
  function reducer(_prev: string, value: string): string {
    return value;
  }

  it('accepts an initial value', () => {
    const body = document.createElement('body');
    act(() => {
      render(
        createElement(() => {
          const [state] = useReducer(reducer, 'init');
          return state;
        }),
        body,
      );
    });

    expectTextNode(body.firstChild, 'init');
  });

  describe('lazy initialization function', () => {
    it('accepts a lazy initialization function', () => {
      const body = document.createElement('body');
      act(() => {
        render(
          createElement(() => {
            const [state] = useReducer(reducer, undefined, () => 'init');
            return state;
          }),
          body,
        );
      });

      expectTextNode(body.firstChild, 'init');
    });

    it('passes init to lazy initialization function', () => {
      const body = document.createElement('body');
      const initialize = jest.fn();
      act(() => {
        render(
          createElement(() => {
            const [state] = useReducer(reducer, 'init', initialize);
            return state;
          }),
          body,
        );
      });

      expect(initialize).toHaveBeenCalledTimes(1);
      expect(initialize).toHaveBeenCalledWith('init');
    });
  });

  describe('when setting value', () => {
    it('it calls reducer with old value and dispatch action', () => {
      const body = document.createElement('body');
      let dispatch: (value: string) => void;
      const reducer = jest.fn();
      const C = jest.fn(() => {
        const [state, dispatcher] = useReducer(reducer, 'before');
        dispatch = dispatcher;
        return state;
      });

      act(() => {
        render(createElement(C), body);
      });
      C.mockClear();

      act(() => {
        dispatch('test');
      });

      expect(reducer).toHaveBeenCalledTimes(1);
      expect(reducer).toHaveBeenCalledWith('before', 'test');
    });

    it('skips rerender when value is identical', () => {
      const body = document.createElement('body');
      let dispatch: (value: string) => void;
      const C = jest.fn(() => {
        const [state, dispatcher] = useReducer(reducer, 'before');
        dispatch = dispatcher;
        return state;
      });

      act(() => {
        render(createElement(C), body);
      });
      C.mockClear();

      act(() => {
        dispatch('before');
      });

      expect(C).not.toHaveBeenCalled();
      expectTextNode(body.firstChild, 'before');
    });

    it('enqueues rerender when value is changed', async () => {
      const body = document.createElement('body');
      let dispatch: (value: string) => void;
      const C = jest.fn(() => {
        const [state, dispatcher] = useReducer(reducer, 'before');
        dispatch = dispatcher;
        return state;
      });

      act(() => {
        render(createElement(C), body);
      });
      C.mockClear();

      act(() => {
        dispatch('test');
      });

      expect(C).toHaveBeenCalledTimes(1);
      expectTextNode(body.firstChild, 'test');
    });

    it('only rerenders a single time per batch', () => {
      const body = document.createElement('body');
      let dispatch: (value: string) => void;
      const C = jest.fn(() => {
        const [state, dispatcher] = useReducer(reducer, 'before');
        dispatch = dispatcher;
        return state;
      });

      act(() => {
        render(createElement(C), body);
      });
      C.mockClear();

      act(() => {
        dispatch('first');
        dispatch('second');
      });

      expect(C).toHaveBeenCalledTimes(1);
      expectTextNode(body.firstChild, 'second');
    });
  });

  describe('when component rerenders', () => {
    it('preserves previous value', () => {
      const body = document.createElement('body');
      const states: string[] = [];
      const C = jest
        .fn()
        .mockImplementationOnce(() => {
          const state = useReducer(reducer, 'init');
          states.push(state[0]);
        })
        .mockImplementationOnce(() => {
          const state = useReducer(reducer, 'second');
          states.push(state[0]);
        });

      act(() => {
        render(createElement(C), body);
        render(createElement(C), body);
      });

      expect(C).toHaveBeenCalledTimes(2);
      expect(states).toEqual(['init', 'init']);
    });

    it('the dispatch function is identical', () => {
      const body = document.createElement('body');
      const dispatches: ((value: string) => void)[] = [];
      const C = jest
        .fn()
        .mockImplementationOnce(() => {
          const state = useReducer(reducer, 'init');
          dispatches.push(state[1]);
        })
        .mockImplementationOnce(() => {
          const state = useReducer(reducer, 'second');
          dispatches.push(state[1]);
        });

      act(() => {
        render(createElement(C), body);
        render(createElement(C), body);
      });

      expect(C).toHaveBeenCalledTimes(2);
      expect(dispatches[0]).toBeInstanceOf(Function);
      expect(dispatches[0]).toBe(dispatches[1]);
    });
  });

  describe('when component changes', () => {
    it('initial value is reset', () => {
      const body = document.createElement('body');
      const states: string[] = [];
      const C = jest.fn(() => {
        const state = useReducer(reducer, 'init');
        states.push(state[0]);
      });
      const C2 = jest.fn(() => {
        const state = useReducer(reducer, 'second');
        states.push(state[0]);
      });

      act(() => {
        render(createElement(C), body);
        render(createElement(C2), body);
      });

      expect(C).toHaveBeenCalledTimes(1);
      expect(C2).toHaveBeenCalledTimes(1);
      expect(states).toEqual(['init', 'second']);
    });

    it('the dispatch function changes', () => {
      const body = document.createElement('body');
      const dispatches: ((value: string) => void)[] = [];
      const C = jest.fn(() => {
        const state = useReducer(reducer, 'init');
        dispatches.push(state[1]);
      });
      const C2 = jest.fn(() => {
        const state = useReducer(reducer, 'second');
        dispatches.push(state[1]);
      });

      act(() => {
        render(createElement(C), body);
        render(createElement(C2), body);
      });

      expect(C).toHaveBeenCalledTimes(1);
      expect(C2).toHaveBeenCalledTimes(1);
      expect(dispatches[0]).toBeInstanceOf(Function);
      expect(dispatches[1]).toBeInstanceOf(Function);
      expect(dispatches[0]).not.toBe(dispatches[1]);
    });

    it('cancels pending diffs to state', () => {
      const body = document.createElement('body');
      let dispatch: (value: string) => void;
      const C = jest.fn(() => {
        const state = useReducer(reducer, 'init');
        dispatch = state[1];
      });
      const C2 = jest.fn(() => 'second');

      act(() => {
        render(createElement(C), body);
        dispatch('test');
        render(createElement(C2), body);
      });

      expect(C).toHaveBeenCalledTimes(1);
      expect(C2).toHaveBeenCalledTimes(1);
      expectTextNode(body.firstChild, 'second');
    });

    it('skip further changes to state', () => {
      const body = document.createElement('body');
      let dispatch: (value: string) => void;
      const C = jest.fn(() => {
        const state = useReducer(reducer, 'init');
        dispatch = state[1];
      });
      const C2 = jest.fn(() => 'second');

      act(() => {
        render(createElement(C), body);
        render(createElement(C2), body);
        dispatch('test');
      });

      expect(C).toHaveBeenCalledTimes(1);
      expect(C2).toHaveBeenCalledTimes(1);
      expectTextNode(body.firstChild, 'second');
    });
  });
});

describe('useLayoutEffect', () => {
  it.todo('pending layoutEffect is cancelled on unmount');
});

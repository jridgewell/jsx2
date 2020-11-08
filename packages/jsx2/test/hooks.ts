import {
  act,
  createElement,
  render,
  useState,
  useReducer,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useCallback,
} from '../src/jsx2';

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

describe('useEffect', () => {
  it('calls effect after next tick', () => {
    const body = document.createElement('body');
    const effect = jest.fn();
    const C = jest.fn(() => {
      useEffect(effect);
    });

    act(() => {
      render(createElement(C), body);
      expect(effect).not.toHaveBeenCalled();
    });

    expect(effect).toHaveBeenCalledTimes(1);
  });

  describe('when component rerenders', () => {
    describe('when missing deps', () => {
      it('calls effect again', () => {
        const body = document.createElement('body');
        const effect = jest.fn();
        const C = jest.fn(() => {
          useEffect(effect);
        });

        act(() => {
          render(createElement(C), body);
          expect(effect).not.toHaveBeenCalled();
        });
        expect(effect).toHaveBeenCalledTimes(1);

        act(() => {
          render(createElement(C), body);
        });

        expect(C).toHaveBeenCalledTimes(2);
        expect(effect).toHaveBeenCalledTimes(2);
      });

      it('cleans up effect', () => {
        const body = document.createElement('body');
        const cleanup = jest.fn();
        const effect = jest.fn(() => cleanup);
        const C = jest.fn(() => {
          useEffect(effect);
        });

        act(() => {
          render(createElement(C), body);
        });
        expect(cleanup).not.toHaveBeenCalled();

        act(() => {
          render(createElement(C), body);
        });

        expect(C).toHaveBeenCalledTimes(2);
        expect(cleanup).toHaveBeenCalledTimes(1);
      });
    });

    describe('with empty deps', () => {
      it('skips effect', () => {
        const body = document.createElement('body');
        const effect = jest.fn();
        const C = jest.fn(() => {
          useEffect(effect, []);
        });

        act(() => {
          render(createElement(C), body);
        });
        expect(effect).toHaveBeenCalledTimes(1);

        act(() => {
          render(createElement(C), body);
        });

        expect(C).toHaveBeenCalledTimes(2);
        expect(effect).toHaveBeenCalledTimes(1);
      });

      it('does not cleanup', () => {
        const body = document.createElement('body');
        const cleanup = jest.fn();
        const effect = jest.fn(() => cleanup);
        const C = jest.fn(() => {
          useEffect(effect, []);
        });

        act(() => {
          render(createElement(C), body);
        });
        expect(cleanup).not.toHaveBeenCalled();

        act(() => {
          render(createElement(C), body);
        });

        expect(C).toHaveBeenCalledTimes(2);
        expect(cleanup).not.toHaveBeenCalled();
      });
    });

    describe('with non-empty deps', () => {
      describe('with shallow equal deps', () => {
        it('skips effect', () => {
          const body = document.createElement('body');
          const effect = jest.fn();
          const C = jest.fn(() => {
            useEffect(effect, ['dep']);
          });

          act(() => {
            render(createElement(C), body);
          });
          expect(effect).toHaveBeenCalledTimes(1);

          act(() => {
            render(createElement(C), body);
          });

          expect(C).toHaveBeenCalledTimes(2);
          expect(effect).toHaveBeenCalledTimes(1);
        });

        it('does not cleanup', () => {
          const body = document.createElement('body');
          const cleanup = jest.fn();
          const effect = jest.fn(() => cleanup);
          const C = jest.fn(() => {
            useEffect(effect, ['dep']);
          });

          act(() => {
            render(createElement(C), body);
          });
          expect(cleanup).not.toHaveBeenCalled();

          act(() => {
            render(createElement(C), body);
          });

          expect(C).toHaveBeenCalledTimes(2);
          expect(cleanup).not.toHaveBeenCalled();
        });
      });

      describe('with changed deps', () => {
        it('calls effect again', () => {
          const body = document.createElement('body');
          const effect = jest.fn();
          const C = jest.fn(() => {
            useEffect(effect, [{}]);
          });

          act(() => {
            render(createElement(C), body);
            expect(effect).not.toHaveBeenCalled();
          });
          expect(effect).toHaveBeenCalledTimes(1);

          act(() => {
            render(createElement(C), body);
          });

          expect(C).toHaveBeenCalledTimes(2);
          expect(effect).toHaveBeenCalledTimes(2);
        });

        it('cleans up effect', () => {
          const body = document.createElement('body');
          const cleanup = jest.fn();
          const effect = jest.fn(() => cleanup);
          const C = jest.fn(() => {
            useEffect(effect, [{}]);
          });

          act(() => {
            render(createElement(C), body);
          });
          expect(cleanup).not.toHaveBeenCalled();

          act(() => {
            render(createElement(C), body);
          });

          expect(C).toHaveBeenCalledTimes(2);
          expect(cleanup).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('when component changes', () => {
    describe('when missing deps', () => {
      it('skips pending effects', () => {
        const body = document.createElement('body');
        const effect = jest.fn();
        const C = jest.fn(() => {
          useEffect(effect);
        });
        const C2 = jest.fn(() => {});

        act(() => {
          render(createElement(C), body);
          render(createElement(C2), body);
        });

        expect(effect).not.toHaveBeenCalled();
      });

      it('cleanups up old cleanup of pending effect', () => {
        const body = document.createElement('body');
        const cleanup = jest.fn();
        const effect = jest.fn(() => cleanup);
        const C = jest.fn(() => {
          useEffect(effect);
        });
        const C2 = jest.fn(() => {});

        act(() => {
          render(createElement(C), body);
        });
        expect(effect).toHaveBeenCalledTimes(1);
        expect(cleanup).not.toHaveBeenCalled();

        act(() => {
          render(createElement(C), body);
          render(createElement(C2), body);
        });
        expect(effect).toHaveBeenCalledTimes(1);
        expect(cleanup).toHaveBeenCalledTimes(1);
      });

      it('cleans up any mounted effects', () => {
        const body = document.createElement('body');
        const cleanup = jest.fn();
        const effect = jest.fn(() => cleanup);
        const C = jest.fn(() => {
          useEffect(effect);
        });
        const C2 = jest.fn(() => {});

        act(() => {
          render(createElement(C), body);
        });
        expect(effect).toHaveBeenCalledTimes(1);
        expect(cleanup).not.toHaveBeenCalled();

        act(() => {
          render(createElement(C2), body);
        });
        expect(effect).toHaveBeenCalledTimes(1);
        expect(cleanup).toHaveBeenCalledTimes(1);
      });
    });

    describe('with empty deps', () => {
      it('skips pending effects', () => {
        const body = document.createElement('body');
        const effect = jest.fn();
        const C = jest.fn(() => {
          useEffect(effect, []);
        });
        const C2 = jest.fn(() => {});

        act(() => {
          render(createElement(C), body);
          render(createElement(C2), body);
        });

        expect(effect).not.toHaveBeenCalled();
      });

      it('cleans up any mounted effects', () => {
        const body = document.createElement('body');
        const cleanup = jest.fn();
        const effect = jest.fn(() => cleanup);
        const C = jest.fn(() => {
          useEffect(effect, []);
        });
        const C2 = jest.fn(() => {});

        act(() => {
          render(createElement(C), body);
        });
        expect(effect).toHaveBeenCalledTimes(1);
        expect(cleanup).not.toHaveBeenCalled();

        act(() => {
          render(createElement(C2), body);
        });
        expect(effect).toHaveBeenCalledTimes(1);
        expect(cleanup).toHaveBeenCalledTimes(1);
      });
    });

    describe('with non-empty deps', () => {
      describe('with shallow equal deps', () => {
        it('skips pending effects', () => {
          const body = document.createElement('body');
          const effect = jest.fn();
          const C = jest.fn(() => {
            useEffect(effect, ['deps']);
          });
          const C2 = jest.fn(() => {});

          act(() => {
            render(createElement(C), body);
            render(createElement(C2), body);
          });

          expect(effect).not.toHaveBeenCalled();
        });

        it('cleans up any mounted effects', () => {
          const body = document.createElement('body');
          const cleanup = jest.fn();
          const effect = jest.fn(() => cleanup);
          const C = jest.fn(() => {
            useEffect(effect, ['deps']);
          });
          const C2 = jest.fn(() => {});

          act(() => {
            render(createElement(C), body);
          });
          expect(effect).toHaveBeenCalledTimes(1);
          expect(cleanup).not.toHaveBeenCalled();

          act(() => {
            render(createElement(C2), body);
          });
          expect(effect).toHaveBeenCalledTimes(1);
          expect(cleanup).toHaveBeenCalledTimes(1);
        });
      });

      describe('with changed deps', () => {
        it('skips pending effects', () => {
          const body = document.createElement('body');
          const effect = jest.fn();
          const C = jest.fn(() => {
            useEffect(effect, [{}]);
          });
          const C2 = jest.fn(() => {});

          act(() => {
            render(createElement(C), body);
            render(createElement(C2), body);
          });

          expect(effect).not.toHaveBeenCalled();
        });

        it('cleanups up old cleanup of pending effect', () => {
          const body = document.createElement('body');
          const cleanup = jest.fn();
          const effect = jest.fn(() => cleanup);
          const C = jest.fn(() => {
            useEffect(effect, [{}]);
          });
          const C2 = jest.fn(() => {});

          act(() => {
            render(createElement(C), body);
          });
          expect(effect).toHaveBeenCalledTimes(1);
          expect(cleanup).not.toHaveBeenCalled();

          act(() => {
            render(createElement(C), body);
            render(createElement(C2), body);
          });
          expect(effect).toHaveBeenCalledTimes(1);
          expect(cleanup).toHaveBeenCalledTimes(1);
        });

        it('cleans up any mounted effects', () => {
          const body = document.createElement('body');
          const cleanup = jest.fn();
          const effect = jest.fn(() => cleanup);
          const C = jest.fn(() => {
            useEffect(effect, [{}]);
          });
          const C2 = jest.fn(() => {});

          act(() => {
            render(createElement(C), body);
          });
          expect(effect).toHaveBeenCalledTimes(1);
          expect(cleanup).not.toHaveBeenCalled();

          act(() => {
            render(createElement(C2), body);
          });
          expect(effect).toHaveBeenCalledTimes(1);
          expect(cleanup).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});

describe('useLayoutEffect', () => {
  it('calls effect after render', () => {
    const body = document.createElement('body');
    const effect = jest.fn();
    const C = jest.fn(() => {
      useLayoutEffect(effect);
    });

    act(() => {
      render(createElement(C), body);
      expect(effect).toHaveBeenCalledTimes(1);
    });
  });

  describe('when component rerenders', () => {
    describe('when missing deps', () => {
      it('calls effect again', () => {
        const body = document.createElement('body');
        const effect = jest.fn();
        const C = jest.fn(() => {
          useLayoutEffect(effect);
        });

        act(() => {
          render(createElement(C), body);
        });
        expect(effect).toHaveBeenCalledTimes(1);

        act(() => {
          render(createElement(C), body);
        });

        expect(C).toHaveBeenCalledTimes(2);
        expect(effect).toHaveBeenCalledTimes(2);
      });

      it('cleans up effect', () => {
        const body = document.createElement('body');
        const cleanup = jest.fn();
        const effect = jest.fn(() => cleanup);
        const C = jest.fn(() => {
          useLayoutEffect(effect);
        });

        act(() => {
          render(createElement(C), body);
        });
        expect(cleanup).not.toHaveBeenCalled();

        act(() => {
          render(createElement(C), body);
        });

        expect(C).toHaveBeenCalledTimes(2);
        expect(cleanup).toHaveBeenCalledTimes(1);
      });
    });

    describe('with empty deps', () => {
      it('skips effect', () => {
        const body = document.createElement('body');
        const effect = jest.fn();
        const C = jest.fn(() => {
          useLayoutEffect(effect, []);
        });

        act(() => {
          render(createElement(C), body);
        });
        expect(effect).toHaveBeenCalledTimes(1);

        act(() => {
          render(createElement(C), body);
        });

        expect(C).toHaveBeenCalledTimes(2);
        expect(effect).toHaveBeenCalledTimes(1);
      });

      it('does not cleanup', () => {
        const body = document.createElement('body');
        const cleanup = jest.fn();
        const effect = jest.fn(() => cleanup);
        const C = jest.fn(() => {
          useLayoutEffect(effect, []);
        });

        act(() => {
          render(createElement(C), body);
        });
        expect(cleanup).not.toHaveBeenCalled();

        act(() => {
          render(createElement(C), body);
        });

        expect(C).toHaveBeenCalledTimes(2);
        expect(cleanup).not.toHaveBeenCalled();
      });
    });

    describe('with non-empty deps', () => {
      describe('with shallow equal deps', () => {
        it('skips effect', () => {
          const body = document.createElement('body');
          const effect = jest.fn();
          const C = jest.fn(() => {
            useLayoutEffect(effect, ['dep']);
          });

          act(() => {
            render(createElement(C), body);
          });
          expect(effect).toHaveBeenCalledTimes(1);

          act(() => {
            render(createElement(C), body);
          });

          expect(C).toHaveBeenCalledTimes(2);
          expect(effect).toHaveBeenCalledTimes(1);
        });

        it('does not cleanup', () => {
          const body = document.createElement('body');
          const cleanup = jest.fn();
          const effect = jest.fn(() => cleanup);
          const C = jest.fn(() => {
            useLayoutEffect(effect, ['dep']);
          });

          act(() => {
            render(createElement(C), body);
          });
          expect(cleanup).not.toHaveBeenCalled();

          act(() => {
            render(createElement(C), body);
          });

          expect(C).toHaveBeenCalledTimes(2);
          expect(cleanup).not.toHaveBeenCalled();
        });
      });

      describe('with changed deps', () => {
        it('calls effect again', () => {
          const body = document.createElement('body');
          const effect = jest.fn();
          const C = jest.fn(() => {
            useLayoutEffect(effect, [{}]);
          });

          act(() => {
            render(createElement(C), body);
          });
          expect(effect).toHaveBeenCalledTimes(1);

          act(() => {
            render(createElement(C), body);
          });

          expect(C).toHaveBeenCalledTimes(2);
          expect(effect).toHaveBeenCalledTimes(2);
        });

        it('cleans up effect', () => {
          const body = document.createElement('body');
          const cleanup = jest.fn();
          const effect = jest.fn(() => cleanup);
          const C = jest.fn(() => {
            useLayoutEffect(effect, [{}]);
          });

          act(() => {
            render(createElement(C), body);
          });
          expect(cleanup).not.toHaveBeenCalled();

          act(() => {
            render(createElement(C), body);
          });

          expect(C).toHaveBeenCalledTimes(2);
          expect(cleanup).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('when component changes', () => {
    describe('when missing deps', () => {
      it('cleans up any mounted effects', () => {
        const body = document.createElement('body');
        const cleanup = jest.fn();
        const effect = jest.fn(() => cleanup);
        const C = jest.fn(() => {
          useLayoutEffect(effect);
        });
        const C2 = jest.fn(() => {});

        act(() => {
          render(createElement(C), body);
        });
        expect(effect).toHaveBeenCalledTimes(1);
        expect(cleanup).not.toHaveBeenCalled();

        act(() => {
          render(createElement(C2), body);
        });
        expect(effect).toHaveBeenCalledTimes(1);
        expect(cleanup).toHaveBeenCalledTimes(1);
      });
    });

    describe('with empty deps', () => {
      it('cleans up any mounted effects', () => {
        const body = document.createElement('body');
        const cleanup = jest.fn();
        const effect = jest.fn(() => cleanup);
        const C = jest.fn(() => {
          useLayoutEffect(effect, []);
        });
        const C2 = jest.fn(() => {});

        act(() => {
          render(createElement(C), body);
        });
        expect(effect).toHaveBeenCalledTimes(1);
        expect(cleanup).not.toHaveBeenCalled();

        act(() => {
          render(createElement(C2), body);
        });
        expect(effect).toHaveBeenCalledTimes(1);
        expect(cleanup).toHaveBeenCalledTimes(1);
      });
    });

    describe('with non-empty deps', () => {
      describe('with shallow equal deps', () => {
        it('cleans up any mounted effects', () => {
          const body = document.createElement('body');
          const cleanup = jest.fn();
          const effect = jest.fn(() => cleanup);
          const C = jest.fn(() => {
            useLayoutEffect(effect, ['deps']);
          });
          const C2 = jest.fn(() => {});

          act(() => {
            render(createElement(C), body);
          });
          expect(effect).toHaveBeenCalledTimes(1);
          expect(cleanup).not.toHaveBeenCalled();

          act(() => {
            render(createElement(C2), body);
          });
          expect(effect).toHaveBeenCalledTimes(1);
          expect(cleanup).toHaveBeenCalledTimes(1);
        });
      });

      describe('with changed deps', () => {
        it('cleans up any mounted effects', () => {
          const body = document.createElement('body');
          const cleanup = jest.fn();
          const effect = jest.fn(() => cleanup);
          const C = jest.fn(() => {
            useLayoutEffect(effect, [{}]);
          });
          const C2 = jest.fn(() => {});

          act(() => {
            render(createElement(C), body);
          });
          expect(effect).toHaveBeenCalledTimes(1);
          expect(cleanup).not.toHaveBeenCalled();

          act(() => {
            render(createElement(C2), body);
          });
          expect(effect).toHaveBeenCalledTimes(1);
          expect(cleanup).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});

describe('useMemo', () => {
  it('initializes value with function', () => {
    const body = document.createElement('body');
    const init = jest.fn(() => 'init');
    const C = jest.fn(() => {
      return useMemo(init, undefined);
    });

    act(() => {
      render(createElement(C), body);
    });

    expectTextNode(body.firstChild, 'init');
  });

  describe('when component rerenders', () => {
    describe('when missing deps', () => {
      it('initializes value again', () => {
        const body = document.createElement('body');
        const init = jest.fn(() => ({ memo: true }));
        const memos: { memo: boolean }[] = [];
        const C = jest.fn(() => {
          memos.push(useMemo(init, undefined));
        });

        act(() => {
          render(createElement(C), body);
        });
        expect(init).toHaveBeenCalledTimes(1);

        act(() => {
          render(createElement(C), body);
        });

        expect(C).toHaveBeenCalledTimes(2);
        expect(init).toHaveBeenCalledTimes(2);
        expect(memos).toHaveLength(2);
        expect(memos[0]).not.toBe(memos[1]);
      });
    });

    describe('with empty deps', () => {
      it('reuses memo value', () => {
        const body = document.createElement('body');
        const init = jest.fn(() => ({ memo: true }));
        const memos: { memo: boolean }[] = [];
        const C = jest.fn(() => {
          memos.push(useMemo(init, []));
        });

        act(() => {
          render(createElement(C), body);
        });
        expect(init).toHaveBeenCalledTimes(1);

        act(() => {
          render(createElement(C), body);
        });

        expect(C).toHaveBeenCalledTimes(2);
        expect(init).toHaveBeenCalledTimes(1);
        expect(memos).toHaveLength(2);
        expect(memos[0]).toBe(memos[1]);
      });
    });

    describe('with non-empty deps', () => {
      describe('with shallow equal deps', () => {
        it('reuses memo value', () => {
          const body = document.createElement('body');
          const init = jest.fn(() => ({ memo: true }));
          const memos: { memo: boolean }[] = [];
          const C = jest.fn(() => {
            memos.push(useMemo(init, ['dep']));
          });

          act(() => {
            render(createElement(C), body);
          });
          expect(init).toHaveBeenCalledTimes(1);

          act(() => {
            render(createElement(C), body);
          });

          expect(C).toHaveBeenCalledTimes(2);
          expect(init).toHaveBeenCalledTimes(1);
          expect(memos).toHaveLength(2);
          expect(memos[0]).toBe(memos[1]);
        });
      });

      describe('with changed deps', () => {
        it('initializes value again', () => {
          const body = document.createElement('body');
          const init = jest.fn(() => ({ memo: true }));
          const memos: { memo: boolean }[] = [];
          const C = jest.fn(() => {
            memos.push(useMemo(init, [{}]));
          });

          act(() => {
            render(createElement(C), body);
          });
          expect(init).toHaveBeenCalledTimes(1);

          act(() => {
            render(createElement(C), body);
          });

          expect(C).toHaveBeenCalledTimes(2);
          expect(init).toHaveBeenCalledTimes(2);
          expect(memos).toHaveLength(2);
          expect(memos[0]).not.toBe(memos[1]);
        });
      });
    });
  });

  describe('when component changes', () => {
    describe('when missing deps', () => {
      it('initializes value again', () => {
        const body = document.createElement('body');
        const init = jest.fn(() => ({ memo: true }));
        const memos: { memo: boolean }[] = [];
        const C = jest.fn(() => {
          memos.push(useMemo(init, undefined));
        });
        const C2 = jest.fn(() => {
          memos.push(useMemo(init, undefined));
        });

        act(() => {
          render(createElement(C), body);
        });
        expect(init).toHaveBeenCalledTimes(1);

        act(() => {
          render(createElement(C2), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expect(C2).toHaveBeenCalledTimes(1);
        expect(init).toHaveBeenCalledTimes(2);
        expect(memos).toHaveLength(2);
        expect(memos[0]).not.toBe(memos[1]);
      });
    });

    describe('with empty deps', () => {
      it('initializes value again', () => {
        const body = document.createElement('body');
        const init = jest.fn(() => ({ memo: true }));
        const memos: { memo: boolean }[] = [];
        const C = jest.fn(() => {
          memos.push(useMemo(init, []));
        });
        const C2 = jest.fn(() => {
          memos.push(useMemo(init, []));
        });

        act(() => {
          render(createElement(C), body);
        });
        expect(init).toHaveBeenCalledTimes(1);

        act(() => {
          render(createElement(C2), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expect(C2).toHaveBeenCalledTimes(1);
        expect(init).toHaveBeenCalledTimes(2);
        expect(memos).toHaveLength(2);
        expect(memos[0]).not.toBe(memos[1]);
      });
    });

    describe('with non-empty deps', () => {
      describe('with shallow equal deps', () => {
        it('initializes value again', () => {
          const body = document.createElement('body');
          const init = jest.fn(() => ({ memo: true }));
          const memos: { memo: boolean }[] = [];
          const C = jest.fn(() => {
            memos.push(useMemo(init, ['deps']));
          });
          const C2 = jest.fn(() => {
            memos.push(useMemo(init, ['deps']));
          });

          act(() => {
            render(createElement(C), body);
          });
          expect(init).toHaveBeenCalledTimes(1);

          act(() => {
            render(createElement(C2), body);
          });

          expect(C).toHaveBeenCalledTimes(1);
          expect(C2).toHaveBeenCalledTimes(1);
          expect(init).toHaveBeenCalledTimes(2);
          expect(memos).toHaveLength(2);
          expect(memos[0]).not.toBe(memos[1]);
        });
      });

      describe('with changed deps', () => {
        it('initializes value again', () => {
          const body = document.createElement('body');
          const init = jest.fn(() => ({ memo: true }));
          const memos: { memo: boolean }[] = [];
          const C = jest.fn(() => {
            memos.push(useMemo(init, [{}]));
          });
          const C2 = jest.fn(() => {
            memos.push(useMemo(init, [{}]));
          });

          act(() => {
            render(createElement(C), body);
          });
          expect(init).toHaveBeenCalledTimes(1);

          act(() => {
            render(createElement(C2), body);
          });

          expect(C).toHaveBeenCalledTimes(1);
          expect(C2).toHaveBeenCalledTimes(1);
          expect(init).toHaveBeenCalledTimes(2);
          expect(memos).toHaveLength(2);
          expect(memos[0]).not.toBe(memos[1]);
        });
      });
    });
  });
});

describe('useRef', () => {
  it('initializes ref with current value', () => {
    const body = document.createElement('body');
    const C = jest.fn(() => {
      return useRef('init').current;
    });

    act(() => {
      render(createElement(C), body);
    });

    expectTextNode(body.firstChild, 'init');
  });

  describe('when component rerenders', () => {
    it('reuses ref', () => {
      const body = document.createElement('body');
      const refs: { current: number }[] = [];
      let count = 0;
      const C = jest.fn(() => {
        refs.push(useRef(count++));
      });

      act(() => {
        render(createElement(C), body);
      });

      act(() => {
        render(createElement(C), body);
      });

      expect(C).toHaveBeenCalledTimes(2);
      expect(refs).toHaveLength(2);
      expect(refs[0]).toBe(refs[1]);
    });

    it('does not update current value', () => {
      const body = document.createElement('body');
      const refs: { current: number }[] = [];
      let count = 0;
      const C = jest.fn(() => {
        refs.push(useRef(count++));
      });

      act(() => {
        render(createElement(C), body);
      });

      act(() => {
        render(createElement(C), body);
      });

      expect(C).toHaveBeenCalledTimes(2);
      expect(refs).toHaveLength(2);
      expect(refs[0]).toHaveProperty('current', 0);
    });
  });

  describe('when component changes', () => {
    it('initializes ref again', () => {
      const body = document.createElement('body');
      const refs: { current: string }[] = [];
      const C = jest.fn(() => {
        refs.push(useRef('before'));
      });
      const C2 = jest.fn(() => {
        refs.push(useRef('test'));
      });

      act(() => {
        render(createElement(C), body);
      });

      act(() => {
        render(createElement(C2), body);
      });

      expect(C).toHaveBeenCalledTimes(1);
      expect(C2).toHaveBeenCalledTimes(1);
      expect(refs).toHaveLength(2);
      expect(refs[0]).not.toBe(refs[1]);
      expect(refs[0]).toHaveProperty('current', 'before');
      expect(refs[1]).toHaveProperty('current', 'test');
    });
  });
});

describe('useCallback', () => {
  it('initializes value with function', () => {
    const body = document.createElement('body');
    const C = jest.fn(() => {
      const cb = jest.fn(() => 'init');
      const memo = useCallback(cb, []);
      expect(memo).toBe(cb);
      expect(cb).not.toHaveBeenCalled();
      return 'init';
    });

    act(() => {
      render(createElement(C), body);
    });

    expectTextNode(body.firstChild, 'init');
  });

  describe('when component rerenders', () => {
    describe('with empty deps', () => {
      it('reuses memo value', () => {
        const body = document.createElement('body');
        const callbacks: jest.Mock[] = [];
        const C = jest.fn(() => {
          callbacks.push(useCallback(jest.fn(), []));
        });

        act(() => {
          render(createElement(C), body);
        });

        act(() => {
          render(createElement(C), body);
        });

        expect(C).toHaveBeenCalledTimes(2);
        expect(callbacks).toHaveLength(2);
        expect(callbacks[0]).toBe(callbacks[1]);
        expect(callbacks[0]).not.toHaveBeenCalled();
      });
    });

    describe('with non-empty deps', () => {
      describe('with shallow equal deps', () => {
        it('reuses memo value', () => {
          const body = document.createElement('body');
          const callbacks: jest.Mock[] = [];
          const C = jest.fn(() => {
            callbacks.push(useCallback(jest.fn(), ['dep']));
          });

          act(() => {
            render(createElement(C), body);
          });

          act(() => {
            render(createElement(C), body);
          });

          expect(C).toHaveBeenCalledTimes(2);
          expect(callbacks).toHaveLength(2);
          expect(callbacks[0]).toBe(callbacks[1]);
          expect(callbacks[0]).not.toHaveBeenCalled();
        });
      });

      describe('with changed deps', () => {
        it('initializes value again', () => {
          const body = document.createElement('body');
          const callbacks: jest.Mock[] = [];
          const C = jest.fn(() => {
            callbacks.push(useCallback(jest.fn(), [{}]));
          });

          act(() => {
            render(createElement(C), body);
          });

          act(() => {
            render(createElement(C), body);
          });

          expect(C).toHaveBeenCalledTimes(2);
          expect(callbacks).toHaveLength(2);
          expect(callbacks[0]).not.toBe(callbacks[1]);
          expect(callbacks[0]).not.toHaveBeenCalled();
          expect(callbacks[1]).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('when component changes', () => {
    describe('with empty deps', () => {
      it('initializes value again', () => {
        const body = document.createElement('body');
        const callbacks: jest.Mock[] = [];
        const C = jest.fn(() => {
          callbacks.push(useCallback(jest.fn(), []));
        });
        const C2 = jest.fn(() => {
          callbacks.push(useCallback(jest.fn(), []));
        });

        act(() => {
          render(createElement(C), body);
        });

        act(() => {
          render(createElement(C2), body);
        });

        expect(C).toHaveBeenCalledTimes(1);
        expect(C2).toHaveBeenCalledTimes(1);
        expect(callbacks).toHaveLength(2);
        expect(callbacks[0]).not.toBe(callbacks[1]);
        expect(callbacks[0]).not.toHaveBeenCalled();
        expect(callbacks[1]).not.toHaveBeenCalled();
      });
    });

    describe('with non-empty deps', () => {
      describe('with shallow equal deps', () => {
        it('initializes value again', () => {
          const body = document.createElement('body');
          const callbacks: jest.Mock[] = [];
          const C = jest.fn(() => {
            callbacks.push(useCallback(jest.fn(), ['deps']));
          });
          const C2 = jest.fn(() => {
            callbacks.push(useCallback(jest.fn(), ['deps']));
          });

          act(() => {
            render(createElement(C), body);
          });

          act(() => {
            render(createElement(C2), body);
          });

          expect(C).toHaveBeenCalledTimes(1);
          expect(C2).toHaveBeenCalledTimes(1);
          expect(callbacks).toHaveLength(2);
          expect(callbacks[0]).not.toBe(callbacks[1]);
          expect(callbacks[0]).not.toHaveBeenCalled();
          expect(callbacks[1]).not.toHaveBeenCalled();
        });
      });

      describe('with changed deps', () => {
        it('initializes value again', () => {
          const body = document.createElement('body');
          const callbacks: jest.Mock[] = [];
          const C = jest.fn(() => {
            callbacks.push(useCallback(jest.fn(), [{}]));
          });
          const C2 = jest.fn(() => {
            callbacks.push(useCallback(jest.fn(), [{}]));
          });

          act(() => {
            render(createElement(C), body);
          });

          act(() => {
            render(createElement(C2), body);
          });

          expect(C).toHaveBeenCalledTimes(1);
          expect(C2).toHaveBeenCalledTimes(1);
          expect(callbacks).toHaveLength(2);
          expect(callbacks[0]).not.toBe(callbacks[1]);
          expect(callbacks[0]).not.toHaveBeenCalled();
          expect(callbacks[1]).not.toHaveBeenCalled();
        });
      });
    });
  });
});

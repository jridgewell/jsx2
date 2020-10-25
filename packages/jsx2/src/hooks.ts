type FunctionComponentFiber = import('./fiber').FunctionComponentFiber;
type RefObject = import('./create-ref').RefObject;

export type HookState = {
  cleanup: null | undefined | void | EffectCleanup;
  data: unknown;
};

type State = {
  index: number;
  fiber: FunctionComponentFiber;
};

type Effect = () => null | undefined | void | EffectCleanup;
type EffectCleanup = () => void;

import { createRef } from './create-ref';
import { defer } from './defer';
import { enqueueDiff } from './diff/enqueue-diff';
import { shallowArrayEquals } from './util/shallow-array-equals';

let fiberStack: State[] = [];

export function pushHooksFiber(fiber: FunctionComponentFiber) {
  fiberStack.push({
    index: 0,
    fiber,
  });
}

export function popHooksFiber() {
  fiberStack.pop();
}

function currentFiberState(): State {
  return fiberStack[fiberStack.length - 1];
}

function getHookState(): HookState {
  const current = currentFiberState();
  const { stateData } = current.fiber;
  const index = current.index++;
  if (stateData.length > index) {
    return stateData[index];
  }
  return (stateData[index] = {
    cleanup: null,
    data: null,
  });
}

type Lazy<S> = () => S;
function lazy<S>(f: Lazy<S>): S {
  return f();
}
type NextState<S> = (prevState: S) => S;
function result<S>(prevState: S, nextState: S | NextState<S>): S {
  return typeof nextState === 'function' ? (nextState as NextState<S>)(prevState) : nextState;
}

type StateSetter<S> = (nextState: S | ((state: S) => S)) => void;
type StateState<S> = [S, StateSetter<S>];
export function useState<S>(initial: S | Lazy<S>): StateState<S> {
  if (typeof initial === 'function') {
    return useReducer(result, initial as Lazy<S>, lazy);
  }
  return useReducer(result, initial as S);
}

type Reducer<S, A> = (prevState: S, action: A) => S;
type ReducerState<S, A> = [S, (action: A) => void];
export function useReducer<S, A, I>(reducer: Reducer<S, A>, initial: S): ReducerState<S, A>;
export function useReducer<S, A, I>(
  reducer: Reducer<S, A>,
  initial: I,
  init: (initial: I) => S,
): ReducerState<S, A>;
export function useReducer<S, A, I>(
  reducer: Reducer<S, A>,
  initial: S | I,
  init?: (initial: I) => S,
): ReducerState<S, A> {
  const hookState = getHookState();
  let data = hookState.data as null | [S, (action: A) => void]
  if (data) {
    return data;
  }

  const { fiber } = currentFiberState();
  const initialState = init ? init(initial as I) : (initial as S);
  const dispatch = (action: A) => {
    data![0] = reducer(data![0], action);
    enqueueDiff(fiber);
  };
  data = [initialState, dispatch] as ReducerState<S, A>;
  return (hookState.data = data);
}

export function useEffect(effect: Effect, deps: unknown[] = []) {
  const hookState = getHookState();
  if (shallowArrayEquals(hookState.data as unknown[], deps)) {
    return;
  }
  hookState.data = deps;
  // TODO: After paint
  defer(() => {
    const { cleanup } = hookState;
    if (cleanup) cleanup();
    hookState.cleanup = effect();
  });
}

export function useRef(initial: unknown): RefObject {
  return useMemo(() => {
    const ref = createRef();
    ref.current = initial;
    return ref;
  }, []);
}

export function useMemo<T>(factory: () => T, deps: undefined | unknown[]): T {
  const hookState = getHookState();
  const data = hookState.data as null | [undefined | unknown[], T];
  if (data && shallowArrayEquals(deps, data[0])) {
    return data[1];
  }
  const init = factory();
  hookState.data = [deps, init];
  return init;
}

export function useCallback<T extends Function>(cb: T, deps: unknown[]): T {
  return useMemo(() => cb, deps);
}

export function useDebugValue(): void {
  // purposefully noop.
}

// TODO:
export function useContext() {}
export function useErrorBoundary() {}
export function useImperativeHandle() {}
export function useLayoutEffect() {}

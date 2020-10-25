import type { FunctionComponentFiber } from './fiber';
import type { RefObject } from './create-ref';
import type { RefWork } from './diff/ref';

export type HookState = {
  cleanup: null | undefined | void | EffectCleanup;
  data: unknown;
};

type FiberState = {
  index: number;
  fiber: FunctionComponentFiber;
};

type EffectCleanup = () => void;
type Effect = () => null | undefined | void | EffectCleanup;
type Lazy<S> = () => S;
type NextState<S> = (prevState: S) => S;
type StateSetter<S> = (nextState: S | NextState<S>) => void;
type StateState<S> = [S, StateSetter<S>];
type Reducer<S, A> = (prevState: S, action: A) => S;
type ReducerState<S, A> = [S, (action: A) => void];

import { defer } from './defer';
import { enqueueDiff } from './diff/enqueue-diff';
import { shallowArrayEquals } from './util/shallow-array-equals';

const fiberStack: FiberState[] = [];

export function pushHooksFiber(fiber: FunctionComponentFiber): void {
  fiberStack.push({
    index: 0,
    fiber,
  });
}

export function popHooksFiber(): void {
  fiberStack.pop();
}

function currentFiberState(): FiberState {
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

function lazy<S>(f: Lazy<S>): S {
  return f();
}
function result<S>(prevState: S, nextState: S | NextState<S>): S {
  return typeof nextState === 'function' ? (nextState as NextState<S>)(prevState) : nextState;
}

export function useState<S>(initial: S | Lazy<S>): StateState<S> {
  if (typeof initial === 'function') {
    return useReducer(result, initial as Lazy<S>, lazy);
  }
  return useReducer(result, initial as S);
}

export function useReducer<S, A>(reducer: Reducer<S, A>, initial: S): ReducerState<S, A>;
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
  let data = hookState.data as null | ReducerState<S, A>;
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

export function useEffect(effect: Effect, deps: unknown[] = []): void {
  const hookState = getHookState();
  if (shallowArrayEquals(hookState.data as null | unknown[], deps)) {
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

export function useLayoutEffect(effect: Effect, deps: unknown[] = []): void {
  const hookState = getHookState();
  if (shallowArrayEquals(hookState.data as null | unknown[], deps)) {
    return;
  }
  hookState.data = deps;
  // TODO: This is super hacky. And incorrect. All the cleanups should fire first, then all the effects.
  // Refs apply, then cleanup, then effects.
  [].push({
    current: null,
    old: null,
    ref() {
      const { cleanup } = hookState;
      if (cleanup) cleanup();
      hookState.cleanup = effect();
    },
  } as never);
}

export function useMemo<T>(factory: () => T, deps: undefined | unknown[]): T {
  const hookState = getHookState();
  const data = hookState.data as null | [undefined | unknown[], T];
  if (data !== null && shallowArrayEquals(deps, data[0])) {
    return data[1];
  }
  const init = factory();
  hookState.data = [deps, init];
  return init;
}

export function useRef(initial: unknown): RefObject {
  return useMemo(() => ({ current: initial }), []);
}

export function useCallback<T>(cb: T, deps: unknown[]): T {
  return useMemo(() => cb, deps);
}

export function useDebugValue(): void {
  // purposefully noop.
}

// TODO:
/* eslint-disable @typescript-eslint/no-empty-function */
export function useContext(): void {}
export function useErrorBoundary(): void {}
export function useImperativeHandle(): void {}

import type { FunctionComponentFiber } from './fiber';
import type { RefObject } from './create-ref';

export type HookState =
  | {
      effect: false;
      data: unknown;
    }
  | {
      effect: true;
      data: EffectState;
    };

type FiberState = {
  index: number;
  fiber: FunctionComponentFiber;
  layoutEffects: EffectState[];
};

type EffectCleanup = null | undefined | void | (() => void);
type Effect = () => EffectCleanup;
type Lazy<S> = () => S;
type NextState<S> = (prevState: S) => S;
type StateSetter<S> = (nextState: S | NextState<S>) => void;
type StateState<S> = [S, StateSetter<S>];
type Reducer<S, A> = (prevState: S, action: A) => S;
type ReducerState<S, A> = [S, (action: A) => void];

export type EffectState = {
  deps: unknown[];
  cleanup: EffectCleanup;
  effect: Effect;
};

import { defer } from './defer';
import { enqueueDiff } from './diff/enqueue-diff';
import { shallowArrayEquals } from './util/shallow-array-equals';

const fiberStack: FiberState[] = [];

export function pushHooksFiber(fiber: FunctionComponentFiber, layoutEffects: EffectState[]): void {
  fiberStack.push({
    index: 0,
    fiber,
    layoutEffects,
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
  return (stateData[index] = { effect: false, data: null });
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
  hookState.effect = true;
  hookState.data = deps;
  // TODO: After paint
  defer(() => {
    // const { cleanup } = hookState;
    // if (cleanup) cleanup();
    // hookState.cleanup = effect();
  });
}

export function useLayoutEffect(effect: Effect, deps: unknown[] = []): void {
  const hookState = getHookState();
  const oldData = hookState.data as EffectState;
  if (oldData !== null && shallowArrayEquals(oldData.deps, deps)) {
    return;
  }
  hookState.effect = true;
  const data = (hookState.data = {
    deps,
    effect,
    cleanup: oldData?.cleanup,
  });
  currentFiberState().layoutEffects.push(data);
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

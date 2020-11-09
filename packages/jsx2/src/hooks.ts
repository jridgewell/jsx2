import type { Context, ContextHolder } from './create-context';
import type { Ref } from './create-ref';
import type { Fiber } from './fiber';

import { scheduleEffect } from './diff/effects';
import { enqueueDiff } from './diff/enqueue-diff';
import { setRef } from './diff/ref';
import { getCurrentFiberState } from './diff/render-component-with-hooks';
import { getAncestorFiber } from './fiber/get-ancestor-fiber';
import { shallowArrayEquals } from './util/shallow-array-equals';

export type EffectHookState = {
  effect: true;
  data: EffectState;
};
export type HookState =
  | {
      effect: false;
      data: unknown;
    }
  | EffectHookState;

export type EffectCleanup = null | undefined | void | (() => void);
export type Effect = () => EffectCleanup;
type Lazy<S> = () => S;
type NextState<S> = (prevState: S) => S;
type StateState<S> = readonly [S, (nextState: S | NextState<S>) => void];
type Reducer<S, A> = (prevState: S, action: A) => S;
type ReducerState<S, A> = readonly [S, (action: A) => void];

export type EffectState = {
  deps: undefined | unknown[];
  cleanup: EffectCleanup;
  effect: Effect;
  active: boolean;
};

function getHookState(): HookState {
  const current = getCurrentFiberState();
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
  const data = hookState.data as null | ReducerState<S, A>;
  if (data) {
    return data;
  }

  const { fiber } = getCurrentFiberState();
  const initialState = init ? init(initial as I) : (initial as S);
  const dispatch = (action: A) => {
    const old = (hookState.data as ReducerState<S, A>)[0];
    const value = reducer(old, action);
    if (value === old) return;
    hookState.data = [value, dispatch];
    enqueueDiff(fiber);
  };
  return (hookState.data = [initialState, dispatch] as const);
}

export function useEffect(effect: Effect, deps?: unknown[]): void {
  const hookState = getHookState();
  const oldData = hookState.data as EffectState;
  if (oldData !== null) {
    if (shallowArrayEquals(oldData.deps, deps)) {
      return;
    }
    oldData.active = false;
  }
  hookState.effect = true;
  const data = (hookState.data = {
    deps,
    effect,
    cleanup: oldData?.cleanup,
    active: true,
  });
  scheduleEffect(data);
}

export function useLayoutEffect(effect: Effect, deps?: unknown[]): void {
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
    active: true,
  });
  getCurrentFiberState().layoutEffects.push(data);
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

export function useRef<T extends unknown>(initial: T): { current: T } {
  return useMemo(() => ({ current: initial }), []);
}

export function useCallback<T>(cb: T, deps: unknown[]): T {
  return useMemo(() => cb, deps);
}

export function useDebugValue(_label: string): void {
  // purposefully noop.
}

export function useContext<T>(ctx: Context<T>): T {
  const hookState = getHookState();
  const data = hookState.data as null | ContextHolder<T>;
  if (data) {
    return data.value;
  }

  const { fiber } = getCurrentFiberState();
  let holder: ContextHolder<T> = { value: ctx._defaultValue, context: ctx, consumers: [] };
  let current: null | Fiber = fiber;
  while ((current = current.parent || getAncestorFiber(current)) !== null) {
    const { providedContext } = current;
    if (providedContext === null) continue;
    if (providedContext.context !== ctx) continue;

    const consumedContexts = (fiber.consumedContexts ||= []);
    holder = providedContext;
    consumedContexts.push(holder);
    holder.consumers.push(fiber);
    break;
  }
  hookState.data = holder;
  return holder.value;
}

export function useImperativeHandle<R>(ref: Ref, createHandle: () => R, deps?: unknown[]): void {
  return useLayoutEffect(() => setRef(createHandle(), ref), deps);
}

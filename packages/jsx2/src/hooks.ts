import type { Context, ContextHolder } from './create-context';
import type { Ref } from './create-ref';
import type { Fiber } from './fiber';
import type { ComputedSignalContext, EffectSignalContext, SignalSignalContext } from './signals';

import { SignalContextType, getCurrentContext, notifyDependents, setContext } from './signals';
import { scheduleEffect, scheduleLayoutEffect } from './diff/effects';
import { enqueueDiff } from './diff/enqueue-diff';
import { setRef } from './diff/ref';
import { getCurrentFiberState } from './diff/render-component-with-hooks';
import { getAncestorFiber } from './fiber/get-ancestor-fiber';
import { shallowArrayEquals } from './util/shallow-array-equals';

export enum HookType {
  REGULAR,
  EFFECT,
  LAYOUT_EFFECT,
  SIGNAL,
}

export interface SignalData<S> {
  context: SignalSignalContext;
  fns: SignalFns<S>;
}

export interface ComputedData<S> {
  context: ComputedSignalContext;
  getter: () => S;
}

export interface RegularHookState {
  type: HookType.REGULAR;
  data: unknown;
}

export interface EffectHookState {
  type: HookType.EFFECT;
  data: EffectData;
}

export interface SignalHookState<S = unknown> {
  type: HookType.SIGNAL;
  data: SignalData<S> | ComputedData<S>;
}

export interface LayoutEffectHookState {
  type: HookType.LAYOUT_EFFECT;
  data: LayoutEffectData;
}

export type HookState =
  | RegularHookState
  | EffectHookState
  | SignalHookState
  | LayoutEffectHookState;

export type EffectCleanup = null | undefined | void | (() => void);
export type Effect = () => EffectCleanup;
type Lazy<S> = () => S;
type NextState<S> = (prevState: S) => S;
type StateState<S> = readonly [S, (nextState: S | NextState<S>) => void];
type Reducer<S, A> = (prevState: S, action: A) => S;
type ReducerState<S, A> = readonly [S, (action: A) => void];
type SignalFns<S> = readonly [() => S, (next: S) => void, (cb: (prev: S) => S) => void];

export interface LayoutEffectData {
  deps: undefined | unknown[];
  cleanup: EffectCleanup;
  effect: Effect;
  active: boolean;
  scheduled: boolean;
}

export interface EffectData extends LayoutEffectData {
  context: EffectSignalContext;
}

function getHookState(): HookState {
  const current = getCurrentFiberState();
  const { stateData } = current.fiber;
  const index = current.index++;
  if (stateData.length > index) {
    return stateData[index];
  }
  return (stateData[index] = { type: HookType.REGULAR, data: null });
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

export function useSignal<S>(initial: S): SignalFns<S> {
  const hookState = getHookState();
  if (hookState.data) return (hookState.data as SignalData<S>).fns;

  let value = initial;
  const context: SignalSignalContext = {
    type: SignalContextType.SIGNAL,
    dependents: new Set(),
    dependencies: new Set(),
  };
  const fns = [getter, setter, update] as const;

  function getter() {
    const current = getCurrentContext();
    if (current) {
      context.dependents.add(current);
      current.dependencies.add(context);
    }
    return value;
  }

  function setter(next: S) {
    if (next === value) return;
    value = next;
    notifyDependents(context.dependents);
  }

  function update(cb: (prev: S) => S) {
    setter(cb(value));
  }

  hookState.type = HookType.SIGNAL;
  hookState.data = { context, fns };
  return fns;
}

export function useComputed<T>(cb: () => T): () => T {
  const hookState = getHookState();
  const data = hookState.data as null | ComputedData<T>;
  if (data) return data.getter;

  let value: T;

  const context: ComputedSignalContext = {
    type: SignalContextType.COMPUTED,
    dirty: true,
    dependents: new Set(),
    dependencies: new Set(),
  };

  function getter() {
    if (context.dirty) {
      const oldContext = setContext(context);
      try {
        value = cb();
        context.dirty = false;
      } finally {
        setContext(oldContext);
      }
    }
    const ctx = getCurrentContext();
    if (ctx) {
      context.dependents.add(ctx);
      ctx.dependencies.add(context);
    }
    return value;
  }

  hookState.type = HookType.SIGNAL;
  hookState.data = { context, getter };
  return getter;
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
  let data = hookState.data as null | EffectData;
  if (data !== null) {
    if (!shallowArrayEquals(data.deps, deps)) {
      data.deps = deps;
      scheduleEffect(data);
    }
    return;
  }
  data = {
    deps,
    effect: wrappedEffect,
    cleanup: null,
    active: true,
    scheduled: false,
    context: null as unknown as EffectSignalContext,
  };
  const context: EffectSignalContext = {
    type: SignalContextType.EFFECT,
    state: data,
    dependents: new Set(),
    dependencies: new Set(),
  };
  data.context = context;

  function wrappedEffect() {
    const oldContext = setContext(context);
    try {
      return effect();
    } finally {
      setContext(oldContext);
    }
  }

  hookState.type = HookType.EFFECT;
  hookState.data = data;
  scheduleEffect(data);
}

export function useLayoutEffect(effect: Effect, deps?: unknown[]): void {
  const hookState = getHookState();
  let data = hookState.data as null | LayoutEffectData;
  if (data !== null) {
    if (!shallowArrayEquals(data.deps, deps)) {
      data.deps = deps;
      scheduleLayoutEffect(data);
    }
    return;
  }

  data = {
    deps,
    effect,
    cleanup: null,
    active: true,
    scheduled: false,
  };
  hookState.type = HookType.LAYOUT_EFFECT;
  hookState.data = data;
  scheduleLayoutEffect(data);
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

export function useRef<T>(initial: T): { current: T } {
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

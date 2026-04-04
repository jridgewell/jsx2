import type { Context, ContextHolder } from './create-context';
import type { Ref } from './create-ref';
import type { Fiber } from './fiber';
import type { ComputedSignalContext, EffectSignalContext, SignalSignalContext } from './signals';

import {
  SignalContextEnum,
  context,
  createSignal,
  finalizeDependencies,
  getCurrentContext,
  linkContexts,
  notifyDependents,
  prepareDependencies,
  setContext,
} from './signals';
import { scheduleEffect, scheduleLayoutEffect } from './diff/effects';
import { enqueueDiff } from './diff/enqueue-diff';
import { setRef } from './diff/ref';
import { getCurrentFiberState } from './diff/render-component-with-hooks';
import { getAncestorFiber } from './fiber/get-ancestor-fiber';
import { shallowArrayEquals } from './util/shallow-array-equals';

export enum HookEnum {
  REGULAR,
  EFFECT,
  LAYOUT_EFFECT,
  SIGNAL,
}

export interface SignalData<S> {
  ctx: SignalSignalContext;
  fns: SignalFns<S>;
}

export interface ComputedData<S> {
  ctx: ComputedSignalContext;
  getter: () => S;
  cb: () => S;
  deps?: unknown[];
}

export interface RegularHookState {
  type: HookEnum.REGULAR;
  data: unknown;
}

export interface EffectHookState {
  type: HookEnum.EFFECT;
  data: EffectEffectData;
}

export interface SignalHookState<S = unknown> {
  type: HookEnum.SIGNAL;
  data: SignalData<S> | ComputedData<S>;
}

export interface LayoutEffectHookState {
  type: HookEnum.LAYOUT_EFFECT;
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

export interface BaseEffectData {
  deps: undefined | unknown[];
  cleanup: EffectCleanup;
  effect: Effect;
  active: boolean;
  scheduled: boolean;
}

export interface LayoutEffectData extends BaseEffectData {
  type: HookEnum.LAYOUT_EFFECT;
  innerEffect: null;
  ctx: null;
}

export interface EffectEffectData extends BaseEffectData {
  type: HookEnum.EFFECT;
  innerEffect: Effect;
  ctx: EffectSignalContext;
}

function getHookState(): HookState {
  const current = getCurrentFiberState();
  const { stateData } = current.fiber;
  const index = current.index++;
  if (stateData.length > index) {
    return stateData[index];
  }
  return (stateData[index] = { type: HookEnum.REGULAR, data: null });
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

  const { 0: getter, 1: setter, 2: update, 3: ctx } = createSignal(initial);
  const fns = [getter, setter, update] as const;
  hookState.type = HookEnum.SIGNAL;
  hookState.data = { ctx, fns };
  return fns;
}

export function useComputed<T>(cb: () => T, deps?: unknown[]): () => T {
  const hookState = getHookState();
  const current = hookState.data as null | ComputedData<T>;
  if (current) {
    if (!shallowArrayEquals(current.deps, deps)) {
      current.cb = cb;
      current.deps = deps;
      current.ctx.dirty = true;
      notifyDependents(current.ctx.nextDependent);
    }
    return current.getter;
  }

  let value: T;

  const ctx = context(SignalContextEnum.COMPUTED);
  ctx.dirty = true;

  const data = { ctx, cb, getter, deps };
  function getter() {
    if (ctx.dirty) {
      const oldContext = setContext(ctx);
      try {
        const { cb } = data;
        prepareDependencies(ctx);
        value = cb();
        finalizeDependencies(ctx);
        ctx.dirty = false;
      } finally {
        setContext(oldContext);
      }
    }
    const current = getCurrentContext();
    if (current) linkContexts(ctx, current);
    return value;
  }

  hookState.type = HookEnum.SIGNAL;
  hookState.data = data;
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
  if (data) return data;

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
  const current = hookState.data as null | EffectEffectData;
  if (current !== null) {
    if (!shallowArrayEquals(current.deps, deps)) {
      current.deps = deps;
      current.innerEffect = effect;
      scheduleEffect(current);
    }
    return;
  }
  const data: EffectEffectData = {
    type: HookEnum.EFFECT,
    deps,
    innerEffect: effect,
    effect: wrappedEffect,
    cleanup: null,
    active: true,
    scheduled: false,
    ctx: null as unknown as EffectSignalContext,
  };
  const ctx = context(SignalContextEnum.EFFECT);
  ctx.state = data;
  data.ctx = ctx;

  function wrappedEffect() {
    const oldContext = setContext(ctx);
    try {
      prepareDependencies(ctx);
      const { innerEffect } = data;
      const res = innerEffect();
      finalizeDependencies(ctx);
      return res;
    } finally {
      setContext(oldContext);
    }
  }

  hookState.type = HookEnum.EFFECT;
  hookState.data = data;
  scheduleEffect(data);
}

export function useLayoutEffect(effect: Effect, deps?: unknown[]): void {
  const hookState = getHookState();
  let data = hookState.data as null | LayoutEffectData;
  if (data !== null) {
    if (!shallowArrayEquals(data.deps, deps)) {
      data.deps = deps;
      data.effect = effect;
      scheduleLayoutEffect(data);
    }
    return;
  }

  data = {
    type: HookEnum.LAYOUT_EFFECT,
    deps,
    innerEffect: null,
    effect,
    cleanup: null,
    active: true,
    scheduled: false,
    ctx: null,
  };
  hookState.type = HookEnum.LAYOUT_EFFECT;
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

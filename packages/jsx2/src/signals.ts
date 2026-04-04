import type { FunctionComponentFiber, SignalFiber } from './fiber';
import type { EffectEffectData } from './hooks';

import { rediffSignalChild } from './diff/diff-tree';
import { scheduleEffect } from './diff/effects';
import { enqueueDiff } from './diff/enqueue-diff';
import { rediffProp } from './diff/prop';

export enum SignalContextEnum {
  SIGNAL = 0,
  COMPONENT = 1,
  COMPUTED = 2,
  EFFECT = 3,
  CHILD = 4,
  ATTRIBUTE = 5,
}

interface BaseContext {
  type: SignalContextEnum;
  dependents: Set<SignalContext>;
  dependencies: Set<SignalContext>;
  alternateDependencies: Set<SignalContext>;
}

export interface SignalSignalContext extends BaseContext {
  type: SignalContextEnum.SIGNAL;
  fiber: null;
  dirty: false;
  state: null;
  el: null;
  name: '';
  getter: null;
  oldValue: null;
}

export interface ComponentSignalContext extends BaseContext {
  type: SignalContextEnum.COMPONENT;
  fiber: FunctionComponentFiber;
  dirty: false;
  state: null;
  el: null;
  name: '';
  getter: null;
  oldValue: null;
}

export interface ComputedSignalContext extends BaseContext {
  type: SignalContextEnum.COMPUTED;
  fiber: null;
  dirty: boolean;
  state: null;
  el: null;
  name: '';
  getter: null;
  oldValue: null;
}

export interface EffectSignalContext extends BaseContext {
  type: SignalContextEnum.EFFECT;
  fiber: null;
  dirty: false;
  state: EffectEffectData;
  el: null;
  name: '';
  getter: null;
  oldValue: null;
}

export interface ChildSignalContext extends BaseContext {
  type: SignalContextEnum.CHILD;
  fiber: SignalFiber;
  dirty: false;
  state: null;
  el: null;
  name: '';
  getter: null;
  oldValue: null;
}

export interface AttributeSignalContext extends BaseContext {
  type: SignalContextEnum.ATTRIBUTE;
  fiber: null;
  dirty: false;
  state: null;
  el: HTMLElement | SVGElement;
  name: string;
  getter: () => unknown;
  oldValue: unknown;
}

export type SignalContext =
  | SignalSignalContext
  | ComponentSignalContext
  | ComputedSignalContext
  | EffectSignalContext
  | ChildSignalContext
  | AttributeSignalContext;

let currentContext: null | SignalContext = null;

export function getCurrentContext(): SignalContext | null {
  return currentContext;
}

export function setContext(ctx: SignalContext | null): null | SignalContext {
  const old = currentContext;
  currentContext = ctx;
  return old;
}

export function cleanupContext(ctx: SignalContext): void {
  const { dependencies } = ctx;
  for (const dep of dependencies) {
    dep.dependents.delete(ctx);
  }
  dependencies.clear();
}

export function finalizeDependencies(ctx: SignalContext): void {
  const { dependencies, alternateDependencies } = ctx;
  for (const dep of alternateDependencies) {
    if (!dependencies.has(dep)) {
      dep.dependents.delete(ctx);
    }
  }
  alternateDependencies.clear();
}

export function prepareDependencies(ctx: SignalContext): void {
  const { dependencies, alternateDependencies } = ctx;
  ctx.alternateDependencies = dependencies;
  ctx.dependencies = alternateDependencies;
}

export function notifyDependents(dependents: Set<SignalContext>): void {
  if (dependents.size === 0) return;

  for (const dep of dependents) {
    if (dep.type === SignalContextEnum.COMPONENT) {
      enqueueDiff(dep.fiber);
    } else if (dep.type === SignalContextEnum.COMPUTED) {
      if (dep.dirty) continue;
      dep.dirty = true;
      notifyDependents(dep.dependents);
    } else if (dep.type === SignalContextEnum.EFFECT) {
      scheduleEffect(dep.state);
    } else if (dep.type === SignalContextEnum.CHILD) {
      rediffSignalChild(dep.fiber);
    } else if (dep.type === SignalContextEnum.ATTRIBUTE) {
      rediffProp(dep);
    }
  }
}

export function context<T extends SignalContext['type']>(
  type: T,
): T extends SignalContextEnum.SIGNAL
  ? SignalSignalContext
  : T extends SignalContextEnum.COMPONENT
  ? ComponentSignalContext
  : T extends SignalContextEnum.COMPUTED
  ? ComputedSignalContext
  : T extends SignalContextEnum.EFFECT
  ? EffectSignalContext
  : T extends SignalContextEnum.CHILD
  ? ChildSignalContext
  : T extends SignalContextEnum.ATTRIBUTE
  ? AttributeSignalContext
  : never {
  return {
    type,
    dependents: new Set(),
    dependencies: new Set(),
    alternateDependencies: new Set(),
    fiber: null,
    dirty: false,
    state: null,
    el: null,
    name: '',
    getter: null,
    oldValue: null,
  } as any;
}

export function createSignal<S>(
  initial: S,
): readonly [() => S, (next: S) => void, (cb: (prev: S) => S) => void, SignalSignalContext] {
  let value = initial;
  const ctx = context(SignalContextEnum.SIGNAL);

  function getter() {
    const current = getCurrentContext();
    if (current) {
      ctx.dependents.add(current);
      current.dependencies.add(ctx);
    }
    return value;
  }

  function setter(next: S) {
    if (next === value) return;
    value = next;
    notifyDependents(ctx.dependents);
  }

  function update(cb: (prev: S) => S) {
    setter(cb(value));
  }

  return [getter, setter, update, ctx] as const;
}

export function signal<S>(
  initial: S,
): readonly [() => S, (next: S) => void, (cb: (prev: S) => S) => void] {
  const { 0: getter, 1: setter, 2: update } = createSignal(initial);
  return [getter, setter, update];
}

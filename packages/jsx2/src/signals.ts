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

export interface BaseContext {
  type: SignalContextEnum;
  dependents: Set<SignalContext>;
  dependencies: Set<SignalContext>;
}

export interface SignalSignalContext extends BaseContext {
  type: SignalContextEnum.SIGNAL;
}

export interface ComponentSignalContext extends BaseContext {
  type: SignalContextEnum.COMPONENT;
  fiber: FunctionComponentFiber;
}

export interface ComputedSignalContext extends BaseContext {
  type: SignalContextEnum.COMPUTED;
  dirty: boolean;
}

export interface EffectSignalContext extends BaseContext {
  type: SignalContextEnum.EFFECT;
  state: EffectEffectData;
}

export interface ChildSignalContext extends BaseContext {
  type: SignalContextEnum.CHILD;
  fiber: SignalFiber;
}

export interface AttributeSignalContext extends BaseContext {
  type: SignalContextEnum.ATTRIBUTE;
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

export function notifyDependents(dependents: Set<SignalContext>): void {
  const slice = Array.from(dependents);
  dependents.clear();

  for (const dep of slice) {
    cleanupContext(dep);

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

export function createSignal<S>(
  initial: S,
): readonly [() => S, (next: S) => void, (cb: (prev: S) => S) => void, SignalSignalContext] {
  let value = initial;
  const context: SignalSignalContext = {
    type: SignalContextEnum.SIGNAL,
    dependents: new Set(),
    dependencies: new Set(),
  };

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

  return [getter, setter, update, context] as const;
}

export function signal<S>(
  initial: S,
): readonly [() => S, (next: S) => void, (cb: (prev: S) => S) => void] {
  const { 0: getter, 1: setter, 2: update } = createSignal(initial);
  return [getter, setter, update];
}

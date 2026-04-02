import type { FunctionComponentFiber } from './fiber';
import type { EffectState } from './hooks';

import { scheduleEffect } from './diff/effects';
import { enqueueDiff } from './diff/enqueue-diff';

export enum SignalContextType {
  SIGNAL = 0,
  COMPONENT = 1,
  COMPUTED = 2,
  EFFECT = 3,
}

export interface BaseContext {
  type: SignalContextType;
  dependents: Set<SignalContext>;
  dependencies: Set<SignalContext>;
}

export interface SignalSignalContext extends BaseContext {
  type: SignalContextType.SIGNAL;
}

export interface ComponentSignalContext extends BaseContext {
  type: SignalContextType.COMPONENT;
  fiber: FunctionComponentFiber;
}

export interface ComputedSignalContext extends BaseContext {
  type: SignalContextType.COMPUTED;
  dirty: boolean;
}

export interface EffectSignalContext extends BaseContext {
  type: SignalContextType.EFFECT;
  state: EffectState;
}

export type SignalContext =
  | SignalSignalContext
  | ComponentSignalContext
  | ComputedSignalContext
  | EffectSignalContext;

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
    if (dep.type === SignalContextType.COMPONENT) {
      enqueueDiff(dep.fiber);
    } else if (dep.type === SignalContextType.COMPUTED) {
      if (dep.dirty) continue;
      dep.dirty = true;
      notifyDependents(dep.dependents);
    } else if (dep.type === SignalContextType.EFFECT) {
      scheduleEffect(dep.state);
    }
    cleanupContext(dep);
  }
}

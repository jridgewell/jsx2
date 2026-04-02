import type { FunctionComponentFiber } from './fiber';
import type { EffectState } from './hooks';
import { enqueueDiff } from './diff/enqueue-diff';
import { scheduleEffect } from './diff/effects';

export type SignalContext =
  | {
    type: 'component';
    fiber: FunctionComponentFiber;
  }
  | {
    type: 'computed';
    markDirty: () => void;
    dependents: Set<SignalContext>;
  }
  | {
    type: 'effect';
    state: EffectState;
  };

let currentContext: null | SignalContext = null;

export function getCurrentContext(): SignalContext | null {
  return currentContext;
}

export function setContext(ctx: SignalContext | null): null | SignalContext {
  const old = currentContext;
  currentContext = ctx;
  return old;
}

export function notifyDependents(dependents: Set<SignalContext>): void {
  for (const dep of dependents) {
    if (dep.type === 'component') {
      enqueueDiff(dep.fiber);
    } else if (dep.type === 'computed') {
      dep.markDirty();
    } else if (dep.type === 'effect') {
      scheduleEffect(dep.state);
    }
  }
}
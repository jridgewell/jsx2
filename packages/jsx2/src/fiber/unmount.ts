import type { Fiber, FunctionComponentFiber } from '.';
import type { ContextHolder } from '../create-context';
import type { HookState } from '../hooks';
import type { AttributeSignalContext } from '../signals';

import { HookType } from '../hooks';
import { cleanupContext } from '../signals';
import { cleanupEffects } from '../diff/effects';
import { setRef } from '../diff/ref';
import { assert } from '../util/assert';

export function unmount(fiber: Fiber): void {
  unmountRange(fiber, fiber.next);
}

function unmountRange(fiber: Fiber, end: null | Fiber): void {
  let current: null | Fiber = fiber;
  do {
    debug: assert(current !== null, 'end is guaranteed to prevent null loop');
    const { ref, stateData, signalContext, consumedContexts, child, attributeSignals } = current;
    if (ref) setRef(null, ref);
    if (signalContext) cleanupContext(signalContext);
    if (attributeSignals) cleanupAttributes(attributeSignals);
    if (stateData) {
      cleanupEffects(stateData);
      cleanupSignals(stateData);
    }

    if (consumedContexts) {
      cleanupConsumedContexts(current, consumedContexts);
    }
    if (child) unmountRange(child, null);
    current.mounted = false;

    current = current.next;
  } while (current !== end);
}

function cleanupAttributes(attributeSignals: Record<string, null | AttributeSignalContext>): void {
  for (const name in attributeSignals) {
    const context = attributeSignals[name];
    if (context !== null) cleanupContext(context);
  }
}

function cleanupSignals(stateData: HookState[]): void {
  for (let i = 0; i < stateData.length; i++) {
    const state = stateData[i];
    if (state.type === HookType.SIGNAL || state.type === HookType.EFFECT) {
      cleanupContext(state.data.context);
    }
  }
}

function cleanupConsumedContexts<T>(
  fiber: FunctionComponentFiber,
  contextListeners: ContextHolder<T>[],
): void {
  for (let i = 0; i < contextListeners.length; i++) {
    const { consumers } = contextListeners[i];
    const index = consumers.indexOf(fiber);
    debug: assert(index > -1, 'context listener is not preset');
    consumers.splice(index, 1);
  }
}

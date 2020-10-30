import type { Fiber, FunctionComponentFiber } from '.';
import type { ContextHolder } from '../context';

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
    const { ref, stateData, consumedContexts, child } = current;
    if (ref) setRef(null, ref);
    if (stateData) cleanupEffects(stateData);
    if (consumedContexts) {
      cleanupConsumedContexts(current as FunctionComponentFiber, consumedContexts);
    }
    if (child) unmountRange(child, null);

    current = current.next;
  } while (current !== end);
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

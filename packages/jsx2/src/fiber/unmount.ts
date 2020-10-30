import type { Fiber } from '.';
import type { ReverseContextHolder } from '../context';

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
    const { ref, stateData, contextListeners, child } = current;
    if (ref) setRef(null, ref);
    if (stateData) cleanupEffects(stateData);
    if (contextListeners) cleanupContextListeners(contextListeners);
    if (child) unmountRange(child, null);

    current = current.next;
  } while (current !== end);
}

function cleanupContextListeners<T>(contextListeners: ReverseContextHolder<T>[]): void {
  for (let i = 0; i < contextListeners.length; i++) {
    const { listeners, set } = contextListeners[i];
    const index = listeners.indexOf(set);
    debug: assert(index > -1, 'context listener is not preset');
    listeners.splice(index, 1);
  }
}

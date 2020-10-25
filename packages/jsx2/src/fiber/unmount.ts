import type { Fiber } from '.';

import { setRef } from '../diff/ref';
import { assert } from '../util/assert';

export function unmount(fiber: Fiber): void {
  unmountRange(fiber, fiber.next);
}

function unmountRange(fiber: Fiber, end: null | Fiber): void {
  let current: null | Fiber = fiber;
  do {
    debug: assert(current !== null, 'end is guaranteed to prevent null loop');
    const { ref, stateData, child } = current;
    if (ref) setRef(null, ref);
    if (stateData) {
      for (let i = 0; i < stateData.length; i++) {
        const cleanup = stateData[i].cleanup;
        if (cleanup) cleanup();
      }
    }
    if (child) unmountRange(child, null);

    current = current.next;
  } while (current !== end);
}

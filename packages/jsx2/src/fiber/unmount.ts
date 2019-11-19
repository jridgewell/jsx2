type Fiber = import('.').Fiber;

import { setRef } from '../diff/ref';
import { assert } from '../util/assert';

export function unmount(fiber: Fiber): void {
  unmountRange(fiber, fiber.next);
}

function unmountRange(fiber: Fiber, end: null | Fiber): void {
  let current: null | Fiber = fiber;
  do {
    debug: assert(current, 'end is guaranteed to prevent null loop');
    const { ref, child } = current;
    if (ref) setRef(null, ref);
    if (child) unmountRange(child, null);

    current = current.next;
  } while (current !== end);
}

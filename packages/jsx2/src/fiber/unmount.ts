type Fiber = import('.').Fiber;

import { setRef } from '../diff/ref';

export function unmount(fiber: Fiber): void {
  unmountRange(fiber, fiber.next);
}

function unmountRange(fiber: Fiber, end: null | Fiber) {
  let current: null | Fiber = fiber;
  do {
    const { ref, child } = current!;
    if (ref) setRef(null, ref);
    if (child) unmountRange(child, null);

    current = current!.next;
  } while (current !== end);
}

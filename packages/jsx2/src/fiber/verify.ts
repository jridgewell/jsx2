type Fiber = import('.').Fiber;

import { assert } from '../util/assert';

export function verify(fiber: Fiber): void {
  debug: {
    verifyRange(fiber, fiber.next, fiber.parent);
  }
}

function verifyRange(fiber: Fiber, end: null | Fiber, parent: null | Fiber): void {
  let current: null | Fiber = fiber;
  let i = 0;
  do {
    assert(current!.index === i, 'unexpected index');
    assert(current!.parent === parent, 'unexpected parent');

    const { child } = current!;
    if (child) verifyRange(child, null, current!);

    i++;
    current = current!.next;
  } while (current !== end);
}

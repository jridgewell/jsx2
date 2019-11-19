type Fiber = import('.').Fiber;

import { assert } from '../util/assert';

export function getPreviousFiber(fiber: Fiber, parent: Fiber): null | Fiber {
  debug: assert(fiber.parent === parent, 'fiber must be child of parent');

  let current = parent.child;
  if (current === fiber) return null;

  while (current !== null) {
    const { next } = current;
    if (next === fiber) return current;
    current = next;
  }
  debug: assert(false, 'could not find previous fiber');
}

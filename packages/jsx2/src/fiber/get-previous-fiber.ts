type Fiber = import('.').Fiber;

import { assert } from '../util/assert';

export function getPreviousFiber(fiber: Fiber, parent: Fiber): null | Fiber {
  debug: assert(fiber.parent === parent, 'fiber must be child of parent');

  let current = parent.child;
  if (current === fiber) return null;

  while (true) {
    debug: assert(current !== null, 'guaranteed to find fiber in children');
    const { next } = current;
    if (next === fiber) break;
    current = next;
  }
  return current;
}

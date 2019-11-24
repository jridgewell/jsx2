type Fiber = import('.').Fiber;

import { assert } from '../util/assert';
import { getPreviousFiber } from './get-previous-fiber';
import { increment } from './increment';
import { mark } from './mark';

export function reorderAfter(fiber: Fiber, parent: Fiber, previous: null | Fiber): boolean {
  debug: {
    assert(fiber.parent === parent, 'fiber must be child of parent');
    if (previous !== null) {
      assert(previous.parent === parent, 'previous fiber must be child of parent');
      assert(previous.index < fiber.index, 'previous fiber must be before fiber');
    }
  }

  if (previous === null) {
    if (parent.child === fiber) return false;
  } else if (previous.next === fiber) return false;

  const before = getPreviousFiber(fiber, parent);
  const { next } = fiber;

  if (before) before.next = next;
  const after = previous ? previous.next : parent.child;
  debug: assert(after !== null, 'previous must have a next node');
  increment(after, 1, next);
  fiber.next = after;

  mark(fiber, parent, previous);
  return true;
}

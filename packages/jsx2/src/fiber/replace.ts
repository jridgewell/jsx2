type Fiber = import('.').Fiber;

import { assert } from '../util/assert';
import { getNextSibling } from './get-next-sibling';
import { increment } from './increment';
import { insert } from './insert';
import { remove } from './remove';
import { unmount } from './unmount';

export function replace(old: Fiber, fiber: Fiber, parent: Fiber, container: Node): Fiber {
  debug: {
    assert(old.parent === parent, 'old must be child of parent');
    assert(fiber.parent === parent, 'fiber must be child of parent');
    assert(old.index === fiber.index, 'replacement fiber must have same index');
  }

  unmount(old);
  insert(fiber, container, getNextSibling(old, container));

  debug: {
    fiber.next = old;
    increment(old, 1);
  }

  remove(old, parent, fiber, container);
  return fiber;
}

import type { DiffableFiber, Fiber } from '.';

import { getNextSibling } from './get-next-sibling';
import { insert } from './insert';
import { remove } from './remove';
import { unmount } from './unmount';
import { assert } from '../util/assert';

export function replace(old: DiffableFiber, fiber: Fiber, parent: Fiber, container: Node): Fiber {
  debug: {
    assert(old.parent === parent, 'old must be child of parent');
    assert(fiber.parent === parent, 'fiber must be child of parent');
    assert(old.index === fiber.index, 'replacement fiber must have same index');
  }

  unmount(old);
  insert(fiber, container, getNextSibling(old, container));

  // Remove requires that the previous fiber point at the fiber being remvoed.
  fiber.next = old;

  remove(old, parent, fiber, container);
  return fiber;
}

import type { Fiber } from '.';

import { assert } from '../util/assert';
import { getNextSibling } from './get-next-sibling';
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

  // Remove requires that the previous fiber point at the fiber being remvoed.
  fiber.next = old;

  remove(old, parent, fiber, container);
  return fiber;
}

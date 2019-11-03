type Fiber = import('.').Fiber;

import { getNextSibling } from './get-next-sibling';
import { insert } from './insert';
import { remove } from './remove';
import { unmount } from './unmount';

export function replace(old: Fiber, fiber: Fiber, container: Node): Fiber {
  unmount(old);
  insert(fiber, container, getNextSibling(old, container));
  remove(old, fiber, container);
  return fiber;
}

type Fiber = import('.').Fiber;

import { getNextSibling } from './get-next-sibling';
import { mount } from './mount';
import { remove } from './remove';
import { unmount } from './unmount';

export function replace(old: Fiber, fiber: Fiber, container: Node): Fiber {
  unmount(old);
  mount(fiber, container, getNextSibling(old, container));
  remove(old, fiber, container);
  return fiber;
}

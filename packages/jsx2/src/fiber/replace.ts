import { getNextSibling } from './get-next-sibling';
import { mount } from './mount';
import { remove } from './remove';

type Fiber = import('.').Fiber;

export function replace(old: Fiber, fiber: Fiber, container: Node): Fiber {
  mount(fiber, container, getNextSibling(old, container));
  remove(old, fiber, container);
  return fiber;
}

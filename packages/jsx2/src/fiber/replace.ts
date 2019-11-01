import { getNextSibling } from './get-next-sibling';
import { mark } from './mark';
import { mount } from './mount';
import { remove } from './remove';

type Fiber = import('.').Fiber;

export function replace(
  old: Fiber,
  fiber: Fiber,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
): Fiber {
  mark(fiber, parentFiber, previousFiber);
  mount(fiber, container, getNextSibling(old, container));
  remove(old, fiber, container);
  return fiber;
}

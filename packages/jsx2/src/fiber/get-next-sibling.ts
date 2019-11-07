type Fiber = import('.').Fiber;

import { assert } from '../util/assert';

export function getNextSibling(fiber: Fiber, container: Node, skipSelf?: boolean): null | Node {
  let current = skipSelf ? nextFiber(fiber, container) : fiber;
  while (current !== null) {
    const { dom } = current;
    if (dom) {
      debug: assert(dom.parentNode === container, 'dom must be a child of the container');
      return dom;
    }

    current = current.child || nextFiber(current, container);
  }
  return null;
}

function nextFiber(fiber: Fiber, container: Node): null | Fiber {
  let current: null | Fiber = fiber;
  do {
    const { next } = current;
    if (next) return next;

    current = current.parent;
  } while (current !== null && current.dom !== container);
  return null;
}

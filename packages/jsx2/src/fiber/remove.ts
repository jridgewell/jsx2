import type { Fiber } from '.';

import { assert } from '../util/assert';

export function remove(
  fiber: Fiber,
  parent: Fiber,
  previous: null | Fiber,
  container: Node,
): null | Fiber {
  debug: {
    assert(fiber.parent === parent, 'fiber must be child of parent');
    if (previous === null) {
      assert(parent.child === fiber, 'parent must point to fiber');
    } else {
      assert(previous.next === fiber, 'previous fiber must point to the fiber we remove');
    }
  }

  const { next } = fiber;
  removeRange(fiber, next, container);

  if (previous) {
    previous.next = next;
  } else {
    parent.child = next;
  }

  return next;
}

function removeRange(fiber: Fiber, end: null | Fiber, container: Node): void {
  let current: null | Fiber = fiber;
  do {
    debug: assert(current !== null, 'end is guaranteed to prevent null loop');
    const { dom, child } = current;
    if (dom) {
      container.removeChild(dom);
    } else if (child) {
      removeRange(child, null, container);
    }

    current = current.next;
  } while (current !== end);
}

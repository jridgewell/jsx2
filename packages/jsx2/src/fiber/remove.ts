type Fiber = import('.').Fiber;

import { assert } from '../util/assert';
import { increment } from './increment';

const __DEBUG__ = process.env.NODE_ENV !== 'production';

export function remove(
  fiber: Fiber,
  parent: Fiber,
  previous: null | Fiber,
  container: Node,
): null | Fiber {
  // istanbul ignore next
  if (__DEBUG__) {
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

  if (__DEBUG__ && next) {
    increment(next, -1);
  }

  return next;
}

function removeRange(fiber: Fiber, end: null | Fiber, container: Node): void {
  let current: null | Fiber = fiber;
  do {
    const { dom, child } = current!;
    if (dom) {
      container.removeChild(dom);
    } else if (child) {
      removeRange(child, null, container);
    }

    current = current!.next;
  } while (current !== end);
}

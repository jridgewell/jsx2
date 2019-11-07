type Fiber = import('.').Fiber;

import { assert } from '../util/assert';

const __DEBUG__ = true;

export function insert(fiber: Fiber, container: Node, before: null | Node): void {
  // istanbul ignore next
  if (__DEBUG__) {
    assert(
      before === null || before.parentNode === container,
      'before node must be child of container',
    );
    assert(fiber.next === null, 'inserted fiber must not be part of an established tree');
  }
  insertRange(fiber, null, container, before);
}

function insertRange(fiber: Fiber, end: null | Fiber, container: Node, before: null | Node): void {
  let current: null | Fiber = fiber;
  do {
    const { dom, child } = current;
    if (dom) {
      // istanbul ignore next
      if (__DEBUG__) assert(dom.parentNode === null, 'fiber must not already be mounted');

      if (child) insertRange(child, null, dom, null);
      container.insertBefore(dom, before);
    } else if (child) {
      insertRange(child, null, container, before);
    }

    current = current.next;
  } while (current !== null);
}

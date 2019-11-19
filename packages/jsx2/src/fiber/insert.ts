type Fiber = import('.').Fiber;

import { assert } from '../util/assert';
import { getNextSibling } from './get-next-sibling';

export function insert(fiber: Fiber, container: Node, before: null | Node): void {
  debug: {
    assert(
      before === null || before.parentNode === container,
      'before node must be child of container',
    );
  }
  if (before !== null) {
    if (getNextSibling(fiber, container, true) === before) return;
  }
  insertRange(fiber, fiber.next, container, before);
}

function insertRange(fiber: Fiber, end: null | Fiber, container: Node, before: null | Node): void {
  let current: null | Fiber = fiber;
  do {
    const { dom, child } = current!;
    if (dom) {
      debug: assert(
        dom.parentNode === null || dom.parentNode === container,
        'fiber must not already be mounted, or be mounted as a direct child of container',
      );

      if (child) insertRange(child, null, dom, null);
      container.insertBefore(dom, before);
    } else if (child) {
      insertRange(child, null, container, before);
    }

    current = current!.next;
  } while (current !== end);
}

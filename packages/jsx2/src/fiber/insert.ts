import type { Fiber } from '.';

import { assert } from '../util/assert';

export function insert(fiber: Fiber, container: Node, before: null | Node): void {
  debug: {
    assert(
      before === null || before.parentNode === container,
      'before node must be child of container',
    );
    verifyFiberMountedInContianer(fiber, fiber.next, null);
  }
  insertRange(fiber, fiber.next, container, before, false);
}

export function reorder(fiber: Fiber, container: Node, before: null | Node): void {
  debug: {
    assert(
      before === null || before.parentNode === container,
      'before node must be child of container',
    );
    verifyFiberMountedInContianer(fiber, fiber.next, container);
  }
  insertRange(fiber, fiber.next, container, before, true);
}

function insertRange(
  fiber: Fiber,
  end: null | Fiber,
  container: Node,
  before: null | Node,
  reorder: boolean,
): void {
  let current: null | Fiber = fiber;
  do {
    const { dom, data, child } = current!;
    if (dom !== null && dom !== data) {
      if (!reorder && child) insertRange(child, null, dom, null, reorder);
      container.insertBefore(dom, before);
    } else if (child) {
      insertRange(child, null, container, before, reorder);
    }

    current = current!.next;
  } while (current !== end);
}

function verifyFiberMountedInContianer(fiber: Fiber, end: Fiber | null, container: Node | null) {
  let current: null | Fiber = fiber;
  do {
    assert(current !== null);
    const { data, dom, child } = current;
    if (dom && dom !== data) {
      assert(
        dom.parentNode === container,
        'fiber must be mounted inside container to be reordered',
      );
    }
    if (child) verifyFiberMountedInContianer(child, null, container && dom ? dom : null);
    current = current.next;
  } while (current !== end);
}

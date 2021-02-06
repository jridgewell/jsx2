import type { Fiber } from '.';

import { assert } from '../util/assert';

export function verify(fiber: Fiber): void {
  debug: verifyRange(fiber, fiber.next, fiber.parent, fiber.index, false);
}

function verifyRange(
  fiber: Fiber,
  end: null | Fiber,
  parent: null | Fiber,
  index = 0,
  checkSiblings = true,
): void {
  let current: null | Fiber = fiber;
  let i = index;
  do {
    assert(current !== null, 'end is guaranteed to prevent null loop');
    assert(current.index === i, 'unexpected index');
    assert(current.parent === parent, 'unexpected parent');

    const { child, dom, data } = current;
    if (dom !== null && dom !== data) {
      assert(dom.parentNode !== null, 'found unmounted node');
    }
    if (child) verifyRange(child, null, current);

    i++;
    current = current.next;
  } while (checkSiblings && current !== end);
}

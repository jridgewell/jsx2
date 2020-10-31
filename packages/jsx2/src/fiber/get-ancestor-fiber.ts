import type { Fiber } from './index';

import { assert } from '../util/assert';
import { getFromNode } from './node';

export function getAncestorFiber(fiber: Fiber): Fiber | null {
  debug: assert(fiber.dom === fiber.data, 'trying to get ancestor of non-root fiber');
  let current: null | Node = getParent(fiber.dom!);
  while (current !== null) {
    const fiber = getFromNode(current);
    if (fiber) return fiber;
    current = getParent(current);
  }
  return null;
}

function getParent(node: Node): null | Node {
  return (
    ((node as unknown) as Slottable).assignedSlot || (node as ShadowRoot).host || node.parentNode
  );
}

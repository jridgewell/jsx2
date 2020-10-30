import { Fiber } from './index';
import { Container } from '../render';

export function getAncestorFiber(fiber: Fiber): Fiber | null {
  let current: null | Node = getParent(fiber.dom!);
  while (current !== null) {
    const fiber = (current as Container)._fiber;
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

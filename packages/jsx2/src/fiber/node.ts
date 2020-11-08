import type { Fiber } from '.';

export type NodeWithFiber = Node & {
  _fiber?: Fiber;
};

export function getFromNode(node: Node): undefined | Fiber {
  return (node as NodeWithFiber)._fiber;
}

export function setOnNode(node: Node, fiber: Fiber): void {
  (node as NodeWithFiber)._fiber = fiber;
}

import { nextSibling } from './next-sibling';

export function remove<R>(node: ChildNode): null | ChildNode {
  const { parentNode } = node;
  // istanbul ignore next
  if (parentNode === null) throw new Error('detached child');

  const next = nextSibling(node);
  let current = node as null | ChildNode;
  do {
    const n = current!.nextSibling;
    parentNode.removeChild(current!);
    current = n;
  } while (current !== next);
  return next;
}

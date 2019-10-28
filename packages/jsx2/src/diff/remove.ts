type MarkedNode<R> = import('./mark').MarkedNode<R>;

export function removeRange<R>(node: ChildNode): null | ChildNode {
  const { parentNode } = node;
  if (parentNode === null) throw new Error('detached child');

  const end = (node as MarkedNode<R>)._range!;
  let next = node as null | ChildNode;
  let current;
  do {
    current = next;
    next = next!.nextSibling;
    parentNode.removeChild(current!);
  } while (current !== end);
  return next;
}

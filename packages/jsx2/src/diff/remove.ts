type MarkedNode<R> = import('./mark').MarkedNode<R>;

export function removeRange<R>(node: ChildNode): null | ChildNode {
  const { parentNode } = node;
  if (parentNode === null) throw new Error('detached child');

  const end = (node as MarkedNode<R>)._range!;
  if (node === end) {
    const n = node.nextSibling;
    parentNode.removeChild(node);
    return n;
  }

  let current = node as null | ChildNode;
  do {
    const n = current!.nextSibling;
    parentNode.removeChild(current!);
    current = n;
  } while (current !== end);
  return current;
}

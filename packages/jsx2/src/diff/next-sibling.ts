type MarkedNode<R> = import('./mark').MarkedNode<R>;

export function nextSibling<R>(node: ChildNode): null | ChildNode {
  const end = (node as MarkedNode<R>)._range!;
  return end.nextSibling;
}

type MarkedNode<R> = import('./mark').MarkedNode<R>;

export function nextSibling<R>(node: ChildNode & MarkedNode<R>): null | ChildNode {
  const end = node._range!;
  return end.nextSibling;
}

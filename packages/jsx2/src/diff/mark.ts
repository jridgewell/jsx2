type CoercedRenderable<R> = import('../coerce-renderable').CoercedRenderable<R>;
type RenderedChild = import('../render').RenderedChild;

export interface MarkedNode<R> {
  _range?: RenderedChild;
  _vnode?: Exclude<CoercedRenderable<R>, null>;
}

export function mark<R>(
  renderable: Exclude<CoercedRenderable<R>, null>,
  start: RenderedChild | Comment,
  end?: RenderedChild
): void {
  const rendered = start as MarkedNode<R>;
  rendered._vnode = renderable;
  if (end !== undefined) rendered._range = end;
}

export function alreadyMarked<R>(rendered: RenderedChild | Comment): boolean {
  return !!(rendered as MarkedNode<R>)._vnode;
}

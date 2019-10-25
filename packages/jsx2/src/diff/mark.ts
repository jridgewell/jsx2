type CoercedRenderable<R> = import('../coerce-renderable').CoercedRenderable<R>;
type RenderedChild = import('../render').RenderedChild;
type RenderedNodes = import('../render').RenderedNodes;

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

export function markFragment<R>(
  renderable: Exclude<CoercedRenderable<R>, null>,
  frag: DocumentFragment
): DocumentFragment {
  let firstChild = frag.firstChild as RenderedChild | Comment;

  if (alreadyMarked(firstChild)) {
    firstChild = frag.insertBefore(document.createComment(''), firstChild);
  }
  mark(renderable, firstChild, frag.lastChild as RenderedChild);
  return frag;
}

export function markComponent<R>(
  renderable: Exclude<CoercedRenderable<R>, null>,
  rendered: RenderedNodes
): RenderedNodes {
  if (rendered.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    return markFragment(renderable, rendered as DocumentFragment);
  }
  const renderedNotFrag = rendered as Exclude<typeof rendered, DocumentFragment>;

  if (!alreadyMarked(renderedNotFrag)) {
    mark(renderable, renderedNotFrag, renderedNotFrag);
    return renderedNotFrag;
  }

  const frag = document.createDocumentFragment();
  const comment = frag.appendChild(document.createComment(''));
  frag.appendChild(renderedNotFrag);
  mark(renderable, comment, renderedNotFrag);
  return frag;
}

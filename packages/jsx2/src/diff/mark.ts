type CoercedRenderable<R> = import('../util/coerce-renderable').CoercedRenderable<R>;
type Component<R> = import('../component').Component<R>;

export interface MarkedNode<R> {
  _component?: Component<R>;
  _range?: Node;
  _vnode?: Exclude<CoercedRenderable<R>, null>;
}

export function mark<R>(
  renderable: MarkedNode<R>['_vnode'],
  start: Node,
  end: MarkedNode<R>['_range'],
  component?: MarkedNode<R>['_component'],
): void {
  const rendered = start as MarkedNode<R>;
  rendered._component = component;
  rendered._range = end;
  rendered._vnode = renderable;
}

export function markFragment<R>(
  renderable: MarkedNode<R>['_vnode'],
  frag: DocumentFragment,
): DocumentFragment {
  const first = frag.insertBefore(document.createComment(''), null);
  mark(renderable, first, frag.lastChild!);
  return frag;
}

export function markComponent<R>(
  renderable: MarkedNode<R>['_vnode'],
  rendered: null | Node,
  component?: MarkedNode<R>['_component'],
): Comment | DocumentFragment {
  if (rendered === null) {
    const comment = document.createComment('');
    mark(renderable, comment, comment, component);
    return comment;
  }

  if (rendered.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    return markFragment(renderable, (rendered as unknown) as DocumentFragment);
  }

  const frag = document.createDocumentFragment();
  const comment = frag.appendChild(document.createComment(''));
  frag.appendChild(rendered);
  mark(renderable, comment, rendered, component);
  return frag;
}

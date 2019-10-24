type CoercedRenderable<R> = import('./coerce-renderable').CoercedRenderable<R>;
type VNode<R> = import('../create-element').VNode<R>;
type Ref<R> = import('../create-ref').Ref<R>;

import { isFunctionComponent } from '../component';
import { coerceRenderable } from './coerce-renderable';
import { isArray } from './is-array';
import { diffProp } from './prop';
import { setRef } from './set-ref';

type RenderedNodes = null | Element | Text | DocumentFragment;
type RenderedChild = Exclude<RenderedNodes, null | DocumentFragment>;

interface MarkedNode<R> {
  _range?: RenderedChild;
  _vnode?: Exclude<CoercedRenderable<R>, null>;
}

export function insertElement<R>(
  renderable: CoercedRenderable<R>,
  container: Node,
  before: null | Node
): void {
  const dom = renderableToNode(renderable);
  if (dom) container.insertBefore(dom, before);
}

function renderableToNode<R>(renderable: CoercedRenderable<R> | void): RenderedNodes {
  if (renderable == null) return null;
  if (typeof renderable === 'string') {
    const text = document.createTextNode(renderable);
    mark(renderable, text);
    return text;
  }

  if (isArray(renderable)) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < renderable.length; i++) {
      insertElement(coerceRenderable(renderable[i]), frag, null);
    }
    return markFragment(renderable, frag);
  }

  const { type, ref, props } = renderable;
  if (typeof type === 'string') {
    const el = document.createElement(type);
    addProps(el, props);
    insertElement(coerceRenderable(props.children), el, null);
    if (ref) setRef(ref as Ref<HTMLElement>, el);
    mark(renderable, el);
    return el;
  }

  // TODO: Attach vnode
  if (isFunctionComponent<R>(type)) {
    const rendered = renderableToNode(coerceRenderable(type(props)));
    return markComponent(renderable, rendered);
  }

  const component = new type(props);
  const rendered = renderableToNode(coerceRenderable(component.render(props)));
  return markComponent(renderable, rendered);
}

function addProps<R>(el: HTMLElement, props: VNode<R>['props']): void {
  for (const name in props) {
    diffProp(el, name, null, props[name]);
  }
}

function mark<R>(
  renderable: Exclude<CoercedRenderable<R>, null>,
  start: RenderedChild | Comment,
  end?: RenderedChild
): void {
  const rendered = start as MarkedNode<R>;
  rendered._vnode = renderable;
  if (end === undefined) {
    if (start.nodeType === Node.COMMENT_NODE) throw new Error('only comment passed to marker');
    rendered._range = start as Exclude<typeof start, Comment>;
  } else {
    rendered._range = end;
  }
}

function alreadyMarked<R>(rendered: RenderedChild): boolean {
  return !!(rendered as MarkedNode<R>)._vnode;
}

function markFragment<R>(
  renderable: Exclude<CoercedRenderable<R>, null>,
  frag: DocumentFragment
): null | DocumentFragment {
  let firstChild = frag.firstChild as null | RenderedChild;
  if (firstChild === null) return null;

  if (alreadyMarked(firstChild)) {
    const comment = frag.insertBefore(document.createComment(''), firstChild);
    mark(renderable, comment, frag.lastChild as RenderedChild);
  } else {
    mark(renderable, firstChild, frag.lastChild as RenderedChild);
  }
  return frag;
}

function markComponent<R>(
  renderable: Exclude<CoercedRenderable<R>, null>,
  rendered: RenderedNodes
): RenderedNodes {
  if (rendered === null) return null;

  if (rendered.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    return markFragment(renderable, rendered as DocumentFragment);
  }
  const renderedNotFrag = rendered as Exclude<typeof rendered, DocumentFragment>;

  if (!alreadyMarked(renderedNotFrag)) {
    mark(renderable, renderedNotFrag);
    return renderedNotFrag;
  }

  const frag = document.createDocumentFragment();
  const comment = frag.appendChild(document.createComment(''));
  frag.appendChild(renderedNotFrag);
  mark(renderable, comment, renderedNotFrag);
  return frag;
}

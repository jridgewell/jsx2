type CoercedRenderable<R> = import('../coerce-renderable').CoercedRenderable<R>;
type VNode<R> = import('../create-element').VNode<R>;
type Ref<R> = import('../create-ref').Ref<R>;
type RenderedChild = import('../render').RenderedChild;
type RenderedNodes = import('../render').RenderedNodes;

import { coerceRenderable } from '../coerce-renderable';
import { isFunctionComponent } from '../component';
import { isArray } from './is-array';
import { alreadyMarked, mark } from './mark';
import { diffProp } from './prop';
import { setRef } from './set-ref';

export function insertElement<R>(
  renderable: CoercedRenderable<R>,
  container: Node,
  before: null | Node
): void {
  const dom = renderableToNode(renderable);
  if (dom) container.insertBefore(dom, before);
}

function renderableToNode<R>(renderable: CoercedRenderable<R>): null | RenderedNodes {
  if (renderable === null) return null;

  if (typeof renderable === 'string') {
    const text = document.createTextNode(renderable);
    mark(renderable, text, text);
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
    mark(renderable, el, el);
    return el;
  }

  if (isFunctionComponent<R>(type)) {
    const rendered = renderableToNode(coerceRenderable(type(props)));
    if (rendered === null) return null;
    return markComponent(renderable, rendered);
  }

  const component = new type(props);
  const rendered = renderableToNode(coerceRenderable(component.render(props)));
  if (rendered === null) return null;
  return markComponent(renderable, rendered);
}

function addProps<R>(el: HTMLElement, props: VNode<R>['props']): void {
  for (const name in props) {
    diffProp(el, name, null, props[name]);
  }
}

function markFragment<R>(
  renderable: Exclude<CoercedRenderable<R>, null>,
  frag: DocumentFragment
): DocumentFragment {
  let firstChild = frag.firstChild as null | RenderedChild | Comment;
  if (firstChild === null) return frag;

  if (alreadyMarked(firstChild)) {
    firstChild = frag.insertBefore(document.createComment(''), firstChild);
  }
  mark(renderable, firstChild, frag.lastChild as RenderedChild);
  return frag;
}

function markComponent<R>(
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

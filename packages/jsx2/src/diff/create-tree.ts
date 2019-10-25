type CoercedRenderable<R> = import('../coerce-renderable').CoercedRenderable<R>;
type Ref<R> = import('../create-ref').Ref<R>;
type RenderedNodes = import('../render').RenderedNodes;

import { coerceRenderable } from '../coerce-renderable';
import { isFunctionComponent } from '../component';
import { isArray } from './is-array';
import { mark, markFragment, markComponent } from './mark';
import { addProps } from './prop';
import { setRef } from './set-ref';

export function createTree<R>(renderable: CoercedRenderable<R>, container: Node): void {
  container.textContent = '';
  insertElement(renderable, container, null);
}

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
    if (frag.firstChild === null) return null;
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

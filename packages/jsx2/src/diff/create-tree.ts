type CoercedRenderable<R> = import('../coerce-renderable').CoercedRenderable<R>;

import { coerceRenderable } from '../coerce-renderable';
import { isFunctionComponent } from '../component';
import { diffRef } from './diff-ref';
import { isArray } from './is-array';
import { mark, markComponent, markFragment } from './mark';
import { addProps } from './prop';

export function createTree<R>(renderable: CoercedRenderable<R>, container: Node): void {
  container.textContent = '';
  insertElement(renderable, container, null);
}

export function insertElement<R>(
  renderable: CoercedRenderable<R>,
  container: Node,
  before: null | ChildNode
): void {
  const dom = renderableToNode(renderable);
  if (dom) container.insertBefore(dom, before);
}

function renderableToNode<R>(
  renderable: CoercedRenderable<R>
): null | Comment | DocumentFragment | Element | Text {
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

  const { type, props } = renderable;
  if (typeof type === 'string') {
    const el = document.createElement(type);
    addProps(el, props);
    insertElement(coerceRenderable(props.children), el, null);
    diffRef((el as unknown) as R, null, renderable.ref);
    mark(renderable, el, el);
    return el;
  }

  if (isFunctionComponent<R>(type)) {
    const rendered = renderableToNode(coerceRenderable(type(props)));
    return markComponent(renderable, rendered);
  }

  const component = new type(props);
  const rendered = renderableToNode(coerceRenderable(component.render(props)));
  return markComponent(renderable, rendered, component);
}

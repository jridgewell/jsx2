type Node<R> = import('./create-element').Node<R>;

import { isFunctionComponent } from './component';
import { createElement, isValidElement } from './create-element';
import { Fragment } from './fragment';

export type Container = (Element | Document | ShadowRoot | DocumentFragment) & { _vnode?: unknown };

export type Renderable<R> =
  | string
  | number
  | boolean
  | null
  | undefined
  | Node<R> /* | TemplateResult*/
  | RenderableArray<R>;
interface RenderableArray<R> extends Array<Renderable<R>> {}

export function render<R>(element: Renderable<R>, container: Container): void {
  element = createElement<R>(Fragment, null, element);
  if (container._vnode) {
    // patchElement(element, container)
  } else {
    mountElement(element, container);
  }
}

function mountElement<R>(element: Renderable<R>, container: Container): void {
  let lastChild;
  while ((lastChild = container.lastChild)) {
    container.removeChild(lastChild);
  }
  appendElement(element, container);
}

function appendElement<R>(element: Renderable<R>, container: Container): void {
  const dom = renderableToNode(element);
  if (dom) container.appendChild(dom);
}

function renderableToNode<R>(
  element: Renderable<R> | void
): null | Element | Text | DocumentFragment {
  const renderable = coerceRenderale(element);
  if (renderable === null) return null;
  if (typeof renderable === 'string') {
    return document.createTextNode(renderable);
  }

  if (Array.isArray(renderable)) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < renderable.length; i++) {
      appendElement(renderable[i], frag);
    }
    return frag;
  }

  const { type, props } = renderable;
  if (typeof type === 'string') {
    return document.createElement(type);
  }

  if (isFunctionComponent<R>(type)) {
    return renderableToNode(type(props));
  }
  const component = new type(props);
  return renderableToNode(component.render(props));
}

function coerceRenderale<R>(
  element: Renderable<R> | void
): Exclude<Renderable<R>, boolean | number | undefined> {
  if (element == null) return null;
  if (typeof element === 'boolean') return null;
  if (typeof element === 'number') return String(element);
  if (typeof element === 'string') return element;
  if (isValidElement<R>(element)) return element;
  return null;
}

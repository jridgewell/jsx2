type VNode<R> = import('./create-element').VNode<R>;

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
  | VNode<R> /* | TemplateResult*/
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
  insertElement(element, container, null);
}

function insertElement<R>(element: Renderable<R>, container: Container, before: Node | null): void {
  const dom = renderableToNode(element);
  if (dom) container.insertBefore(dom, before);
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
      insertElement(renderable[i], frag, null);
    }
    return frag;
  }

  const { type, props } = renderable;
  if (typeof type === 'string') {
    // TODO: props
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

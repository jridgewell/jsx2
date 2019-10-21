type Container = import('../render').Container;
type Renderable<R> = import('../render').Renderable<R>;
type VNode<R> = import('../create-element').VNode<R>;
type Ref<R> = import('../create-ref').Ref<R>;

import { isFunctionComponent } from '../component';
import { isValidElement } from '../create-element';
import { diffProp } from './prop';
import { setRef } from './set-ref';

export function createTree<R>(element: Renderable<R>, container: Container): void {
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

  const { type, ref, props } = renderable;
  if (typeof type === 'string') {
    const el = document.createElement(type);
    addProps(el, props);
    insertElement(props.children, el, null);
    if (ref) setRef(ref as Ref<HTMLElement>, el);
    ((el as unknown) as { _vnode: unknown })._vnode = renderable;
    return el;
  }

  if (isFunctionComponent<R>(type)) {
    return renderableToNode(type(props));
  }
  const component = new type(props);
  return renderableToNode(component.render(props));
}

function addProps<R>(el: HTMLElement, props: VNode<R>['props']): void {
  for (const name in props) {
    diffProp(el, name, null, props[name]);
  }
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

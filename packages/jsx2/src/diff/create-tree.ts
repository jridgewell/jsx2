type Container<R> = import('../render').Container<R>;
type Renderable<R> = import('../render').Renderable<R>;
type VNode<R> = import('../create-element').VNode<R>;
type Ref<R> = import('../create-ref').Ref<R>;

import { isFunctionComponent } from '../component';
import { diffProp } from './prop';
import { setRef } from './set-ref';
import { coerceRenderable } from './coerce-renderable';

export function createTree<R>(renderable: Renderable<R>, container: Container<R>): void {
  let lastChild;
  while ((lastChild = container.lastChild)) {
    container.removeChild(lastChild);
  }
  insertElement(renderable, container, null);
}

function insertElement<R>(
  renderable: Renderable<R>,
  container: Container<R>,
  before: null | Node
): void {
  const dom = renderableToNode(renderable);
  if (dom) container.insertBefore(dom, before);
}

function renderableToNode<R>(
  _renderable: Renderable<R> | void
): null | Element | Text | DocumentFragment {
  const renderable = coerceRenderable(_renderable);
  if (renderable === null) return null;
  if (typeof renderable === 'string') {
    return document.createTextNode(renderable);
  }

  if (Array.isArray(renderable)) {
    // TODO: Attach vnode
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

  // TODO: Attach vnode
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

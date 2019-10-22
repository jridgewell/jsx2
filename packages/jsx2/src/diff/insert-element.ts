type CoercedRenderable<R> = import('./coerce-renderable').CoercedRenderable<R>;
type VNode<R> = import('../create-element').VNode<R>;
type Ref<R> = import('../create-ref').Ref<R>;

import { isFunctionComponent } from '../component';
import { coerceRenderable } from './coerce-renderable';
import { isArray } from './is-array';
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

type RenderableNodes = null | Element | Text | DocumentFragment;

function renderableToNode<R>(renderable: CoercedRenderable<R> | void): RenderableNodes {
  if (renderable == null) return null;
  if (typeof renderable === 'string') {
    return document.createTextNode(renderable);
  }

  if (isArray(renderable)) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < renderable.length; i++) {
      insertElement(coerceRenderable(renderable[i]), frag, null);
    }
    return frag;
  }

  const { type, ref, props } = renderable;
  if (typeof type === 'string') {
    const el = document.createElement(type);
    addProps(el, props);
    insertElement(coerceRenderable(props.children), el, null);
    if (ref) setRef(ref as Ref<HTMLElement>, el);
    ((el as unknown) as { _vnode: unknown })._vnode = renderable;
    return el;
  }

  // TODO: Attach vnode
  if (isFunctionComponent<R>(type)) {
    return renderableToNode(coerceRenderable(type(props)));
  }
  const component = new type(props);
  return renderableToNode(coerceRenderable(component.render(props)));
}

function addProps<R>(el: HTMLElement, props: VNode<R>['props']): void {
  for (const name in props) {
    diffProp(el, name, null, props[name]);
  }
}

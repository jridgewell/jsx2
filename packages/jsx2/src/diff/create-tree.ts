type CoercedRenderable = import('../util/coerce-renderable').CoercedRenderable;
type Fiber = import('../fiber').Fiber;
type RefWork = import('./ref').RefWork;

import { isFunctionComponent } from '../component';
import { fiber } from '../fiber';
import { mark } from '../fiber/mark';
import { mount } from '../fiber/mount';
import { coerceRenderable } from '../util/coerce-renderable';
import { isArray } from '../util/is-array';
import { addProps } from './prop';
import { deferRef } from './ref';

export function createTree(renderable: CoercedRenderable, container: Node, refs: RefWork[]): Fiber {
  const root = fiber(null);
  createChild(renderable, root, null, refs);
  mount(root, container, null);
  return root;
}

export function createChild(
  renderable: CoercedRenderable,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  refs: RefWork[],
): Fiber {
  const f = fiber(renderable);
  mark(f, parentFiber, previousFiber);

  if (renderable === null) return f;

  if (typeof renderable === 'string') {
    f.dom = document.createTextNode(renderable);
    return f;
  }

  if (isArray(renderable)) {
    let last: null | Fiber = null;
    for (let i = 0; i < renderable.length; i++) {
      const child = createChild(coerceRenderable(renderable[i]), f, last, refs);
      mark(child, f, last);
      last = child;
    }
    return f;
  }

  f.key = renderable.key;
  const { type, props, ref } = renderable;
  if (typeof type === 'string') {
    const el = document.createElement(type);
    f.dom = el;
    f.ref = ref;
    addProps(el, props);
    createChild(coerceRenderable(props.children), f, null, refs);
    deferRef(refs, el, null, ref);
    return f;
  }

  if (isFunctionComponent(type)) {
    createChild(coerceRenderable(type(props)), f, null, refs);
    return f;
  }

  const component = (f.component = new type(props));
  f.ref = ref;
  createChild(coerceRenderable(component.render(props)), f, null, refs);
  deferRef(refs, component, null, renderable.ref);
  return f;
}

type CoercedRenderable = import('../util/coerce-renderable').CoercedRenderable;
type Fiber = import('../util/fiber').Fiber;

import { isFunctionComponent } from '../component';
import { coerceRenderable } from '../util/coerce-renderable';
import { isArray } from '../util/is-array';
import { addProps } from './prop';
import { diffRef } from './ref';
import { fiber } from '../util/fiber';

export function createTree(renderable: CoercedRenderable, container: Node): void {
  const root = fiber(null, null);
  createChild(renderable, root, null);
  mount(container, root);
  (container as {_fiber?: Fiber})._fiber = root.child!;
}

export function createChild(
  renderable: CoercedRenderable,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
): null | Fiber {
  if (renderable === null) return null;

  if (typeof renderable === 'string') {
    const f = fiber(null, renderable);
    f.dom = document.createTextNode(renderable);
    return mark(parentFiber, f, previousFiber);
  }

  if (isArray(renderable)) {
    let f: null | Fiber = null;
    for (let i = 0; i < renderable.length; i++) {
      const child = createChild(coerceRenderable(renderable[i]), parentFiber, previousFiber);
      if (child === null) continue;
      f = child;
      previousFiber = mark(parentFiber, child, previousFiber);
    }
    return f;
  }

  const f = fiber(renderable.key, renderable);
  f.data = renderable;
  mark(parentFiber, f, previousFiber);

  const { type, props } = renderable;
  if (typeof type === 'string') {
    const el = document.createElement(type);
    f.dom = el;
    addProps(el, props);
    createChild(coerceRenderable(props.children), f, null);
    diffRef(el, null, renderable.ref);
    return f;
  }

  if (isFunctionComponent(type)) {
    createChild(coerceRenderable(type(props)), f, null);
    return f;
  }

  f.component = new type(props);
  createChild(coerceRenderable(f.component.render(props)), f, null);
  return f;
}

function mark(parent: Fiber, current: null | Fiber, previous: null | Fiber): null | Fiber {
  if (current === null) return previous;
  if (previous) {
    current.index = previous.index + 1;
    previous.next = current;
  } else {
    parent.child = current;
  }
  return current;
}

export function mount(container: Node, fiber: null | Fiber): void {
  while (fiber !== null) {
    const { dom, child } = fiber;
    if (dom) {
      if (child) mount(dom, child);
      container.appendChild(dom);
    } else if (child) {
      mount(container, child);
    }
    fiber = fiber.next;
  }
}

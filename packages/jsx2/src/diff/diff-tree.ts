type Fiber = import('../util/fiber').Fiber;
type CoercedRenderable = import('../util/coerce-renderable').CoercedRenderable;
type RenderableArray = import('../render').RenderableArray;
type VNode = import('../create-element').VNode;

import { isFunctionComponent } from '../component';
import { coerceRenderable } from '../util/coerce-renderable';
import { isArray } from '../util/is-array';
import { createChild, mount } from './create-tree';
import { diffProps } from './prop';
import { diffRef } from './ref';
import { remove } from './remove';

export function diffTree(old: Fiber, renderable: CoercedRenderable, container: Node): void {
  diffChild(old.child, renderable, old, null, container);
}

function diffChild(
  old: null | Fiber,
  renderable: CoercedRenderable,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
): Fiber {
  if (old === null) {
    const f = createChild(renderable, parentFiber, previousFiber);
    mount(container, f, null);
    return f;
  }

  const { data } = old;
  if (data === renderable) return old;

  if (renderable === null) {
    return renderNull(old, renderable, parentFiber, previousFiber, container);
  }

  if (typeof renderable === 'string') {
    return renderText(old, renderable, parentFiber, previousFiber, container);
  }

  if (isArray(renderable)) {
    return renderArray(old, renderable, parentFiber, previousFiber, container);
  }

  const { type } = renderable;
  if (typeof type === 'string') {
    return renderElement(old, renderable, parentFiber, previousFiber, container);
  }

  return renderComponent(old, renderable, parentFiber, previousFiber, container);
}

function renderNull(
  old: Fiber,
  renderable: null,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
): Fiber {
  return replaceFiber(old, renderable, parentFiber, previousFiber, container);
}

function renderText(
  old: Fiber,
  renderable: string,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
): Fiber {
  const { data } = old;
  if (typeof data !== 'string') {
    return replaceFiber(old, renderable, parentFiber, previousFiber, container);
  }
  old.data = renderable;

  (old.dom as Text).data = renderable;
  return old;
}

function renderArray(
  old: Fiber,
  renderable: RenderableArray,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
): Fiber {
  const { data } = old;
  if (!isArray(data)) {
    return replaceFiber(old, renderable, parentFiber, previousFiber, container);
  }
  old.data = renderable;

  // TODO: Figure out key.
  let i = 0;
  let current: null | Fiber = old.child;
  let last: null | Fiber = null;
  for (; i < renderable.length && current !== null; i++) {
    const f = diffChild(current, coerceRenderable(renderable[i]), old, last, container);
    last = f;
    current = f.next;
  }
  while (current !== null) {
    current = remove(current, last, container);
  }

  const before = getNextSibling(last ? last.next : old.child);
  for (; i < renderable.length; i++) {
    const f = createChild(coerceRenderable(renderable[i]), old, last);
    last = f;
    mount(container, f, before);
  }
  return old;
}

function renderElement(
  old: Fiber,
  renderable: VNode,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
): Fiber {
  const { data } = old;
  if (data === null || typeof data === 'string' || isArray(data)) {
    return replaceFiber(old, renderable, parentFiber, previousFiber, container);
  }

  const { type } = renderable;
  if (type !== data.type) {
    return replaceFiber(old, renderable, parentFiber, previousFiber, container);
  }
  old.data = renderable;

  const oldProps = data.props;
  const { props } = renderable;
  const dom = old.dom!;
  diffProps(dom as HTMLElement, oldProps, props);
  diffChild(old.child, coerceRenderable(props.children), old, null, dom);
  diffRef(dom, data.ref, renderable.ref);
  return old;
}

function renderComponent(
  old: Fiber,
  renderable: VNode,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
): Fiber {
  const { data } = old;
  if (data === null || typeof data === 'string' || isArray(data)) {
    return replaceFiber(old, renderable, parentFiber, previousFiber, container);
  }
  old.data = renderable;

  const { type } = renderable;
  if (typeof data.type === 'string' || type !== data.type) {
    return replaceFiber(old, renderable, parentFiber, previousFiber, container);
  }

  const { props } = renderable;
  const rendered = coerceRenderable(
    isFunctionComponent(type) ? type(props) : old.component!.render(props),
  );

  diffChild(old.child, rendered, old, null, container);
  return old;
}

function replaceFiber(
  old: Fiber,
  renderable: CoercedRenderable,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
): Fiber {
  const next = remove(old, previousFiber, container);
  const f = createChild(renderable, parentFiber, previousFiber);
  f.next = next;
  mount(container, f, getNextSibling(next));
  return f;
}

function getNextSibling(fiber: null | Fiber): null | Node {
  while (fiber !== null) {
    const { dom, child } = fiber;
    if (dom) {
      return dom;
    } else if (child) {
      const next = getNextSibling(child);
      if (next) return next;
    }
    fiber = fiber.next;
  }
  return null;
}

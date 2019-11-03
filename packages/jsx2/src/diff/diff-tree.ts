type Fiber = import('../fiber').Fiber;
type CoercedRenderable = import('../util/coerce-renderable').CoercedRenderable;
type RenderableArray = import('../render').RenderableArray;
type ElementVNode = import('../create-element').ElementVNode;
type FunctionComponentVNode = import('../create-element').FunctionComponentVNode;
type ClassComponentVNode = import('../create-element').ClassComponentVNode;
type RefWork = import('./ref').RefWork;

import { isFunctionComponent } from '../component';
import { getNextSibling } from '../fiber/get-next-sibling';
import { mount } from '../fiber/mount';
import { remove } from '../fiber/remove';
import { replace } from '../fiber/replace';
import { unmount } from '../fiber/unmount';
import { coerceRenderable } from '../util/coerce-renderable';
import { isArray } from '../util/is-array';
import { createChild } from './create-tree';
import { diffProps } from './prop';
import { deferRef } from './ref';

export function diffTree(
  old: Fiber,
  renderable: CoercedRenderable,
  container: Node,
  refs: RefWork[],
): void {
  diffChild(old.child, renderable, old, null, container, refs);
}

function diffChild(
  old: null | Fiber,
  renderable: CoercedRenderable,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
  refs: RefWork[],
): Fiber {
  if (old === null) {
    const f = createChild(renderable, parentFiber, previousFiber, refs);
    mount(f, container, null);
    return f;
  }

  const { data } = old;
  if (data === renderable) return old;

  if (renderable === null) {
    return renderNull(old, renderable, parentFiber, previousFiber, container, refs);
  }

  if (typeof renderable === 'string') {
    return renderText(old, renderable, parentFiber, previousFiber, container, refs);
  }

  if (isArray(renderable)) {
    return renderArray(old, renderable, parentFiber, previousFiber, container, refs);
  }

  const { type } = renderable;
  if (typeof type === 'string') {
    return renderElement(
      old,
      renderable as ElementVNode,
      parentFiber,
      previousFiber,
      container,
      refs,
    );
  }

  return renderComponent(
    old,
    renderable as FunctionComponentVNode | ClassComponentVNode,
    parentFiber,
    previousFiber,
    container,
    refs,
  );
}

function renderNull(
  old: Fiber,
  renderable: null,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
  refs: RefWork[],
): Fiber {
  return replaceFiber(old, renderable, parentFiber, previousFiber, container, refs);
}

function renderText(
  old: Fiber,
  renderable: string,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
  refs: RefWork[],
): Fiber {
  const { data } = old;
  if (typeof data !== 'string') {
    return replaceFiber(old, renderable, parentFiber, previousFiber, container, refs);
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
  refs: RefWork[],
): Fiber {
  const { data } = old;
  if (!isArray(data)) {
    return replaceFiber(old, renderable, parentFiber, previousFiber, container, refs);
  }
  old.data = renderable;

  // TODO: Figure out key.
  let i = 0;
  let current: null | Fiber = old.child;
  let last: null | Fiber = null;
  for (; i < renderable.length && current !== null; i++) {
    const f = diffChild(current, coerceRenderable(renderable[i]), old, last, container, refs);
    last = f;
    current = f.next;
  }

  const before = getNextSibling(last || old, container, true);
  for (; i < renderable.length; i++) {
    current = createChild(coerceRenderable(renderable[i]), old, last, refs);
    last = current;
    mount(current, container, before);
  }

  current = last ? last.next : old.child;
  while (current !== null) {
    unmount(current);
    current = remove(current, last, container);
  }
  return old;
}

function renderElement(
  old: Fiber,
  renderable: ElementVNode,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
  refs: RefWork[],
): Fiber {
  const { data } = old;
  if (data === null || typeof data === 'string' || isArray(data)) {
    return replaceFiber(old, renderable, parentFiber, previousFiber, container, refs);
  }

  const { type } = renderable;
  if (type !== data.type) {
    return replaceFiber(old, renderable, parentFiber, previousFiber, container, refs);
  }
  old.data = renderable;

  const oldProps = data.props;
  const { props } = renderable;
  const dom = old.dom!;
  diffProps(dom as HTMLElement, oldProps, props);
  diffChild(old.child, coerceRenderable(props.children), old, null, dom, refs);
  deferRef(refs, dom, data.ref, renderable.ref);
  return old;
}

function renderComponent(
  old: Fiber,
  renderable: FunctionComponentVNode | ClassComponentVNode,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
  refs: RefWork[],
): Fiber {
  const { data } = old;
  if (data === null || typeof data === 'string' || isArray(data)) {
    return replaceFiber(old, renderable, parentFiber, previousFiber, container, refs);
  }
  old.data = renderable;

  const { type } = renderable;
  if (typeof data.type === 'string' || type !== data.type) {
    return replaceFiber(old, renderable, parentFiber, previousFiber, container, refs);
  }

  const { props } = renderable;
  const rendered = coerceRenderable(
    isFunctionComponent(type) ? type(props) : old.component!.render(props),
  );

  diffChild(old.child, rendered, old, null, container, refs);
  return old;
}

function replaceFiber(
  old: Fiber,
  renderable: CoercedRenderable,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
  refs: RefWork[],
): Fiber {
  const f = createChild(renderable, parentFiber, previousFiber, refs);
  return replace(old, f, container);
}

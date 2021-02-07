import type { RefWork } from './ref';
import type { ClassComponentVNode, ElementVNode, FunctionComponentVNode } from '../create-element';
import type { DiffableFiber, Fiber, FunctionComponentFiber } from '../fiber';
import type { EffectState } from '../hooks';
import type { RenderableArray } from '../render';
import type { CoercedRenderable } from '../util/coerce-renderable';

import { createTree } from './create-tree';
import { applyEffects } from './effects';
import { diffProps } from './prop';
import { applyRefs, deferRef } from './ref';
import { renderComponentWithHooks } from './render-component-with-hooks';
import { isFunctionComponent } from '../component';
import { isValidElement } from '../create-element';
import { clone } from '../fiber/clone';
import { getContainer } from '../fiber/get-container';
import { getNextSibling } from '../fiber/get-next-sibling';
import { insert, reorder } from '../fiber/insert';
import { mark } from '../fiber/mark';
import { remove } from '../fiber/remove';
import { replace } from '../fiber/replace';
import { unmount } from '../fiber/unmount';
import { verify } from '../fiber/verify';
import { coerceRenderable } from '../util/coerce-renderable';
import { isArray } from '../util/is-array';
import { equals } from '../util/nullish-equals';

export function diffTree(
  old: Fiber,
  renderable: CoercedRenderable,
  container: Node,
  layoutEffects: EffectState[] = [],
): void {
  const refs: RefWork[] = [];
  diffChild(old.child!, renderable, old, null, container, refs, layoutEffects);
  verify(old);
  applyRefs(refs);
  applyEffects(layoutEffects);
}

export function rediffComponent(fiber: FunctionComponentFiber): void {
  const { type, props, ref } = fiber.data;
  const layoutEffects: EffectState[] = [];
  const rendered = coerceRenderable(
    renderComponentWithHooks(type, props, ref, fiber, layoutEffects),
  );
  diffTree(fiber, rendered, getContainer(fiber.parent!)!, layoutEffects);
}

function diffChild(
  old: DiffableFiber,
  renderable: CoercedRenderable,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
  refs: RefWork[],
  layoutEffects: EffectState[],
): Fiber {
  const { data } = old;
  if (data === renderable) return old;

  if (renderable === null) {
    return renderNull(old, renderable, parentFiber, previousFiber, container, refs, layoutEffects);
  }

  if (typeof renderable === 'string') {
    return renderText(old, renderable, parentFiber, previousFiber, container, refs, layoutEffects);
  }

  if (isArray(renderable)) {
    return renderArray(old, renderable, parentFiber, previousFiber, container, refs, layoutEffects);
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
      layoutEffects,
    );
  }

  return renderComponent(
    old,
    renderable as FunctionComponentVNode<any> | ClassComponentVNode<any>,
    parentFiber,
    previousFiber,
    container,
    refs,
    layoutEffects,
  );
}

function renderNull(
  old: DiffableFiber,
  renderable: null,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
  refs: RefWork[],
  layoutEffects: EffectState[],
): Fiber {
  return replaceFiber(old, renderable, parentFiber, previousFiber, container, refs, layoutEffects);
}

function renderText(
  old: DiffableFiber,
  renderable: string,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
  refs: RefWork[],
  layoutEffects: EffectState[],
): Fiber {
  const { data } = old;
  if (typeof data !== 'string') {
    return replaceFiber(
      old,
      renderable,
      parentFiber,
      previousFiber,
      container,
      refs,
      layoutEffects,
    );
  }
  old.data = renderable;

  (old.dom as Text).data = renderable;
  return old;
}

function renderArray(
  old: DiffableFiber,
  renderable: RenderableArray,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
  refs: RefWork[],
  layoutEffects: EffectState[],
): Fiber {
  const { data } = old;
  if (!isArray(data)) {
    return replaceFiber(
      old,
      renderable,
      parentFiber,
      previousFiber,
      container,
      refs,
      layoutEffects,
    );
  }
  old.data = renderable;

  let i = 0;
  let current: null | Fiber = old.child;
  let last: null | Fiber = null;
  for (; i < renderable.length && current !== null; i++) {
    const r = coerceRenderable(renderable[i]);
    if (isValidElement(r) && !equals(current.key, r.key)) break;
    const f = diffChild(current, r, old, last, container, refs, layoutEffects);
    last = f;
    current = f.next;
  }

  const keyed = Object.create(null) as Record<string, undefined | DiffableFiber>;
  for (let c = current; c !== null; c = c.next) {
    const { key } = c;
    keyed[key === null ? c.index : key] = c;
  }

  // If we have a last node, we want to get its next's DOM. If not, we want to
  // descend into the old fiber to find the next DOM.
  const before = getNextSibling(last || old, container, !!last);
  for (; i < renderable.length; i++) {
    const r = coerceRenderable(renderable[i]);

    if (isValidElement(r)) {
      const key = r.key === null ? i : r.key;
      const already = keyed[key];

      if (already) {
        const cloned = clone(already);
        mark(cloned, old, last);

        if (current === already) {
          current = current.next;
        } else {
          reorder(cloned, container, before);
        }

        const f = diffChild(cloned, r, old, last, container, refs, layoutEffects);
        last = f;
        f.next = null;
        continue;
      }
    }

    const f = createTree(r, old, last, old.namespace, refs, layoutEffects);
    insert(f, container, before);
    last = f;
  }

  if (last) last.next = current;
  while (current !== null) {
    unmount(current);
    current = remove(current, old, last, container);
  }
  return old;
}

function renderElement(
  old: DiffableFiber,
  renderable: ElementVNode,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
  refs: RefWork[],
  layoutEffects: EffectState[],
): Fiber {
  const { data } = old;
  if (data === null || typeof data === 'string' || isArray(data)) {
    return replaceFiber(
      old,
      renderable,
      parentFiber,
      previousFiber,
      container,
      refs,
      layoutEffects,
    );
  }

  const { type } = renderable;
  if (type !== data.type) {
    return replaceFiber(
      old,
      renderable,
      parentFiber,
      previousFiber,
      container,
      refs,
      layoutEffects,
    );
  }
  old.data = renderable;

  const oldProps = data.props;
  const { props } = renderable;
  const dom = old.dom!;
  diffProps(dom as HTMLElement, oldProps, props);
  diffChild(old.child!, coerceRenderable(props.children), old, null, dom, refs, layoutEffects);
  deferRef(refs, dom, data.ref, renderable.ref);
  return old;
}

function renderComponent(
  old: DiffableFiber,
  renderable: FunctionComponentVNode<any> | ClassComponentVNode<any>,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
  refs: RefWork[],
  layoutEffects: EffectState[],
): Fiber {
  const { data } = old;
  if (data === null || typeof data === 'string' || isArray(data)) {
    return replaceFiber(
      old,
      renderable,
      parentFiber,
      previousFiber,
      container,
      refs,
      layoutEffects,
    );
  }
  old.data = renderable;

  const { type } = renderable;
  if (type !== data.type) {
    return replaceFiber(
      old,
      renderable,
      parentFiber,
      previousFiber,
      container,
      refs,
      layoutEffects,
    );
  }

  const { props, ref } = renderable;
  const rendered = coerceRenderable(
    isFunctionComponent(type)
      ? renderComponentWithHooks(type, props, ref, old as FunctionComponentFiber, layoutEffects)
      : old.component!.render(props),
  );

  diffChild(old.child!, rendered, old, null, container, refs, layoutEffects);
  return old;
}

function replaceFiber(
  old: DiffableFiber,
  renderable: CoercedRenderable,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  container: Node,
  refs: RefWork[],
  layoutEffects: EffectState[],
): Fiber {
  const f = createTree(renderable, parentFiber, previousFiber, old.namespace, refs, layoutEffects);
  return replace(old, f, parentFiber, container);
}

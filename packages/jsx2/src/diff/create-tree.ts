import type { RefWork } from './ref';
import type { DiffableFiber, Fiber, FunctionComponentFiber, RootFiber } from '../fiber';
import type { EffectState } from '../hooks';
import type { CoercedRenderable } from '../util/coerce-renderable';
import type { NS } from '../util/namespace';

import { applyEffects } from './effects';
import { addListeners, addProps } from './prop';
import { applyRefs, deferRef } from './ref';
import { renderComponentWithHooks } from './render-component-with-hooks';
import { isFunctionComponent } from '../component';
import { fiber } from '../fiber';
import { insert } from '../fiber/insert';
import { mark } from '../fiber/mark';
import { setOnNode } from '../fiber/node';
import { verify } from '../fiber/verify';
import { assert, assertType } from '../util/assert';
import { coerceRenderable } from '../util/coerce-renderable';
import { isArray } from '../util/is-array';
import { NS_SVG, childSpace, nsFromNode, nsToNode } from '../util/namespace';

export const CREATION = 0;
export const HYDRATION = 1;
type CreateMode = typeof HYDRATION | typeof CREATION;

let hydrateWalker: null | HydrateWalker = null;
class HydrateWalker {
  declare parent: Node;
  declare current: null | Node;
  constructor(parent: Node) {
    this.parent = parent;
    this.current = parent.firstChild;
  }

  firstChild() {
    const { current } = this;
    debug: assert(current !== null);
    this.parent = current;
    this.current = current.firstChild;
  }

  nextSibling() {
    debug: assert(this.current !== null);
    this.current = this.current.nextSibling;
  }

  parentNext() {
    this.removeRemaining();
    const { parent } = this;
    debug: assert(parent.parentNode !== null);
    this.current = parent.nextSibling;
    this.parent = parent.parentNode;
  }

  insert(fiber: Fiber) {
    const { current, parent } = this;
    insert(fiber, parent, current);
  }

  removeRemaining() {
    const { parent } = this;
    for (let { current } = this; current !== null; ) {
      const next = current.nextSibling;
      parent.removeChild(current);
      current = next;
    }
  }
}

export function hydrateTree(renderable: CoercedRenderable, container: Node): RootFiber {
  const oldWalker = hydrateWalker;
  try {
    hydrateWalker = new HydrateWalker(container);
    const f = createTree(renderable, container);
    hydrateWalker.removeRemaining();
    return f;
  } finally {
    hydrateWalker = oldWalker;
  }
}

export function createTree(renderable: CoercedRenderable, container: Node): RootFiber {
  const root = fiber(container);
  const namespace = nsFromNode(container);
  root.dom = container;
  root.namespace = namespace;
  const refs: RefWork[] = [];
  const layoutEffects: EffectState[] = [];
  createChild(
    renderable,
    root,
    null,
    namespace,
    hydrateWalker ? HYDRATION : CREATION,
    refs,
    layoutEffects,
  );
  if (!hydrateWalker) insert(root, container, null);
  verify(root);
  applyRefs(refs);
  applyEffects(layoutEffects);
  return root;
}

export function createChild(
  renderable: CoercedRenderable,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  namespace: NS,
  mode: CreateMode,
  refs: RefWork[],
  layoutEffects: EffectState[],
): DiffableFiber {
  const f = fiber(renderable);
  f.namespace = namespace;
  mark(f, parentFiber, previousFiber);

  if (renderable === null) return f;

  if (typeof renderable === 'string') {
    if (hydrateWalker && mode === HYDRATION) {
      const c = hydrateWalker.current;
      if (c !== null && c.nodeType === Node.TEXT_NODE) {
        assertType<Text>(c);
        hydrateWalker.nextSibling();
        f.dom = c;
        if (c.data !== renderable) c.data = renderable;
        return f;
      }
    }
    const dom = document.createTextNode(renderable);
    f.dom = dom;
    if (hydrateWalker && mode === HYDRATION) hydrateWalker.insert(f);
    return f;
  }

  if (isArray(renderable)) {
    let last: null | Fiber = null;
    for (let i = 0; i < renderable.length; i++) {
      const child = createChild(
        coerceRenderable(renderable[i]),
        f,
        last,
        namespace,
        mode,
        refs,
        layoutEffects,
      );
      mark(child, f, last);
      last = child;
    }
    return f;
  }

  f.key = renderable.key;
  const { type, props, ref } = renderable;
  if (typeof type === 'string') {
    if (type === 'svg') namespace = NS_SVG;
    const childNs = childSpace(namespace, type);

    let dom: null | HTMLElement | SVGElement = null;
    let hydrated = false;
    if (hydrateWalker && mode === HYDRATION) {
      const c = hydrateWalker.current;

      if (c !== null && c.nodeType === Node.ELEMENT_NODE) {
        assertType<HTMLElement | SVGElement>(c);
        if (c.localName === type) {
          dom = c;
          addListeners(dom, props);
          hydrateWalker.firstChild();
          hydrated = true;
        }
      }
    }
    if (dom === null) {
      dom = document.createElementNS(nsToNode(namespace), type) as HTMLElement | SVGElement;
      addProps(dom, props);
    }

    setOnNode(dom, f);
    f.dom = dom;
    f.ref = ref;

    createChild(
      coerceRenderable(props.children),
      f,
      null,
      childNs,
      hydrated ? HYDRATION : CREATION,
      refs,
      layoutEffects,
    );
    deferRef(refs, dom, null, ref);

    if (hydrateWalker && mode === HYDRATION) {
      if (hydrated) {
        hydrateWalker!.parentNext();
      } else {
        hydrateWalker.insert(f);
      }
    }
    return f;
  }

  if (isFunctionComponent(type)) {
    f.stateData = [];
    createChild(
      renderComponentWithHooks(type, props, ref, f as FunctionComponentFiber, layoutEffects),
      f,
      null,
      namespace,
      mode,
      refs,
      layoutEffects,
    );
    return f;
  }

  const component = (f.component = new type(props));
  f.ref = ref;
  createChild(
    coerceRenderable(component.render(props)),
    f,
    null,
    namespace,
    mode,
    refs,
    layoutEffects,
  );
  deferRef(refs, component, null, renderable.ref);
  return f;
}

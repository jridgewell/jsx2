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

let hydrateWalker: null | HydrateWalker = null;
class HydrateWalker {
  declare parent: null | Node;
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
    debug: assert(parent !== null);
    this.current = parent.nextSibling;
    this.parent = parent.parentNode;
  }

  insert(fiber: Fiber) {
    const { current, parent } = this;
    debug: assert(parent !== null);
    insert(fiber, parent, current);
  }

  prune(container: Node) {
    do {
      this.removeRemaining();
    } while (this.parent !== container);
  }

  private removeRemaining() {
    const { parent } = this;
    debug: assert(parent !== null);

    let { current } = this;
    while (current !== null) {
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
    hydrateWalker.prune(container);
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
  createChild(renderable, root, null, namespace, true, refs, layoutEffects);
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
  allowHydration: boolean,
  refs: RefWork[],
  layoutEffects: EffectState[],
): DiffableFiber {
  const f = fiber(renderable);
  f.namespace = namespace;
  mark(f, parentFiber, previousFiber);

  if (renderable === null) return f;

  if (typeof renderable === 'string') {
    if (hydrateWalker && allowHydration) {
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
    if (hydrateWalker && allowHydration) hydrateWalker.insert(f);
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
        allowHydration,
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
    if (hydrateWalker && allowHydration) {
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

    createChild(coerceRenderable(props.children), f, null, childNs, hydrated, refs, layoutEffects);
    deferRef(refs, dom, null, ref);

    if (hydrateWalker && allowHydration) {
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
      allowHydration,
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
    allowHydration,
    refs,
    layoutEffects,
  );
  deferRef(refs, component, null, renderable.ref);
  return f;
}

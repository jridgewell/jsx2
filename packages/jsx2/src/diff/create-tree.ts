import type { RefWork } from './ref';
import type { DiffableFiber, Fiber, FunctionComponentFiber, RootFiber } from '../fiber';
import type { EffectState } from '../hooks';
import type { CoercedRenderable } from '../util/coerce-renderable';

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
import { NS, childSpace, nsFromNode, nsToNode } from '../util/namespace';

let hydrateWalker: null | HydrateWalker = null;
class HydrateWalker {
  private declare parent: Node;
  public declare current: Node | null;
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
    const { parent } = this;
    debug: assert(parent.parentNode !== null);
    this.current = parent.nextSibling;
    this.parent = parent.parentNode;
  }
}

export function createTree(renderable: CoercedRenderable, container: Node): RootFiber {
  return internal(renderable, container, false);
}

export function hydrateTree(renderable: CoercedRenderable, container: Node): RootFiber {
  const oldWalker = hydrateWalker;
  try {
    hydrateWalker = new HydrateWalker(container);
    return internal(renderable, container, true);
  } finally {
    hydrateWalker = oldWalker;
  }
}

function internal(renderable: CoercedRenderable, container: Node, hydrate: boolean): RootFiber {
  const root = fiber(container);
  const namespace = nsFromNode(container);
  root.dom = container;
  root.namespace = namespace;
  const refs: RefWork[] = [];
  const layoutEffects: EffectState[] = [];
  createChild(renderable, root, null, namespace, refs, layoutEffects);
  if (!hydrate) insert(root, container, null);
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
  refs: RefWork[],
  layoutEffects: EffectState[],
): DiffableFiber {
  const f = fiber(renderable);
  f.namespace = namespace;
  mark(f, parentFiber, previousFiber);

  if (renderable === null) return f;

  if (typeof renderable === 'string') {
    if (hydrateWalker) {
      const dom = hydrateWalker.current;
      debug: {
        assert(dom !== null && dom.nodeType === Node.TEXT_NODE, 'failed to hydrate text node');
        assertType<Text>(dom);
      }
      hydrateWalker.nextSibling();
      if (dom.data !== renderable) dom.data = renderable;
      f.dom = dom;
    } else {
      f.dom = document.createTextNode(renderable);
    }
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
    if (type === 'svg') namespace = NS.SVG;
    const childNs = childSpace(namespace, type);

    let dom: HTMLElement | SVGElement;
    if (hydrateWalker) {
      const c = hydrateWalker.current;
      debug: {
        assert(c !== null && c.nodeType === Node.ELEMENT_NODE, 'failed to hydrate element node');
        assertType<HTMLElement | SVGElement>(c);
      }
      dom = c;
      hydrateWalker.firstChild();
    } else {
      dom = document.createElementNS(nsToNode(namespace), type) as HTMLElement | SVGElement;
    }

    setOnNode(dom, f);
    f.dom = dom;
    f.ref = ref;

    if (hydrateWalker) {
      addListeners(dom, props);
    } else {
      addProps(dom, props);
    }
    createChild(coerceRenderable(props.children), f, null, childNs, refs, layoutEffects);
    deferRef(refs, dom, null, ref);

    if (hydrateWalker) hydrateWalker.parentNext();
    return f;
  }

  if (isFunctionComponent(type)) {
    f.stateData = [];
    createChild(
      renderComponentWithHooks(type, props, ref, f as FunctionComponentFiber, layoutEffects),
      f,
      null,
      namespace,
      refs,
      layoutEffects,
    );
    return f;
  }

  const component = (f.component = new type(props));
  f.ref = ref;
  createChild(coerceRenderable(component.render(props)), f, null, namespace, refs, layoutEffects);
  deferRef(refs, component, null, renderable.ref);
  return f;
}

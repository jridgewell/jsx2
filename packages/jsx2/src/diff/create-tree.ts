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
import { assertType } from '../util/assert';
import { coerceRenderable } from '../util/coerce-renderable';
import { isArray } from '../util/is-array';
import { NS_SVG, childSpace, nsFromNode, nsToNode } from '../util/namespace';
import { TreeWalker } from '../util/tree-walker';

const CREATION = 0;
const HYDRATION = 1;
type CreateMode = typeof HYDRATION | typeof CREATION;

let hydrateWalker: null | TreeWalker = null;

export function hydrateRoot(renderable: CoercedRenderable, container: Node): RootFiber {
  const oldWalker = hydrateWalker;
  try {
    hydrateWalker = new TreeWalker(container);
    const f = createRoot(renderable, container);
    hydrateWalker.removeRemaining();
    return f;
  } finally {
    hydrateWalker = oldWalker;
  }
}

export function createRoot(renderable: CoercedRenderable, container: Node): RootFiber {
  const root = fiber(container);
  const namespace = nsFromNode(container);
  root.dom = container;
  root.namespace = namespace;
  const refs: RefWork[] = [];
  const layoutEffects: EffectState[] = [];
  internal(
    renderable,
    root,
    null,
    namespace,
    refs,
    layoutEffects,
    hydrateWalker ? HYDRATION : CREATION,
  );
  if (!hydrateWalker) insert(root, container, null);
  verify(root);
  applyRefs(refs);
  applyEffects(layoutEffects);
  return root;
}

export function createTree(
  renderable: CoercedRenderable,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  namespace: NS,
  refs: RefWork[],
  layoutEffects: EffectState[],
): DiffableFiber {
  return internal(renderable, parentFiber, previousFiber, namespace, refs, layoutEffects, CREATION);
}

function internal(
  renderable: CoercedRenderable,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  namespace: NS,
  refs: RefWork[],
  layoutEffects: EffectState[],
  mode: CreateMode,
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
      const child = internal(
        coerceRenderable(renderable[i]),
        f,
        last,
        namespace,
        refs,
        layoutEffects,
        mode,
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

    internal(
      coerceRenderable(props.children),
      f,
      null,
      childNs,
      refs,
      layoutEffects,
      hydrated ? HYDRATION : CREATION,
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
    internal(
      renderComponentWithHooks(type, props, ref, f as FunctionComponentFiber, layoutEffects),
      f,
      null,
      namespace,
      refs,
      layoutEffects,
      mode,
    );
    return f;
  }

  const component = (f.component = new type(props));
  f.ref = ref;
  internal(
    coerceRenderable(component.render(props)),
    f,
    null,
    namespace,
    refs,
    layoutEffects,
    mode,
  );
  deferRef(refs, component, null, renderable.ref);
  return f;
}

import type { RefWork } from './ref';
import type { DiffableFiber, Fiber, FunctionComponentFiber, RootFiber } from '../fiber';
import type { EffectState } from '../hooks';
import type { CoercedRenderable } from '../util/coerce-renderable';

import { applyEffects } from './effects';
import { addProps } from './prop';
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

export function createTree(
  renderable: CoercedRenderable,
  container: Node,
  hydrate: boolean,
): RootFiber {
  const root = fiber(container);
  const namespace = nsFromNode(container);
  root.dom = container;
  root.namespace = namespace;
  const refs: RefWork[] = [];
  const layoutEffects: EffectState[] = [];
  if (hydrate) {
    createChild(
      renderable,
      root,
      null,
      namespace,
      refs,
      layoutEffects,
      new HydrateWalker(container),
    );
  } else {
    createChild(renderable, root, null, namespace, refs, layoutEffects, null);
    insert(root, container, null);
  }
  verify(root);
  applyRefs(refs);
  applyEffects(layoutEffects);
  return root;
}

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

export function createChild(
  renderable: CoercedRenderable,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  namespace: NS,
  refs: RefWork[],
  layoutEffects: EffectState[],
  walker: null | HydrateWalker,
): DiffableFiber {
  const f = fiber(renderable);
  f.namespace = namespace;
  mark(f, parentFiber, previousFiber);

  if (renderable === null) return f;

  if (typeof renderable === 'string') {
    let dom: Text;
    if (walker) {
      const c = walker.current;
      debug: {
        assert(c !== null && c.nodeType === Node.TEXT_NODE, 'failed to hydrate text node');
        assertType<Text>(c);
      }
      dom = c;
      walker.nextSibling();
      if (dom.data !== renderable) dom.data = renderable;
    } else {
      dom = document.createTextNode(renderable);
    }
    f.dom = dom;
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
        walker,
      );
      mark(child, f, last);
      last = child;
    }
    return f;
  }

  f.key = renderable.key;
  const { type, props, ref } = renderable;
  if (typeof type === 'string') {
    let dom: HTMLElement | SVGElement;
    if (type === 'svg') namespace = NS.SVG;
    if (walker) {
      const c = walker.current;
      debug: {
        assert(c !== null && c.nodeType === Node.ELEMENT_NODE, 'failed to hydrate element node');
        assertType<HTMLElement | SVGElement>(c);
      }
      dom = c;
      walker.firstChild();
    } else {
      dom = document.createElementNS(nsToNode(namespace), type) as HTMLElement | SVGElement;
    }
    const childNs = childSpace(namespace, type);
    setOnNode(dom, f);
    f.dom = dom;
    f.ref = ref;

    // TODO: don't diff, only events
    addProps(dom, props);
    createChild(coerceRenderable(props.children), f, null, childNs, refs, layoutEffects, walker);
    deferRef(refs, dom, null, ref);

    if (walker) walker.parentNext();
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
      walker,
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
    refs,
    layoutEffects,
    walker,
  );
  deferRef(refs, component, null, renderable.ref);
  return f;
}

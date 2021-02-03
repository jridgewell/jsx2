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
import { coerceRenderable } from '../util/coerce-renderable';
import { isArray } from '../util/is-array';
import { NS, childSpace, nsFromNode, nsToNode } from '../util/namespace';

export function createTree(renderable: CoercedRenderable, container: Node): RootFiber {
  const root = fiber(container);
  const namespace = nsFromNode(container);
  root.dom = container;
  root.namespace = namespace;
  const refs: RefWork[] = [];
  const layoutEffects: EffectState[] = [];
  createChild(renderable, root, null, namespace, refs, layoutEffects);
  insert(root, container, null);
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
    f.dom = document.createTextNode(renderable);
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
    const el = createElementNS(namespace, type);
    const childNs = childSpace(namespace, type);
    setOnNode(el, f);
    f.dom = el;
    f.ref = ref;
    addProps(el, props);
    createChild(coerceRenderable(props.children), f, null, childNs, refs, layoutEffects);
    deferRef(refs, el, null, ref);
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

function createElementNS(namespace: NS, name: string): HTMLElement | SVGElement {
  if (namespace !== NS.HTML) {
    return document.createElementNS(nsToNode(namespace), name) as SVGElement;
  }
  if (name === 'script') {
    const c = document.createElement('div');
    c.innerHTML = '<script>';
    return c.removeChild(c.firstChild as HTMLScriptElement);
  }
  return document.createElement(name);
}

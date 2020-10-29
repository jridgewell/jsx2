import type { CoercedRenderable } from '../util/coerce-renderable';
import type { Fiber, DiffableFiber, FunctionComponentFiber, RootFiber } from '../fiber';
import type { RefWork } from './ref';
import type { EffectState } from '../hooks';

import { isFunctionComponent } from '../component';
import { fiber } from '../fiber';
import { insert } from '../fiber/insert';
import { mark } from '../fiber/mark';
import { verify } from '../fiber/verify';
import { coerceRenderable } from '../util/coerce-renderable';
import { isArray } from '../util/is-array';
import { addProps } from './prop';
import { applyRefs, deferRef } from './ref';
import { renderComponentWithHooks } from './render-component-with-hooks';
import { applyEffects } from './effects';

export function createTree(renderable: CoercedRenderable, container: Node): RootFiber {
  const root = fiber(container);
  const refs: RefWork[] = [];
  const layoutEffects: EffectState[] = [];
  createChild(renderable, root, null, refs, layoutEffects);
  insert(root, container, null);
  verify(root);
  applyRefs(refs);
  applyEffects(layoutEffects);
  root.dom = container;
  return root;
}

export function createChild(
  renderable: CoercedRenderable,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  refs: RefWork[],
  layoutEffects: EffectState[],
): DiffableFiber {
  const f = fiber(renderable);
  mark(f, parentFiber, previousFiber);

  if (renderable === null) return f;

  if (typeof renderable === 'string') {
    f.dom = document.createTextNode(renderable);
    return f;
  }

  if (isArray(renderable)) {
    let last: null | Fiber = null;
    for (let i = 0; i < renderable.length; i++) {
      const child = createChild(coerceRenderable(renderable[i]), f, last, refs, layoutEffects);
      mark(child, f, last);
      last = child;
    }
    return f;
  }

  f.key = renderable.key;
  const { type, props, ref } = renderable;
  if (typeof type === 'string') {
    const el = document.createElement(type);
    f.dom = el;
    f.ref = ref;
    addProps(el, props);
    createChild(coerceRenderable(props.children), f, null, refs, layoutEffects);
    deferRef(refs, el, null, ref);
    return f;
  }

  if (isFunctionComponent(type)) {
    f.stateData = [];
    createChild(
      renderComponentWithHooks(type, props, f as FunctionComponentFiber, layoutEffects),
      f,
      null,
      refs,
      layoutEffects,
    );
    return f;
  }

  const component = (f.component = new type(props));
  f.ref = ref;
  createChild(coerceRenderable(component.render(props)), f, null, refs, layoutEffects);
  deferRef(refs, component, null, renderable.ref);
  return f;
}

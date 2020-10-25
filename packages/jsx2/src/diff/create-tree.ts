import type { CoercedRenderable } from '../util/coerce-renderable';
import type { FunctionComponentFiber } from '../fiber';
import type { Fiber } from '../fiber';
import type { RefWork } from './ref';

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

export function createTree(renderable: CoercedRenderable, container: Node): Fiber {
  const root = fiber(null);
  const refs: RefWork[] = [];
  createChild(renderable, root, null, refs);
  insert(root, container, null);
  verify(root);
  applyRefs(refs);
  return root;
}

export function createChild(
  renderable: CoercedRenderable,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  refs: RefWork[],
): Fiber {
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
      const child = createChild(coerceRenderable(renderable[i]), f, last, refs);
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
    createChild(coerceRenderable(props.children), f, null, refs);
    deferRef(refs, el, null, ref);
    return f;
  }

  if (isFunctionComponent(type)) {
    f.stateData = [];
    createChild(
      renderComponentWithHooks(type, props, f as FunctionComponentFiber),
      f,
      null,
      refs,
    );
    return f;
  }

  const component = (f.component = new type(props));
  f.ref = ref;
  createChild(coerceRenderable(component.render(props)), f, null, refs);
  deferRef(refs, component, null, renderable.ref);
  return f;
}

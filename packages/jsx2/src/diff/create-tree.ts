type CoercedRenderable = import('../util/coerce-renderable').CoercedRenderable;
type Renderable = import('../render').Renderable;
type Fiber = import('../fiber').Fiber;
type DynamicExpression = import('../fiber').DynamicExpression;
type RefWork = import('./ref').RefWork;
type StaticNode = import('../template-result').StaticNode;
type Props = import('../template-result').Props;
type Marker = import('../template-result').Marker;

import { isFunctionComponent } from '../component';
import { fiber } from '../fiber';
import { insert } from '../fiber/insert';
import { mark } from '../fiber/mark';
import { coerceRenderable } from '../util/coerce-renderable';
import { isArray } from '../util/is-array';
import { addProps } from './prop';
import { deferRef } from './ref';
import { isValidTemplate } from '../template-result';
import { isValidElement, VNode } from '../create-element';

export function createTree(renderable: CoercedRenderable, container: Node, refs: RefWork[]): Fiber {
  const root = fiber(null);
  createChild(renderable, root, null, refs);
  insert(root, container, null);
  return root;
}

export function createChild(
  renderable: CoercedRenderable | StaticNode | Marker,
  parentFiber: Fiber,
  previousFiber: null | Fiber,
  refs: RefWork[],
  expressions?: Renderable[],
  dynamics?: DynamicExpression[],
): Fiber {
  const f = fiber(null) as Fiber;
  if (typeof renderable === 'number') {
    renderable = coerceRenderable(expressions![renderable]);
    // dynamics!.push({ })
  }
  mark(f, parentFiber, previousFiber);

  if (renderable === null) return f;
  f.data = renderable;

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

  if (isValidTemplate(renderable)) {
    const dynamics = f.dynamics = [];
    createChild(renderable.tree, f, null, refs, renderable.expressions, dynamics);
    return f;
  }

  if (!isValidElement(renderable)) {
    const el = document.createElement(renderable.type);
    f.dom = el;
    // f.key = extractExpression(expressions!, dynamics!, renderable.key);
    const ref = f.ref = extractExpression(expressions!, dynamics!, renderable.ref);
    const props = extractProps(expressions!, dynamics!, renderable.props);
    const { children = null } = props;
    addProps(el, props);
    createChild(children, f, null, refs);
    deferRef(refs, el, null, ref);
    return f;
  }

  // f.key = renderable.key;
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
    createChild(coerceRenderable(type(props)), f, null, refs);
    return f;
  }

  const component = (f.component = new type(props));
  f.ref = ref;
  createChild(coerceRenderable(component.render(props)), f, null, refs);
  deferRef(refs, component, null, renderable.ref);
  return f;
}

function extractExpression<T>(expressions: Renderable[], dynamics: DynamicExpression[], maybeMarker: T | number): T {
  if (typeof maybeMarker !== 'number') return maybeMarker;

  return expressions[maybeMarker] as unknown as T;
}

function extractProps(expressions: Renderable[], props: StaticNode['props'] | VNode['props']): Props {
  return {};
}

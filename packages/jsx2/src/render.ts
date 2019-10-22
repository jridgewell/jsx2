type VNode<R> = import('./create-element').VNode<R>;
type CoercedRenderable<R> = import('./diff/coerce-renderable').CoercedRenderable<R>;

import { coerceRenderable } from './diff/coerce-renderable';
import { createTree } from './diff/create-tree';
import { diffTree } from './diff/diff-tree';
// import { createElement } from './create-element';
// import { Fragment } from './fragment';

export type Container<R> = (Element | Document | ShadowRoot | DocumentFragment) & {
  _component?: CoercedRenderable<R>;
};

export type Renderable<R> =
  | string
  | number
  | boolean
  | null
  | undefined
  | VNode<R>
  // | TemplateResult
  | RenderableArray<R>;
interface RenderableArray<R> extends Array<Renderable<R>> {}

export function render<R>(_renderable: Renderable<R>, container: Container<R>): void {
  const renderable = coerceRenderable(_renderable);
  // renderable = createElement<R>(Fragment, null, renderable);
  const old = container._component;
  if (old) {
    diffTree(old, renderable, container, container.firstChild);
  } else {
    createTree(renderable, container);
    container._component = renderable;
  }
}

type VNode<R> = import('./create-element').VNode<R>;

import { createElement } from './create-element';
import { createTree } from './diff/create-tree';
// import { diffTree } from './diff/diff-tree';
import { Fragment } from './fragment';

export type Container<R> = (Element | Document | ShadowRoot | DocumentFragment) & {
  _component?: Renderable<R>;
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

export function render<R>(renderable: Renderable<R>, container: Container<R>): void {
  renderable = createElement<R>(Fragment, null, renderable);
  const old = container._component;
  if (old) {
    // diffTree(old, renderable, container, null);
  } else {
    createTree(renderable, container);
    container._component = renderable;
  }
}

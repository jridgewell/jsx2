type VNode = import('./create-element').VNode;
type Fiber = import('./util/fiber').Fiber;

import { createTree } from './diff/create-tree';
import { diffTree } from './diff/diff-tree';
import { coerceRenderable } from './util/coerce-renderable';
import { createElement } from './create-element';
import { Fragment } from './fragment';

export type Container = (Element | Document | ShadowRoot | DocumentFragment) & {
  _fiber?: Fiber;
};

export type Renderable =
  | string
  | number
  | boolean
  | null
  | undefined
  | VNode
  // | TemplateResult
  | RenderableArray;
export interface RenderableArray extends ReadonlyArray<Renderable> {}

export function render(_renderable: Renderable, container: Container): void {
  const renderable = createElement(Fragment, null, coerceRenderable(_renderable));
  const old = container._fiber;
  if (old) {
    diffTree(old, renderable);
  } else {
    container.textContent = '';
    createTree(renderable, container);
  }
}

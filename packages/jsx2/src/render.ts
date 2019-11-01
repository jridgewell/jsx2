type VNode = import('./create-element').VNode;
type Fiber = import('./fiber').Fiber;

import { createElement } from './create-element';
import { createTree } from './diff/create-tree';
import { diffTree } from './diff/diff-tree';
import { Fragment } from './fragment';
import { coerceRenderable } from './util/coerce-renderable';

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
    diffTree(old, renderable, container);
  } else {
    container.textContent = '';
    container._fiber = createTree(renderable, container);
  }
}

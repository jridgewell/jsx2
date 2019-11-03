type VNode = import('./create-element').VNode;
type Fiber = import('./fiber').Fiber;
type RefWork = import('./diff/ref').RefWork;

import { createElement } from './create-element';
import { createTree } from './diff/create-tree';
import { diffTree } from './diff/diff-tree';
import { applyRefs } from './diff/ref';
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
  const renderable = createElement(Fragment, null, _renderable);
  const refs: RefWork[] = [];
  const old = container._fiber;
  if (old) {
    diffTree(old, renderable, container, refs);
  } else {
    container.textContent = '';
    container._fiber = createTree(renderable, container, refs);
  }
  applyRefs(refs);
}

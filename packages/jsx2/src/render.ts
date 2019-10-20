type VNode<R> = import('./create-element').VNode<R>;

import { createElement } from './create-element';
import { createTree } from './diff/create-tree';
import { Fragment } from './fragment';

export type Container = (Element | Document | ShadowRoot | DocumentFragment) & {
  _component?: unknown;
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

export function render<R>(element: Renderable<R>, container: Container): void {
  element = createElement<R>(Fragment, null, element);
  if (container._component) {
    // patchElement(element, container)
  } else {
    createTree(element, container);
  }
}

import type { VNode } from './create-element';
import type { RootFiber } from './fiber';

import { createTree } from './diff/create-tree';
import { diffTree } from './diff/diff-tree';
import { coerceRenderable } from './util/coerce-renderable';

export type Container = (Element | Document | ShadowRoot | DocumentFragment) & {
  _fiber?: RootFiber;
};

export type Renderable =
  | string
  | number
  | boolean
  | null
  | undefined
  | VNode
  // | TemplateBlock
  | RenderableArray;
export type RenderableArray = ReadonlyArray<Renderable>;

export function render(_renderable: Renderable, container: Container): void {
  const renderable = coerceRenderable(_renderable);
  const old = container._fiber;
  if (old) {
    diffTree(old, renderable, container);
  } else {
    container.textContent = '';
    container._fiber = createTree(renderable, container);
  }
}

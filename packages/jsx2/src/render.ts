import type { VNode } from './create-element';

import { createTree } from './diff/create-tree';
import { diffTree } from './diff/diff-tree';
import { getFromNode, setOnNode } from './fiber/node';
import { coerceRenderable } from './util/coerce-renderable';

type Container = Element | Document | ShadowRoot | DocumentFragment;

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
  if (old && old.data === container) {
    diffTree(old, renderable, container);
  } else {
    container.textContent = '';
    setOnNode(container, createTree(renderable, container));
  }
}

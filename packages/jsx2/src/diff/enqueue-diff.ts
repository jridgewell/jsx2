import type { FunctionComponentFiber } from '../fiber';
import type { FunctionComponentVNode } from '../create-element';
import type { EffectState } from '../hooks';

import { defer } from '../defer';
import { getContainer } from '../fiber/get-container';
import { diffTree } from './diff-tree';
import { coerceRenderable } from '../util/coerce-renderable';
import { renderComponentWithHooks } from './render-component-with-hooks';

let diffs: FunctionComponentFiber[] = [];

function process() {
  while (diffs.length > 0) {
    // Process top-down, so that we can skip rendering a child component twice
    // if a parent rerenders.
    const scheduled = diffs.sort((a, b) => a.depth - b.depth);
    diffs = [];
    for (let i = 0; i < scheduled.length; i++) {
      const fiber = scheduled[i];
      if (!fiber.dirty) continue;
      fiber.dirty = false;

      const renderable = fiber.data as FunctionComponentVNode;
      const { type, props } = renderable;
      const layoutEffects: EffectState[] = [];
      const rendered = coerceRenderable(
        renderComponentWithHooks(type, props, fiber, layoutEffects),
      );
      diffTree(fiber, rendered, getContainer(fiber.parent!)!, layoutEffects);
    }
  }
}

export function enqueueDiff(fiber: FunctionComponentFiber): void {
  if (fiber.dirty) return;
  fiber.dirty = true;
  if (fiber.current) return;
  const length = diffs.push(fiber);
  if (length === 1) defer(process);
}

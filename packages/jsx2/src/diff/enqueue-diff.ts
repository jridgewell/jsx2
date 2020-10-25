type Fiber = import('../fiber').Fiber;
type RefWork = import('./ref').RefWork;
type FunctionComponentVNode = import('../create-element').FunctionComponentVNode;
type ClassComponentVNode = import('../create-element').ClassComponentVNode;

import { defer } from '../defer';
import { getContainer } from '../fiber/get-container';
import { getPreviousFiber } from '../fiber/get-previous-fiber';
import { renderComponent } from './diff-tree';
import { applyRefs } from './ref';

let diffs: Fiber[] = [];

function process() {
  while (diffs.length > 0) {
    // Process top-down, so that we can skip rendering a child component twice
    // if a parent rerenders.
    const scheduled = diffs.sort((a, b) => a.depth - b.depth);
    diffs = [];
    for (let i = 0; i < scheduled.length; i++) {
      const fiber = scheduled[i];
      if (!fiber.dirty) continue;
      const parent = fiber.parent!;
      const refs: RefWork[] = [];
      renderComponent(
        fiber,
        fiber.data as FunctionComponentVNode | ClassComponentVNode,
        parent,
        getPreviousFiber(fiber, parent),
        getContainer(parent)!,
        refs,
      );
      applyRefs(refs);
    }
  }
}

export function enqueueDiff(fiber: Fiber) {
  if (fiber.dirty) return;
  fiber.dirty = true;
  const length = diffs.push(fiber);
  if (length === 1) defer(process);
}

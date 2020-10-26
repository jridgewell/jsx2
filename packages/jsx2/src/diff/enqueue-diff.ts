import type { FunctionComponentFiber } from '../fiber';

import { rediffComponent } from './diff-tree';

const nextTick = Promise.prototype.then.bind(Promise.resolve());

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
      rediffComponent(fiber);
    }
  }
}

export function enqueueDiff(fiber: FunctionComponentFiber): void {
  if (fiber.dirty) return;
  fiber.dirty = true;
  if (fiber.current) return;
  const length = diffs.push(fiber);
  if (length === 1) nextTick(process);
}

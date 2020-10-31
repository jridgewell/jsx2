import type { FunctionComponentFiber } from '../fiber';

import { rediffComponent } from './diff-tree';

let resolved: Promise<void>;

function nextTick(process: () => void): void {
  (resolved ||= Promise.resolve()).then(process);
}

function getNextTick(): (process: () => void) => void {
  return nextTick;
}

let diffs: FunctionComponentFiber[] = [];

function process() {
  while (diffs.length > 0) {
    // Process top-down, so that we can skip rendering a child component twice
    // if a parent rerenders.
    const scheduled = diffs.sort((a, b) => a.depth - b.depth);
    diffs = [];
    for (let i = 0; i < scheduled.length; i++) {
      const fiber = scheduled[i];
      if (!fiber.dirty || !fiber.mounted) continue;
      rediffComponent(fiber);
    }
  }
}

export function enqueueDiff(fiber: FunctionComponentFiber, scheduler = getNextTick()): void {
  if (fiber.dirty || !fiber.mounted) return;
  fiber.dirty = true;
  if (fiber.current) return;
  const length = diffs.push(fiber);
  if (length === 1) scheduler(process);
}

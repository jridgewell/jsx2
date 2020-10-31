import type { FunctionComponentFiber } from '../fiber';

import { rediffComponent } from './diff-tree';

let resolved: Promise<void>;
let diffs: FunctionComponentFiber[] = [];
let scheduling = true;

export function enqueueDiff(fiber: FunctionComponentFiber, scheduler = getNextTick()): void {
  if (fiber.dirty || !fiber.mounted) return;
  fiber.dirty = true;
  if (fiber.current) return;
  const length = diffs.push(fiber);
  if (length === 1 && scheduling) scheduler(process);
}

export function process(): boolean {
  if (diffs.length === 0) return false;
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
  return true;
}

export function skipScheduling(skip: boolean): void {
  scheduling = !skip;
}

// istanbul ignore next
function nextTick(process: () => void): void {
  (resolved ||= Promise.resolve()).then(process);
}

// istanbul ignore next
function getNextTick(): (process: () => void) => void {
  return nextTick;
}

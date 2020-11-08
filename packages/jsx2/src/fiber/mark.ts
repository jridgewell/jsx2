import type { DiffableFiber, Fiber } from '.';

export function mark(current: DiffableFiber, parent: Fiber, previous: null | Fiber): void {
  current.parent = parent;
  current.depth = parent.depth + 1;
  if (previous === null) {
    current.index = 0;
    parent.child = current;
  } else {
    current.index = previous.index + 1;
    previous.next = current;
  }
}

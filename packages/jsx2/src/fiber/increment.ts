import { assert } from '../util/assert';

type Fiber = import('.').Fiber;

export function increment(fiber: null | Fiber, delta: 1 | -1, end: null | Fiber): void {
  let current: null | Fiber = fiber;
  while (current !== end) {
    debug: assert(current !== null, 'end is guaranteed to prevent null loop');
    current.index += delta;
    current = current.next;
  }
}

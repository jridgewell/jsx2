type Fiber = import('.').Fiber;

export function increment(fiber: Fiber, delta: 1 | -1): void {
  let current: null | Fiber = fiber;
  while (current !== null) {
    current.index += delta;
    current = current.next;
  }
}

type Fiber = import('.').Fiber;

export function mark(current: Fiber, parent: Fiber, previous: null | Fiber): void {
  current.parent = parent;
  if (previous) {
    previous.next = current;
  } else {
    parent.child = current;
  }
}

type Fiber = import('.').Fiber;

const __DEBUG__ = true;

export function mark(current: Fiber, parent: Fiber, previous: null | Fiber): void {
  current.parent = parent;
  if (previous) {
    // istanbul ignore next
    if (__DEBUG__) current.index = previous.index + 1;
    previous.next = current;
  } else {
    parent.child = current;
  }
}

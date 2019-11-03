import { setRef } from '../diff/ref';

type Fiber = import('.').Fiber;

export function remove(fiber: Fiber, previousFiber: null | Fiber, container: Node): null | Fiber {
  const { next } = fiber;
  removeRange(fiber, next, container);
  if (previousFiber) previousFiber.next = next;
  return next;
}

function removeRange(fiber: Fiber, end: null | Fiber, container: Node): void {
  let current: null | Fiber = fiber;
  do {
    const { dom, child, ref } = current!;
    if (dom) {
      if (ref) setRef(null, ref);
      container.removeChild(dom);
    } else if (child) {
      removeRange(child, null, container);
    }
    current = current!.next;
  } while (current !== end);
}

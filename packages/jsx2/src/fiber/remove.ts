type Fiber = import('.').Fiber;

export function remove(fiber: Fiber, previousFiber: null | Fiber, container: Node): null | Fiber {
  const { next } = fiber;
  removeRange(fiber, fiber.next, container);
  if (previousFiber) previousFiber.next = next;
  return next;
}

function removeRange(fiber: null | Fiber, end: null | Fiber, container: Node): void {
  while (fiber !== end) {
    const { dom, child } = fiber!;
    if (dom) {
      container.removeChild(dom);
    } else if (child) {
      removeRange(child, null, container);
    }
    fiber = fiber!.next;
  }
}

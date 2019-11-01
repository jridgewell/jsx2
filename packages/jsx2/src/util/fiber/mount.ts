type Fiber = import('.').Fiber;

export function mount(fiber: null | Fiber, container: Node, before: null | Node): void {
  while (fiber !== null) {
    const { dom, child } = fiber;
    if (dom) {
      if (child) mount(child, dom, null);
      container.insertBefore(dom, before);
    } else if (child) {
      mount(child, container, before);
    }
    fiber = fiber.next;
  }
}

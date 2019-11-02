type Fiber = import('.').Fiber;

export function mount(fiber: Fiber, container: Node, before: null | Node): void {
  let current: null | Fiber = fiber;
  do {
    const { dom, child } = current;
    if (dom) {
      if (child) mount(child, dom, null);
      container.insertBefore(dom, before);
    } else if (child) {
      mount(child, container, before);
    }
    current = current.next;
  } while (current !== null);
}

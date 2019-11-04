type Fiber = import('.').Fiber;

export function getParentNode(fiber: Fiber, container: Node): Node {
  let current = fiber.parent;
  while (current !== null) {
    const { dom } = current;
    if (dom) return dom;

    current = current.parent;
  }
  return container;
}

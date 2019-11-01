type Fiber = import('.').Fiber;

export function getNextSibling(fiber: Fiber, container: Node, skipSelf?: boolean): null | Node {
  let current = skipSelf ? nextFiber(fiber) : fiber;
  while (current !== null) {
    const { dom, child } = current;
    if (dom) {
      return dom.parentNode === container ? dom : null;
    } else if (child) {
      return getNextSibling(child, container);
    }

    current = nextFiber(current);
  }
  return null;
}

function nextFiber(fiber: Fiber): null | Fiber {
  const { next } = fiber;
  if (next) {
    return next;
  } else {
    const { parent } = fiber;
    return parent ? nextFiber(parent) : null;
  }
}

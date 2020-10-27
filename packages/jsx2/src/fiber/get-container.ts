import type { Fiber } from '.';
export function getContainer(fiber: Fiber): Fiber['dom'] {
  let current: null | Fiber = fiber;
  do {
    const { dom } = current;
    if (dom) return dom;
    current = current.parent;
  } while (current);
  return null;
}

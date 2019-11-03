type Fiber = import('.').Fiber;

import { setRef } from '../diff/ref';

export function unmount(fiber: Fiber): void {
  let current: null | Fiber = fiber;
  do {
    const { ref, child } = current;
    if (ref) setRef(null, ref);
    if (child) unmount(child);

    current = current.next;
  } while (current !== null);
}

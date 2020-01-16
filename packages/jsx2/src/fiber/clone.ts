type Fiber = import('.').Fiber;

import { fiber } from '.';

export function clone<T extends Fiber>(current: T): T {
  const clone = fiber(current.data);
  Object.assign(clone, current);
  Object.assign(current, {
    dom: null,
    child: null,
    ref: null,
  });

  for (let c = clone.child; c !== null; c = c.next) c.parent = clone;

  return clone as T;
}

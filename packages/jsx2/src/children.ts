import type { VNode } from './create-element';
import type { Renderable } from './render';

import { isValidElement } from './create-element';

type Individual<T> = Exclude<T, null | undefined | unknown[] | readonly unknown[]>;
type IndividualRenderable = Individual<Renderable>;
type Callback<R> = (child: null | IndividualRenderable, index: number) => R;

export function map<T extends Renderable, R>(
  children: T,
  cb: Callback<R>,
): T extends null | undefined ? T : Individual<R>[] {
  if (children == null) return children as any;
  const mapped: Individual<R>[] = [];
  recurse(children, 0, mapped, cb);
  return mapped as any;
}

export function toArray(children: Renderable): IndividualRenderable[] {
  return map(children, identity) || [];
}

export function count(children: Renderable): number {
  if (children == null) return 0;
  return recurse(children, 0, [], blank);
}

export function only(child: Renderable): VNode {
  if (isValidElement(child)) return child;
  throw new Error('expected to receive a VNode element');
}

export function forEach(children: Renderable, cb: Callback<void>): void {
  if (children == null) return;
  recurse(children, 0, [], (child, index) => {
    cb(child, index);
  });
}

function identity<T>(value: T): T {
  return value;
}

function blank(): void {
  return;
}

function recurse<T, R>(
  child: T,
  calls: number,
  array: Individual<R>[],
  cb: (child: null | IndividualRenderable, index: number) => unknown,
): number {
  let mapped: unknown;
  if (child === null || child === undefined || typeof child === 'boolean') {
    mapped = cb(null, calls++);
  } else if (typeof child === 'string' || typeof child === 'number' || isValidElement(child)) {
    mapped = cb(child, calls++);
  } else {
    if (Array.isArray(child)) {
      for (let i = 0; i < child.length; i++) {
        calls = recurse(child[i], calls, array, cb);
      }
    }
    return calls;
  }

  if (mapped == null) {
    return calls;
  }
  if (!Array.isArray(mapped)) {
    array.push(mapped as Individual<R>);
    return calls;
  }

  // Flatten the mapped array into the return array.
  for (let i = 0; i < mapped.length; i++) {
    const c = mapped[i];
    recurse(c, 0, array, identity);
  }
  return calls;
}

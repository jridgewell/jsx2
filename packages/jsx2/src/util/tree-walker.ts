import type { Fiber } from '../fiber';

import { assert } from './assert';
import { insert } from '../fiber/insert';

export class TreeWalker {
  declare parent: Node;
  declare current: null | Node;
  constructor(parent: Node) {
    this.parent = parent;
    this.current = parent.firstChild;
  }

  firstChild(): void {
    const { current } = this;
    debug: assert(current !== null);
    this.parent = current;
    this.current = current.firstChild;
  }

  nextSibling(): void {
    debug: assert(this.current !== null);
    this.current = this.current.nextSibling;
  }

  parentNext(): void {
    this.removeRemaining();
    const { parent } = this;
    debug: assert(parent.parentNode !== null);
    this.current = parent.nextSibling;
    this.parent = parent.parentNode;
  }

  insert(fiber: Fiber): void {
    const { current, parent } = this;
    insert(fiber, parent, current);
  }

  removeRemaining(): void {
    const { parent } = this;
    for (let { current } = this; current !== null; ) {
      const next = current.nextSibling;
      parent.removeChild(current);
      current = next;
    }
    this.current = null;
  }
}

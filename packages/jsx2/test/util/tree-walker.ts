import type { DiffableFiber } from '../../src/fiber';

import { fiber } from '../../src/fiber';
import { createElement } from '../../src/jsx2';
import { mark } from '../../src/fiber/mark';
import { TreeWalker } from '../../src/util/tree-walker';

describe('TreeWalker', () => {
  function expectTextNode(node: Node, text: string) {
    expect(node).toBeTruthy();
    expect(node.nodeType).toBe(Node.TEXT_NODE);
    expect(node.textContent).toBe(text);
  }

  function expectElement(
    node: Node,
    tag: string,
    namespace = 'http://www.w3.org/1999/xhtml',
  ): asserts node is Element {
    expect(node).toBeTruthy();
    expect(node.nodeType).toBe(Node.ELEMENT_NODE);
    expect((node as Element).localName).toBe(tag);
    expect((node as Element).namespaceURI).toBe(namespace);
  }

  function makeElementFiber(tag: string) {
    const f = fiber(createElement(tag));
    f.dom = document.createElement(tag);
    return f;
  }

  function makeTextFiber(text: string) {
    const f = fiber(text);
    f.dom = document.createTextNode(text);
    return f;
  }

  function makeArrayFiber(array: Array<DiffableFiber>) {
    const f = fiber(array.map((a) => a.data));
    let last = null;
    for (const a of array) {
      mark(a, f, last);
      last = a;
    }
    return f;
  }

  describe('constructor', () => {
    it('sets current to first child', () => {
      const container = document.createElement('body');
      container.appendChild(document.createElement('div'));

      const walker = new TreeWalker(container);

      expect(walker.parent).toBe(container);
    });

    it('sets parent to node', () => {
      const container = document.createElement('body');
      const child = container.appendChild(document.createElement('div'));

      const walker = new TreeWalker(container);

      expect(walker.current).toBe(child);
    });
  });

  describe('firstChild', () => {
    it('sets current node to firstChild', () => {
      const container = document.createElement('body');
      const child = container.appendChild(document.createElement('div'));
      const grandChild = child.appendChild(document.createTextNode('text'));

      const walker = new TreeWalker(container);
      walker.firstChild();

      expect(walker.current).toBe(grandChild);
    });

    it('sets current node to parent', () => {
      const container = document.createElement('body');
      const child = container.appendChild(document.createElement('div'));
      child.appendChild(document.createTextNode('text'));

      const walker = new TreeWalker(container);
      walker.firstChild();

      expect(walker.parent).toBe(child);
    });
  });

  describe('nextSibling', () => {
    it('sets current node to nextSibling', () => {
      const container = document.createElement('body');
      container.appendChild(document.createElement('div'));
      const next = container.appendChild(document.createTextNode('text'));

      const walker = new TreeWalker(container);
      walker.nextSibling();

      expect(walker.current).toBe(next);
    });

    it('keeps current parent', () => {
      const container = document.createElement('body');
      container.appendChild(document.createElement('div'));
      container.appendChild(document.createTextNode('text'));

      const walker = new TreeWalker(container);
      walker.nextSibling();

      expect(walker.parent).toBe(container);
    });
  });

  describe('parentNext', () => {
    it("sets current node to parent's nextSibling", () => {
      const container = document.createElement('body');
      const child = container.appendChild(document.createElement('div'));
      const next = container.appendChild(document.createElement('div'));

      const walker = new TreeWalker(child);
      walker.parentNext();

      expect(walker.current).toBe(next);
    });

    it('sets parent to grand parent', () => {
      const container = document.createElement('body');
      const child = container.appendChild(document.createElement('div'));
      container.appendChild(document.createElement('div'));

      const walker = new TreeWalker(child);
      walker.parentNext();

      expect(walker.parent).toBe(container);
    });
  });

  describe('insert', () => {
    it('inserts fiber tree before current node', () => {
      const container = document.createElement('body');
      const child = container.appendChild(document.createElement('div'));
      const f = makeTextFiber('text');

      const walker = new TreeWalker(container);
      walker.insert(f);

      const text = container.firstChild!;
      expectTextNode(text, 'text');
      expect(text.nextSibling).toBe(child);
    });

    it('inserts deep tree before current node', () => {
      const container = document.createElement('body');
      const child = container.appendChild(document.createElement('div'));
      const f = makeArrayFiber([makeTextFiber('text')]);

      const walker = new TreeWalker(container);
      walker.insert(f);

      const text = container.firstChild!;
      expectTextNode(text, 'text');
      expect(text.nextSibling).toBe(child);
    });

    it('inserts child nodes into parent', () => {
      const container = document.createElement('body');
      const child = container.appendChild(document.createElement('div'));
      const f = makeElementFiber('div');
      const t = makeTextFiber('text');
      mark(t, f, null);

      const walker = new TreeWalker(container);
      walker.insert(f);

      const div = container.firstChild!;
      expectElement(div, 'div');
      expect(div.nextSibling).toBe(child);
      const text = div.firstChild!;
      expectTextNode(text, 'text');
    });

    it('keeps current', () => {
      const container = document.createElement('body');
      const child = container.appendChild(document.createElement('div'));
      const f = makeTextFiber('text');

      const walker = new TreeWalker(container);
      walker.insert(f);

      expect(walker.current).toBe(child);
    });

    it('keeps parent', () => {
      const container = document.createElement('body');
      container.appendChild(document.createElement('div'));
      const f = makeTextFiber('text');

      const walker = new TreeWalker(container);
      walker.insert(f);

      expect(walker.parent).toBe(container);
    });
  });

  describe('removeRemaining', () => {
    it('handles null current', () => {
      const container = document.createElement('body');

      const walker = new TreeWalker(container);
      walker.removeRemaining();

      expect(walker.current).toBe(null);
    });

    it('removes current node', () => {
      const container = document.createElement('body');
      const child = container.appendChild(document.createElement('div'));
      container.appendChild(document.createTextNode('text'));

      const walker = new TreeWalker(container);
      walker.removeRemaining();

      expect(child.parentNode).toBe(null);
    });

    it('removes all next nodes', () => {
      const container = document.createElement('body');
      container.appendChild(document.createElement('div'));
      const next = container.appendChild(document.createTextNode('text'));

      const walker = new TreeWalker(container);
      walker.removeRemaining();

      expect(next.parentNode).toBe(null);
    });

    it('sets current to null', () => {
      const container = document.createElement('body');
      container.appendChild(document.createElement('div'));

      const walker = new TreeWalker(container);
      walker.removeRemaining();

      expect(walker.current).toBe(null);
    });

    it('keeps parent', () => {
      const container = document.createElement('body');
      container.appendChild(document.createElement('div'));

      const walker = new TreeWalker(container);
      walker.removeRemaining();

      expect(walker.parent).toBe(container);
    });
  });
});

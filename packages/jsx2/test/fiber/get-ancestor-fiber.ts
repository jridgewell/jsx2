import type { ElementFiber, Fiber } from '../../src/fiber';
import type { Renderable } from '../../src/render';

import { createElement } from '../../src/jsx2';
import { createRoot } from '../../src/diff/create-tree';
import { getAncestorFiber } from '../../src/fiber/get-ancestor-fiber';
import { coerceRenderable } from '../../src/util/coerce-renderable';

describe('getAncestorFiber', () => {
  function makeTree(renderable: Renderable, container: Node) {
    return createRoot(coerceRenderable(renderable), container);
  }

  function expectElementFiber(fiber: Fiber, tag: string): ElementFiber {
    expect(fiber).toBeTruthy();
    expect(fiber.data).toHaveProperty('type', tag);
    return fiber as ElementFiber;
  }

  it('finds nearest parentNode with a fiber', () => {
    const body = document.createElement('body');
    const parentTree = makeTree(createElement('ul', null, createElement('li')), body);

    const li = body.querySelector('li')!;
    const childRoot = li.appendChild(document.createElement('span'));
    const childTree = makeTree('test', childRoot);

    expect(getAncestorFiber(childTree)).toBe(expectElementFiber(parentTree.child!, 'ul').child);
  });

  it('find nearest parentNode with a fiber through nodes', () => {
    const body = document.createElement('body');
    const parentTree = makeTree(createElement('ul', null, createElement('li')), body);

    const li = body.querySelector('li')!;
    const nested = li.appendChild(document.createElement('nested'));
    const childRoot = nested.appendChild(document.createElement('span'));
    const childTree = makeTree('test', childRoot);

    expect(getAncestorFiber(childTree)).toBe(expectElementFiber(parentTree.child!, 'ul').child);
  });

  it('finds nearest from inside shadow dom', () => {
    const body = document.createElement('body');
    const parentTree = makeTree(createElement('div', null, createElement('span')), body);

    const span = body.querySelector('span')!;
    const childRoot = span.attachShadow({ mode: 'open' });
    const childTree = makeTree('test', childRoot);

    expect(getAncestorFiber(childTree)).toBe(expectElementFiber(parentTree.child!, 'div').child);
  });

  it('finds nearest inside sloted node', () => {
    const body = document.createElement('body');
    const parentRoot = body.attachShadow({ mode: 'open' });
    const parentTree = makeTree(createElement('div', null, createElement('slot')), parentRoot);

    const childRoot = body.appendChild(document.createElement('div'));
    const childTree = makeTree(createElement('span'), childRoot);

    expect(getAncestorFiber(childTree)).toBe(expectElementFiber(parentTree.child!, 'div').child);
  });

  it('returns null if no ancestor fiber', () => {
    const body = document.createElement('body');
    const tree = makeTree(createElement('div'), body);

    expect(getAncestorFiber(tree)).toBe(null);
  });
});

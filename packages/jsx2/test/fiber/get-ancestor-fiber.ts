import { render, createElement } from '../../src/jsx2';
import { getAncestorFiber } from '../../src/fiber/get-ancestor-fiber';
import { getFromNode } from '../../src/fiber/node';

describe('getAncestorFiber', () => {
  it('finds nearest parentNode with a fiber', () => {
    const body = document.createElement('body');
    const parentTree = createElement('ul', null, createElement('li'));
    render(parentTree, body);

    const li = body.querySelector('li')!;
    const childRoot = li.appendChild(document.createElement('span'));
    const childTree = 'test';
    render(childTree, childRoot);

    const fiber = getFromNode(childRoot);
    expect(getAncestorFiber(fiber!)).toBe(getFromNode(li));
  });

  it('find nearest parentNode with a fiber through nodes', () => {
    const body = document.createElement('body');
    const parentTree = createElement('ul', null, createElement('li'));
    render(parentTree, body);

    const li = body.querySelector('li')!;
    const nested = li.appendChild(document.createElement('nested'));
    const childRoot = nested.appendChild(document.createElement('span'));
    const childTree = 'test';
    render(childTree, childRoot);

    const fiber = getFromNode(childRoot);
    expect(getAncestorFiber(fiber!)).toBe(getFromNode(li));
  });

  it('finds nearest from inside shadow dom', () => {
    const body = document.createElement('body');
    const parentTree = createElement('div', null, createElement('span'));
    render(parentTree, body);

    const span = body.querySelector('span')!;
    const childRoot = span.attachShadow({ mode: 'open' });
    const childTree = 'test';
    render(childTree, childRoot);

    const fiber = getFromNode(childRoot);
    expect(getAncestorFiber(fiber!)).toBe(getFromNode(span));
  });

  it('finds nearest inside sloted node', () => {
    const body = document.createElement('body');
    const parentRoot = body.attachShadow({ mode: 'open' });
    const parentTree = createElement('div', null, createElement('slot'));
    render(parentTree, parentRoot);

    const slot = parentRoot.querySelector('slot')!;
    const childRoot = body.appendChild(document.createElement('div'));
    const childTree = createElement('span');
    render(childTree, childRoot);

    const fiber = getFromNode(body.firstChild!);
    expect(getAncestorFiber(fiber!)).toBe(getFromNode(slot));
  });
});

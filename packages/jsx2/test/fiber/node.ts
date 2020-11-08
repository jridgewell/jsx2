import { fiber } from '../../src/fiber';
import { createElement, render } from '../../src/jsx2';
import { getFromNode, setOnNode } from '../../src/fiber/node';

describe('getFromNode', () => {
  it('returns fiber for rendered element', () => {
    const body = document.createElement('body');
    const tree = createElement('div');
    render(tree, body);

    const fiber = getFromNode(body.firstElementChild!);
    expect(fiber).not.toBeNull();
    expect(fiber!.dom).toBe(body.firstElementChild!);
  });

  it('returns fiber for root element', () => {
    const body = document.createElement('body');
    const tree = createElement('div');
    render(tree, body);

    const fiber = getFromNode(body);
    expect(fiber).not.toBeNull();
    expect(fiber!.dom).toBe(body);
  });
});

describe('setOnNode', () => {
  it('sets fiber on node', () => {
    const body = document.createElement('body');
    const f = fiber('test');
    setOnNode(body, f);

    expect(getFromNode(body)).toBe(f);
  });
});

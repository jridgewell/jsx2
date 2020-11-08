import { createElement, render } from '../src/jsx2';

describe('render', () => {
  function expectTextNode(node: Node, text: string) {
    expect(node).toBeTruthy();
    expect(node.nodeType).toBe(Node.TEXT_NODE);
    expect(node.textContent).toBe(text);
  }

  function expectElement(node: Node, tag: string) {
    expect(node).toBeTruthy();
    expect(node.nodeType).toBe(Node.ELEMENT_NODE);
    expect((node as Element).localName).toBe(tag);
  }

  it('renders from blank slate', () => {
    const el = createElement('div', { id: 'foo' }, 'test');
    const container = document.createElement('body');
    container.appendChild(document.createElement('div'));

    render(el, container);

    const div = container.firstChild! as HTMLElement;
    expectElement(div, 'div');
    expect(div.id).toBe('foo');
    expectTextNode(div.firstChild!, 'test');
    expect(div.firstChild).toBe(div.lastChild);
    expect(container.firstChild).toBe(container.lastChild);
  });

  it('removes SSR children', () => {
    const el = createElement('div', { id: 'foo' }, 'test');
    const container = document.createElement('body');
    const child = container.appendChild(document.createElement('div'));

    render(el, container);

    expect(Array.from(container.childNodes)).not.toContain(child);
  });

  it('rerenders already rendered DOM', () => {
    const container = document.createElement('body');
    container.appendChild(document.createElement('div'));

    render(createElement('div', { id: 'foo' }, 'test'), container);
    const div = container.firstChild! as HTMLElement;

    render(createElement('div', { id: 'bar' }, 'baz'), container);

    expect(container.firstChild).toBe(div);
    expect(div.id).toBe('bar');
    expectTextNode(div.firstChild!, 'baz');
    expect(div.firstChild).toBe(div.lastChild);
    expect(container.firstChild).toBe(container.lastChild);
  });

  it('applies refs after fully mounting DOM', () => {
    const ref = jest.fn((el: Element) => {
      expect(container.contains(el)).toBe(true);
    });
    const el = createElement(
      'div',
      { id: 'foo' },
      createElement('inner', {
        ref,
      }),
    );
    const container = document.createElement('body');

    render(el, container);

    expect(ref).toHaveBeenCalled();
  });

  it('applies refs after fully rerendering', () => {
    let lastEl: null | Element = null;
    const ref1 = jest.fn((el: null | Element) => {
      if (lastEl) {
        expect(container.contains(lastEl)).toBe(true);
        lastEl = null;
      }
      lastEl = el;
    });
    const ref2 = jest.fn((el: Element) => {
      expect(container.contains(el)).toBe(true);
    });
    const container = document.createElement('body');

    render(createElement('div', { id: 'foo' }, createElement('first', { ref: ref1 })), container);
    expect(ref1).toHaveBeenCalledTimes(1);
    expect(lastEl).toBeTruthy();

    render(createElement('div', { id: 'foo' }, createElement('second', { ref: ref2 })), container);

    expect(ref1).toHaveBeenCalledTimes(2);
    expect(ref2).toHaveBeenCalledTimes(1);
    expect(lastEl).toBe(null);
  });

  it('allows rendering over an already rendered tree', () => {
    const el = createElement('div', null, createElement('span', null, 'test', 'ing'));
    const container = document.createElement('body');
    const mo = new MutationObserver(() => {});
    mo.observe(container, { childList: true, subtree: true });

    render(el, container);
    // Clear the original render, we know it's happening
    mo.takeRecords();

    const span = container.querySelector('span')!;
    render(['after', 'ing'], span);
    expect(mo.takeRecords()).toHaveLength(0);

    render(createElement('div', null, createElement('span', null, 'after', 'after')), container);
    const records = mo.takeRecords();
    expect(records).toHaveLength(0);
  });
});

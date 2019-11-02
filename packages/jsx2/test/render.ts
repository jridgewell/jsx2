import { render, createElement } from '../src/jsx2';

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
});

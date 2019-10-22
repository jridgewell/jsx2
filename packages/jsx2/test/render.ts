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

  describe('rendering null', () => {
    it('renders nothing', () => {
      const body = document.createElement('body');
      render(null, body);

      expect(body.firstChild).toBe(null);
    });

    it('removes SSR children', () => {
      const body = document.createElement('body');
      body.appendChild(document.createElement('div'));

      render(null, body);

      expect(body.firstChild).toBe(null);
    });

    it('removes rendered children', () => {
      const body = document.createElement('body');
      render(createElement('div'), body);

      render(null, body);

      expect(body.firstChild).toBe(null);
    });
  });

  describe('rendering undefined', () => {
    it('renders nothing', () => {
      const body = document.createElement('body');
      render(undefined, body);

      expect(body.firstChild).toBe(null);
    });

    it('removes SSR children', () => {
      const body = document.createElement('body');
      body.appendChild(document.createElement('div'));

      render(undefined, body);

      expect(body.firstChild).toBe(null);
    });

    it('removes rendered children', () => {
      const body = document.createElement('body');
      render(createElement('div'), body);

      render(undefined, body);

      expect(body.firstChild).toBe(null);
    });
  });

  describe('rendering boolean', () => {
    it('renders nothing', () => {
      const body = document.createElement('body');
      render(true, body);

      expect(body.firstChild).toBe(null);
    });

    it('removes SSR children', () => {
      const body = document.createElement('body');
      body.appendChild(document.createElement('div'));

      render(true, body);

      expect(body.firstChild).toBe(null);
    });

    it('removes rendered children', () => {
      const body = document.createElement('body');
      render(createElement('div'), body);

      render(true, body);

      expect(body.firstChild).toBe(null);
    });
  });

  describe('rendering number', () => {
    it('renders value', () => {
      const body = document.createElement('body');
      render(1, body);

      expectTextNode(body.firstChild!, '1');
    });

    it('replaces SSR element', () => {
      const body = document.createElement('body');
      body.appendChild(document.createElement('div'));

      render(1, body);

      const firstChild = body.firstChild!;
      expectTextNode(firstChild, '1');
      expect(firstChild.nextSibling).toBe(null);
    });

    it('replaces SSR text', () => {
      const body = document.createElement('body');
      const ssr = body.appendChild(document.createTextNode('before'));

      render(1, body);

      const firstChild = body.firstChild!;
      expectTextNode(firstChild, '1');
      expect(firstChild.nextSibling).toBe(null);
      expect(firstChild).not.toBe(ssr);
    });

    it('removes rendered element', () => {
      const body = document.createElement('body');
      render(createElement('div'), body);

      render(1, body);

      const firstChild = body.firstChild!;
      expectTextNode(firstChild, '1');
      expect(firstChild.nextSibling).toBe(null);
    });

    it('updates rendered text', () => {
      const body = document.createElement('body');
      render('before', body);
      const rendered = body.firstChild!;

      render(1, body);

      const firstChild = body.firstChild!;
      expectTextNode(firstChild, '1');
      expect(firstChild.nextSibling).toBe(null);
      expect(firstChild).toBe(rendered);
    });
  });

  describe('rendering string', () => {
    it('renders value', () => {
      const body = document.createElement('body');
      render('hello', body);

      expectTextNode(body.firstChild!, 'hello');
    });

    it('replaces SSR element', () => {
      const body = document.createElement('body');
      body.appendChild(document.createElement('div'));

      render('hello', body);

      const firstChild = body.firstChild!;
      expectTextNode(firstChild, 'hello');
      expect(firstChild.nextSibling).toBe(null);
    });

    it('replaces SSR text', () => {
      const body = document.createElement('body');
      const ssr = body.appendChild(document.createTextNode('before'));

      render('hello', body);

      const firstChild = body.firstChild!;
      expectTextNode(firstChild, 'hello');
      expect(firstChild.nextSibling).toBe(null);
      expect(firstChild).not.toBe(ssr);
    });

    it('removes rendered element', () => {
      const body = document.createElement('body');
      render(createElement('div'), body);

      render('hello', body);

      const firstChild = body.firstChild!;
      expectTextNode(firstChild, 'hello');
      expect(firstChild.nextSibling).toBe(null);
    });

    it('updates rendered text', () => {
      const body = document.createElement('body');
      render('before', body);
      const rendered = body.firstChild!;

      render('hello', body);

      const firstChild = body.firstChild!;
      expectTextNode(firstChild, 'hello');
      expect(firstChild.nextSibling).toBe(null);
      expect(firstChild).toBe(rendered);
    });
  });

  describe('rendering element', () => {
    it('renders element', () => {
      const body = document.createElement('body');

      render(createElement('div'), body);

      expectElement(body.firstChild!, 'div');
    });

    it('replaces SSR element', () => {
      const body = document.createElement('body');
      const ssr = body.appendChild(document.createElement('div'));

      render(createElement('div'), body);

      const firstChild = body.firstChild!;
      expectElement(firstChild, 'div');
      expect(firstChild.nextSibling).toBe(null);
      expect(firstChild).not.toBe(ssr);
    });

    it('replaces SSR text', () => {
      const body = document.createElement('body');
      const ssr = body.appendChild(document.createTextNode('before'));

      render(createElement('div'), body);

      const firstChild = body.firstChild!;
      expectElement(firstChild, 'div');
      expect(firstChild.nextSibling).toBe(null);
      expect(firstChild).not.toBe(ssr);
    });

    it('updates rendered element if tagName is the same', () => {
      const body = document.createElement('body');
      render(createElement('div'), body);
      const rendered = body.firstChild!;

      render(createElement('div'), body);

      const firstChild = body.firstChild!;
      expectElement(firstChild, 'div');
      expect(firstChild.nextSibling).toBe(null);
      expect(firstChild).toBe(rendered);
    });

    it('replaces rendered element if tagName is different', () => {
      const body = document.createElement('body');
      render(createElement('div'), body);
      const rendered = body.firstChild!;

      render(createElement('span'), body);

      const firstChild = body.firstChild!;
      expectElement(firstChild, 'span');
      expect(firstChild.nextSibling).toBe(null);
      expect(firstChild).not.toBe(rendered);
    });

    it('replaces rendered text', () => {
      const body = document.createElement('body');
      render('before', body);
      const rendered = body.firstChild!;

      render(createElement('div'), body);

      const firstChild = body.firstChild!;
      expectElement(firstChild, 'div');
      expect(firstChild.nextSibling).toBe(null);
      expect(firstChild).not.toBe(rendered);
    });

    describe('with props', () => {
      it('renders element', () => {
        const body = document.createElement('body');

        render(createElement('div', { id: 'id' }), body);

        const firstChild = body.firstChild!;
        expectElement(firstChild, 'div');
        expect((firstChild as Element).getAttribute('id')).toBe('id');
      });

      it('updates already rendered prop', () => {
        const body = document.createElement('body');
        render(createElement('div', { id: 'id' }), body);
        const rendered = body.firstChild!;

        render(createElement('div', { id: '2' }), body);

        expect(body.firstChild).toBe(rendered);
        expect((rendered as Element).getAttribute('id')).toBe('2');
      });

      it('adds new prop after render', () => {
        const body = document.createElement('body');
        render(createElement('div', { id: 'id' }), body);
        const rendered = body.firstChild!;

        render(createElement('div', { foo: 'bar' }), body);

        expect(body.firstChild).toBe(rendered);
        expect((rendered as Element).getAttribute('foo')).toBe('bar');
      });

      it('removes old prop after render', () => {
        const body = document.createElement('body');
        render(createElement('div', { id: 'id' }), body);
        const rendered = body.firstChild!;

        render(createElement('div', { foo: 'bar' }), body);

        expect(body.firstChild).toBe(rendered);
        expect((rendered as Element).hasAttribute('id')).toBe(false);
      });
    });
  });
});

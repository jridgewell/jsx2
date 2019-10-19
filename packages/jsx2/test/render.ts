import { render, createElement } from '../src/jsx2';

describe('render', () => {
  beforeEach(() => {});

  function expectTextNode(node: Node, text: string) {
    expect(node).toBeTruthy();
    expect(node.nodeType).toBe(Node.TEXT_NODE);
    expect(node.textContent).toBe(text);
  }

  describe('rendering null', () => {
    it('renders nothing', () => {
      const { body } = document;
      render(null, body);

      expect(body.firstChild).toBe(null);
    });

    it('removes SSR children', () => {
      const { body } = document;
      body.appendChild(document.createElement('div'));

      render(null, body);

      expect(body.firstChild).toBe(null);
    });

    it('removes rendered children', () => {
      const { body } = document;
      render(createElement('div'), body);

      render(null, body);

      expect(body.firstChild).toBe(null);
    });
  });

  describe('rendering undefined', () => {
    it('renders nothing', () => {
      const { body } = document;
      render(undefined, body);

      expect(body.firstChild).toBe(null);
    });

    it('removes SSR children', () => {
      const { body } = document;
      body.appendChild(document.createElement('div'));

      render(undefined, body);

      expect(body.firstChild).toBe(null);
    });

    it('removes rendered children', () => {
      const { body } = document;
      render(createElement('div'), body);

      render(undefined, body);

      expect(body.firstChild).toBe(null);
    });
  });

  describe('rendering boolean', () => {
    it('renders nothing', () => {
      const { body } = document;
      render(true, body);

      expect(body.firstChild).toBe(null);
    });

    it('removes SSR children', () => {
      const { body } = document;
      body.appendChild(document.createElement('div'));

      render(true, body);

      expect(body.firstChild).toBe(null);
    });

    it('removes rendered children', () => {
      const { body } = document;
      render(createElement('div'), body);

      render(true, body);

      expect(body.firstChild).toBe(null);
    });
  });

  describe('rendering number', () => {
    it('renders value', () => {
      const { body } = document;
      render(1, body);

      expectTextNode(body.firstChild!, '1');
    });

    it('replaces SSR element', () => {
      const { body } = document;
      body.appendChild(document.createElement('div'));

      render(1, body);

      const firstChild = body.firstChild!;
      expectTextNode(firstChild, '1');
      expect(firstChild.nextSibling).toBe(null);
    });

    it('replaces SSR text', () => {
      const { body } = document;
      const ssr = body.appendChild(document.createTextNode('before'));

      render(1, body);

      const firstChild = body.firstChild!;
      expectTextNode(firstChild, '1');
      expect(firstChild.nextSibling).toBe(null);
      expect(firstChild).not.toBe(ssr);
    });

    it('removes rendered element', () => {
      const { body } = document;
      render(createElement('div'), body);

      render(1, body);

      const firstChild = body.firstChild!;
      expectTextNode(firstChild, '1');
      expect(firstChild.nextSibling).toBe(null);
    });

    it('updates rendered text', () => {
      const { body } = document;
      render('before', body);
      const rendered = body.firstChild!;

      render(1, body);

      const firstChild = body.firstChild!;
      expectTextNode(firstChild, '1');
      expect(firstChild.nextSibling).toBe(null);
      expect(firstChild).not.toBe(rendered);
    });
  });

  describe('rendering string', () => {
    it('renders value', () => {
      const { body } = document;
      render('hello', body);

      expectTextNode(body.firstChild!, 'hello');
    });

    it('replaces SSR element', () => {
      const { body } = document;
      body.appendChild(document.createElement('div'));

      render('hello', body);

      const firstChild = body.firstChild!;
      expectTextNode(firstChild, 'hello');
      expect(firstChild.nextSibling).toBe(null);
    });

    it('replaces SSR text', () => {
      const { body } = document;
      const ssr = body.appendChild(document.createTextNode('before'));

      render('hello', body);

      const firstChild = body.firstChild!;
      expectTextNode(firstChild, 'hello');
      expect(firstChild.nextSibling).toBe(null);
      expect(firstChild).not.toBe(ssr);
    });

    it('removes rendered element', () => {
      const { body } = document;
      render(createElement('div'), body);

      render('hello', body);

      const firstChild = body.firstChild!;
      expectTextNode(firstChild, 'hello');
      expect(firstChild.nextSibling).toBe(null);
    });

    it('updates rendered text', () => {
      const { body } = document;
      render('before', body);
      const rendered = body.firstChild!;

      render('hello', body);

      const firstChild = body.firstChild!;
      expectTextNode(firstChild, 'hello');
      expect(firstChild.nextSibling).toBe(null);
      expect(firstChild).not.toBe(rendered);
    });
  });
});

import type { Renderable } from '../../src/render';

import { Component, createElement } from '../../src/jsx2';
import { createTree } from '../../src/diff/create-tree';
import { coerceRenderable } from '../../src/util/coerce-renderable';

describe('createTree', () => {
  function expectTextNode(node: Node, text: string) {
    expect(node).toBeTruthy();
    expect(node.nodeType).toBe(Node.TEXT_NODE);
    expect(node.textContent).toBe(text);
  }

  function expectElement(node: Node, tag: string, namespace = 'http://www.w3.org/1999/xhtml') {
    expect(node).toBeTruthy();
    expect(node.nodeType).toBe(Node.ELEMENT_NODE);
    expect((node as Element).localName).toBe(tag);
    expect(node.namespaceURI).toBe(namespace);
  }

  function create(renderable: Renderable, container: Node) {
    createTree(coerceRenderable(renderable), container, false);
  }

  describe('rendering null', () => {
    it('renders nothing', () => {
      const body = document.createElement('body');

      create(null, body);

      expect(body.firstChild).toBe(null);
    });
  });

  describe('rendering undefined', () => {
    it('renders nothing', () => {
      const body = document.createElement('body');

      create(undefined, body);

      expect(body.firstChild).toBe(null);
    });
  });

  describe('rendering boolean', () => {
    it('renders nothing', () => {
      const body = document.createElement('body');

      create(true, body);

      expect(body.firstChild).toBe(null);
    });
  });

  describe('rendering number', () => {
    it('renders value', () => {
      const body = document.createElement('body');

      create(1, body);

      expectTextNode(body.firstChild!, '1');
      expect(body.firstChild).toBe(body.lastChild);
    });
  });

  describe('rendering string', () => {
    it('renders value', () => {
      const body = document.createElement('body');

      create('hello', body);

      expectTextNode(body.firstChild!, 'hello');
      expect(body.firstChild).toBe(body.lastChild);
    });
  });

  describe('rendering array', () => {
    it('renders single child', () => {
      const body = document.createElement('body');

      create(['text'], body);

      expectTextNode(body.firstChild!, 'text');
      expect(body.firstChild).toBe(body.lastChild);
    });

    it('renders multiple children', () => {
      const body = document.createElement('body');

      create(['text', 0], body);

      expectTextNode(body.firstChild!, 'text');
      expectTextNode(body.lastChild!, '0');
      expect(body.firstChild!.nextSibling).toBe(body.lastChild);
    });

    it('skips nullish children', () => {
      const body = document.createElement('body');

      create(['text', true, 0], body);

      expectTextNode(body.firstChild!, 'text');
      expectTextNode(body.lastChild!, '0');
      expect(body.firstChild!.nextSibling).toBe(body.lastChild);
    });

    describe('namespace', () => {
      it('preserves HTML namespace in children', () => {
        const body = document.createElement('body');

        create([createElement('div')], body);

        const firstChild = body.firstChild!;
        expectElement(firstChild, 'div', 'http://www.w3.org/1999/xhtml');
      });

      it('preserves SVG namespace in children', () => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        create([createElement('circle')], svg);

        const firstChild = svg.firstChild!;
        expectElement(firstChild, 'circle', 'http://www.w3.org/2000/svg');
      });

      it('preserves HTML namespace in children of foreignObject', () => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const container = svg.appendChild(
          document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject'),
        );

        create([createElement('div')], container);

        const firstChild = container.firstChild!;
        expectElement(firstChild, 'div', 'http://www.w3.org/1999/xhtml');
      });
    });
  });

  describe('rendering element', () => {
    it('renders element', () => {
      const body = document.createElement('body');

      create(createElement('div'), body);

      const firstChild = body.firstChild!;
      expectElement(firstChild, 'div');
      expect(firstChild.namespaceURI).toBe('http://www.w3.org/1999/xhtml');
    });

    it('renders props', () => {
      const body = document.createElement('body');

      create(createElement('div', { id: 'id' }), body);

      const firstChild = body.firstChild!;
      expectElement(firstChild, 'div');
      expect((firstChild as Element).getAttribute('id')).toBe('id');
    });

    it('renders children', () => {
      const body = document.createElement('body');

      create(createElement('div', null, 'text'), body);

      expectTextNode(body.firstChild!.firstChild!, 'text');
    });

    it('collects ref on element', () => {
      const body = document.createElement('body');
      const ref = jest.fn();

      create(createElement('div', { ref }, 'text'), body);

      expect(ref).toHaveBeenCalledTimes(1);
      expect(ref).toHaveBeenCalledWith(body.firstChild);
    });

    it('collects ref after with initialized element', () => {
      const body = document.createElement('body');
      const ref = jest.fn((el: Element) => {
        expect(el.id).toBe('id');
        expectTextNode(el.firstChild!, 'text');
        expect(body.contains(el)).toBe(true);
      });

      create(createElement('div', { id: 'id', ref }, 'text'), body);

      expect(ref).toHaveBeenCalled();
    });

    it('collects ref after nested children refs', () => {
      const body = document.createElement('body');
      const nested = jest.fn();
      const ref = jest.fn(() => {
        expect(nested).toHaveBeenCalled();
      });

      create(
        coerceRenderable(
          createElement('div', { id: 'id', ref }, createElement('nested', { ref: nested })),
        ),
        body,
      );

      expect(ref).toHaveBeenCalled();
    });

    describe('namespace', () => {
      it('preserves HTML namespace in children', () => {
        const body = document.createElement('body');

        create(createElement('div', null, createElement('div')), body);

        const firstChild = body.firstChild!;
        expectElement(firstChild, 'div', 'http://www.w3.org/1999/xhtml');
        const grandChild = firstChild.firstChild!;
        expectElement(grandChild, 'div', 'http://www.w3.org/1999/xhtml');
      });

      it('preserves SVG namespace in children', () => {
        const body = document.createElement('body');

        create(createElement('svg', null, createElement('circle')), body);

        const firstChild = body.firstChild!;
        expectElement(firstChild, 'svg', 'http://www.w3.org/2000/svg');
        const grandChild = firstChild.firstChild!;
        expectElement(grandChild, 'circle', 'http://www.w3.org/2000/svg');
      });

      it('switches from SVG namespace to HTML namespace inside foreignObject', () => {
        const body = document.createElement('body');

        create(
          createElement('svg', null, createElement('foreignObject', null, createElement('div'))),
          body,
        );

        const firstChild = body.firstChild!;
        expectElement(firstChild, 'svg', 'http://www.w3.org/2000/svg');
        const grandChild = firstChild.firstChild!;
        expectElement(grandChild, 'foreignObject', 'http://www.w3.org/2000/svg');
        const greatGrandchild = grandChild.firstChild!;
        expectElement(greatGrandchild, 'div', 'http://www.w3.org/1999/xhtml');
      });
    });
  });

  describe('rendering function component', () => {
    it('renders return value', () => {
      const body = document.createElement('body');
      const C = () => {
        return 'hello';
      };
      create(createElement(C, null), body);

      expectTextNode(body.firstChild!, 'hello');
      expect(body.firstChild).toBe(body.lastChild);
    });

    it('passes props to compoment', () => {
      const body = document.createElement('body');
      const C = (props: any) => {
        return props.test;
      };
      create(createElement(C, { test: 'test' }), body);

      expectTextNode(body.firstChild!, 'test');
      expect(body.firstChild).toBe(body.lastChild);
    });

    describe('namespace', () => {
      it('preserves HTML namespace in children', () => {
        const body = document.createElement('body');
        const C = (props: any) => {
          return props.test;
        };

        create(
          createElement(C, {
            test: createElement('div'),
          }),
          body,
        );

        const firstChild = body.firstChild!;
        expectElement(firstChild, 'div', 'http://www.w3.org/1999/xhtml');
      });

      it('preserves SVG namespace in children', () => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const C = (props: any) => {
          return props.test;
        };

        create(
          createElement(C, {
            test: createElement('circle'),
          }),
          svg,
        );

        const firstChild = svg.firstChild!;
        expectElement(firstChild, 'circle', 'http://www.w3.org/2000/svg');
      });

      it('preserves HTML namespace in children of foreignObject', () => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const container = svg.appendChild(
          document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject'),
        );
        const C = (props: any) => {
          return props.test;
        };

        create(
          createElement(C, {
            test: createElement('div'),
          }),
          container,
        );

        const firstChild = container.firstChild!;
        expectElement(firstChild, 'div', 'http://www.w3.org/1999/xhtml');
      });
    });
  });

  describe('rendering class component', () => {
    class C extends Component {
      render() {
        return 'hello';
      }
    }

    it('renders return value', () => {
      const body = document.createElement('body');
      create(createElement(C, null), body);

      expectTextNode(body.firstChild!, 'hello');
      expect(body.firstChild).toBe(body.lastChild);
    });

    it('passes props to compoment', () => {
      const body = document.createElement('body');
      class C extends Component {
        render(props: any) {
          return props.test;
        }
      }
      create(createElement(C, { test: 'test' }), body);

      expectTextNode(body.firstChild!, 'test');
      expect(body.firstChild).toBe(body.lastChild);
    });

    it('collects ref on component', () => {
      const body = document.createElement('body');
      const ref = jest.fn();

      create(createElement(C, { ref }), body);

      expect(ref).toHaveBeenCalledTimes(1);
      expect(ref).toHaveBeenCalledWith(expect.any(C));
    });

    it('collects ref after rendering component', () => {
      const body = document.createElement('body');
      const nested = jest.fn();
      const ref = jest.fn(() => {
        expect(nested).toHaveBeenCalled();
        expect(body.querySelector('div')).not.toBe(null);
      });
      class C extends Component {
        render() {
          return createElement('div', { ref: nested });
        }
      }

      create(createElement(C, { ref }), body);

      expect(ref).toHaveBeenCalled();
    });

    describe('namespace', () => {
      it('preserves HTML namespace in children', () => {
        const body = document.createElement('body');
        class C extends Component {
          render(props: any) {
            return props.test;
          }
        }

        create(
          createElement(C, {
            test: createElement('div'),
          }),
          body,
        );

        const firstChild = body.firstChild!;
        expectElement(firstChild, 'div', 'http://www.w3.org/1999/xhtml');
      });

      it('preserves SVG namespace in children', () => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        class C extends Component {
          render(props: any) {
            return props.test;
          }
        }

        create(
          createElement(C, {
            test: createElement('circle'),
          }),
          svg,
        );

        const firstChild = svg.firstChild!;
        expectElement(firstChild, 'circle', 'http://www.w3.org/2000/svg');
      });

      it('preserves HTML namespace in children of foreignObject', () => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const container = svg.appendChild(
          document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject'),
        );
        class C extends Component {
          render(props: any) {
            return props.test;
          }
        }

        create(
          createElement(C, {
            test: createElement('div'),
          }),
          container,
        );

        const firstChild = container.firstChild!;
        expectElement(firstChild, 'div', 'http://www.w3.org/1999/xhtml');
      });
    });
  });
});

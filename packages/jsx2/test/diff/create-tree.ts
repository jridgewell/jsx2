type Renderable = import('../../src/render').Renderable;
type FunctionComponentVNode = import('../../src/create-element').FunctionComponentVNode;

import { createElement, Component, Fragment } from '../../src/jsx2';
import { createTree } from '../../src/diff/create-tree';

describe('createTree', () => {
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

  function data(renderable: Renderable): FunctionComponentVNode {
    return createElement(Fragment, null, renderable);
  }

  describe('rendering null', () => {
    it('renders nothing', () => {
      const body = document.createElement('body');
      createTree(data(null), body);

      expect(body.firstChild).toBe(null);
    });
  });

  describe('rendering undefined', () => {
    it('renders nothing', () => {
      const body = document.createElement('body');
      createTree(data(undefined), body);

      expect(body.firstChild).toBe(null);
    });
  });

  describe('rendering boolean', () => {
    it('renders nothing', () => {
      const body = document.createElement('body');
      createTree(data(true), body);

      expect(body.firstChild).toBe(null);
    });
  });

  describe('rendering number', () => {
    it('renders value', () => {
      const body = document.createElement('body');
      createTree(data(1), body);

      expectTextNode(body.firstChild!, '1');
      expect(body.firstChild).toBe(body.lastChild);
    });
  });

  describe('rendering string', () => {
    it('renders value', () => {
      const body = document.createElement('body');
      createTree(data('hello'), body);

      expectTextNode(body.firstChild!, 'hello');
      expect(body.firstChild).toBe(body.lastChild);
    });
  });

  describe('rendering array', () => {
    it('renders single child', () => {
      const body = document.createElement('body');

      createTree(data(['text']), body);

      expectTextNode(body.firstChild!, 'text');
      expect(body.firstChild).toBe(body.lastChild);
    });

    it('renders multiple children', () => {
      const body = document.createElement('body');

      createTree(data(['text', 0]), body);

      expectTextNode(body.firstChild!, 'text');
      expectTextNode(body.lastChild!, '0');
      expect(body.firstChild!.nextSibling).toBe(body.lastChild);
    });

    it('skips nullish children', () => {
      const body = document.createElement('body');

      createTree(data(['text', true, 0]), body);

      expectTextNode(body.firstChild!, 'text');
      expectTextNode(body.lastChild!, '0');
      expect(body.firstChild!.nextSibling).toBe(body.lastChild);
    });
  });

  describe('rendering element', () => {
    it('renders element', () => {
      const body = document.createElement('body');

      createTree(data(createElement('div')), body);

      expectElement(body.firstChild!, 'div');
    });

    it('renders props', () => {
      const body = document.createElement('body');

      createTree(data(createElement('div', { id: 'id' })), body);

      const firstChild = body.firstChild!;
      expectElement(firstChild, 'div');
      expect((firstChild as Element).getAttribute('id')).toBe('id');
    });

    it('renders children', () => {
      const body = document.createElement('body');

      createTree(data(createElement('div', null, 'text')), body);

      expectTextNode(body.firstChild!.firstChild!, 'text');
    });

    it('sets ref on element', () => {
      const body = document.createElement('body');
      const ref = jest.fn();

      createTree(data(createElement('div', { ref }, 'text')), body);

      expect(ref).toHaveBeenCalledTimes(1);
      expect(ref).toHaveBeenCalledWith(body.firstChild);
    });

    it('sets ref after initializing element', () => {
      const body = document.createElement('body');
      const ref = (el: Element) => {
        expect(el.id).toBe('id');
        // TODO: Ref should diff after full mount.
        // expectTextNode(el.firstChild!, 'text');
      };

      createTree(data(createElement('div', { id: 'id', ref }, 'text')), body);
    });

    it('sets ref after nested children refs', () => {
      const body = document.createElement('body');
      const nested = jest.fn();
      const ref = () => {
        expect(nested).toHaveBeenCalled();
      };

      createTree(
        data(createElement('div', { id: 'id', ref }, createElement('nested', { ref: nested }))),
        body,
      );
    });
  });

  describe('rendering function component', () => {
    it('renders return value', () => {
      const body = document.createElement('body');
      const C = () => {
        return 'hello';
      };
      createTree(data(createElement(C, null)), body);

      const lastChild = body.lastChild!;
      expectTextNode(lastChild, 'hello');
      expect(lastChild.nextSibling).toBe(null);
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
      createTree(data(createElement(C, null)), body);

      const lastChild = body.lastChild!;
      expectTextNode(lastChild, 'hello');
      expect(lastChild.nextSibling).toBe(null);
    });

    it('sets ref on component', () => {
      const body = document.createElement('body');
      const ref = jest.fn();

      createTree(data(createElement(C, { ref })), body);

      expect(ref).toHaveBeenCalledTimes(1);
      expect(ref).toHaveBeenCalledWith(expect.any(C));
    });

    it('sets ref after rendering component', () => {
      const body = document.createElement('body');
      const nested = jest.fn();
      const ref = () => {
        expect(nested).toHaveBeenCalled();
      };
      class C extends Component {
        render() {
          return createElement('div', { ref: nested });
        }
      }

      createTree(data(createElement(C, { ref })), body);
    });
  });
});

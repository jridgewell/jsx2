type Renderable = import('../../src/render').Renderable;
type FunctionComponentVNode = import('../../src/create-element').FunctionComponentVNode;
type RefWork = import('../../src/diff/ref').RefWork;

import { createElement, Component, Fragment } from '../../src/jsx2';
import { createTree } from '../../src/diff/create-tree';
import { applyRefs } from '../../src/diff/ref';

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
      createTree(data(null), body, []);

      expect(body.firstChild).toBe(null);
    });
  });

  describe('rendering undefined', () => {
    it('renders nothing', () => {
      const body = document.createElement('body');
      createTree(data(undefined), body, []);

      expect(body.firstChild).toBe(null);
    });
  });

  describe('rendering boolean', () => {
    it('renders nothing', () => {
      const body = document.createElement('body');
      createTree(data(true), body, []);

      expect(body.firstChild).toBe(null);
    });
  });

  describe('rendering number', () => {
    it('renders value', () => {
      const body = document.createElement('body');
      createTree(data(1), body, []);

      expectTextNode(body.firstChild!, '1');
      expect(body.firstChild).toBe(body.lastChild);
    });
  });

  describe('rendering string', () => {
    it('renders value', () => {
      const body = document.createElement('body');
      createTree(data('hello'), body, []);

      expectTextNode(body.firstChild!, 'hello');
      expect(body.firstChild).toBe(body.lastChild);
    });
  });

  describe('rendering array', () => {
    it('renders single child', () => {
      const body = document.createElement('body');

      createTree(data(['text']), body, []);

      expectTextNode(body.firstChild!, 'text');
      expect(body.firstChild).toBe(body.lastChild);
    });

    it('renders multiple children', () => {
      const body = document.createElement('body');

      createTree(data(['text', 0]), body, []);

      expectTextNode(body.firstChild!, 'text');
      expectTextNode(body.lastChild!, '0');
      expect(body.firstChild!.nextSibling).toBe(body.lastChild);
    });

    it('skips nullish children', () => {
      const body = document.createElement('body');

      createTree(data(['text', true, 0]), body, []);

      expectTextNode(body.firstChild!, 'text');
      expectTextNode(body.lastChild!, '0');
      expect(body.firstChild!.nextSibling).toBe(body.lastChild);
    });
  });

  describe('rendering element', () => {
    it('renders element', () => {
      const body = document.createElement('body');

      createTree(data(createElement('div')), body, []);

      expectElement(body.firstChild!, 'div');
    });

    it('renders props', () => {
      const body = document.createElement('body');

      createTree(data(createElement('div', { id: 'id' })), body, []);

      const firstChild = body.firstChild!;
      expectElement(firstChild, 'div');
      expect((firstChild as Element).getAttribute('id')).toBe('id');
    });

    it('renders children', () => {
      const body = document.createElement('body');

      createTree(data(createElement('div', null, 'text')), body, []);

      expectTextNode(body.firstChild!.firstChild!, 'text');
    });

    it('collects ref on element', () => {
      const body = document.createElement('body');
      const ref = jest.fn();

      const refs: RefWork[] = [];
      createTree(data(createElement('div', { ref }, 'text')), body, refs);
      applyRefs(refs);

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

      const refs: RefWork[] = [];
      createTree(data(createElement('div', { id: 'id', ref }, 'text')), body, refs);
      applyRefs(refs);

      expect(ref).toHaveBeenCalled();
    });

    it('collects ref after nested children refs', () => {
      const body = document.createElement('body');
      const nested = jest.fn();
      const ref = jest.fn(() => {
        expect(nested).toHaveBeenCalled();
      });

      const refs: RefWork[] = [];
      createTree(
        data(createElement('div', { id: 'id', ref }, createElement('nested', { ref: nested }))),
        body,
        refs,
      );
      applyRefs(refs);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('rendering function component', () => {
    it('renders return value', () => {
      const body = document.createElement('body');
      const C = () => {
        return 'hello';
      };
      createTree(data(createElement(C, null)), body, []);

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
      createTree(data(createElement(C, null)), body, []);

      const lastChild = body.lastChild!;
      expectTextNode(lastChild, 'hello');
      expect(lastChild.nextSibling).toBe(null);
    });

    it('collects ref on component', () => {
      const body = document.createElement('body');
      const ref = jest.fn();

      const refs: RefWork[] = [];
      createTree(data(createElement(C, { ref })), body, refs);
      applyRefs(refs);

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

      const refs: RefWork[] = [];
      createTree(data(createElement(C, { ref })), body, refs);
      applyRefs(refs);

      expect(ref).toHaveBeenCalled();
    });
  });
});

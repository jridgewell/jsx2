import type {
  ClassComponentVNode,
  ElementVNode,
  FunctionComponentVNode,
} from '../../src/create-element';
import type { Fiber, FunctionComponentFiber, RootFiber } from '../../src/fiber';
import type { Renderable, RenderableArray } from '../../src/render';
import type { SignalContext } from '../../src/signals';
import type { CoercedRenderable } from '../../src/util/coerce-renderable';

import { Component, createElement, useLayoutEffect } from '../../src/jsx2';
import { SignalContextType, getCurrentContext, notifyDependents } from '../../src/signals';
import { createRoot } from '../../src/diff/create-tree';
import { diffTree, rediffComponent } from '../../src/diff/diff-tree';
import { coerceRenderable } from '../../src/util/coerce-renderable';

function makeTree(renderable: Renderable, container: Node) {
  return createRoot(coerceRenderable(renderable), container);
}

function expectTextNode(node: Node, text: string) {
  expect(node).toBeTruthy();
  expect(node.nodeType).toBe(Node.TEXT_NODE);
  expect(node.textContent).toBe(text);
}

function createChildSignalTrack<T>(initialValue: T) {
  const context: SignalContext = {
    type: SignalContextType.SIGNAL,
    dependents: new Set(),
    dependencies: new Set(),
  };
  let value = initialValue;
  const signal = jest.fn(() => {
    const current = getCurrentContext();
    if (current) {
      current.dependencies.add(context);
      context.dependents.add(current);
    }
    return value;
  });
  const setSignal = (v: T) => {
    value = v;
    notifyDependents(context.dependents);
  };
  return [signal, setSignal] as const;
}

describe('diffTree', () => {
  function expectElement(
    node: Node,
    tag: string,
    namespace = 'http://www.w3.org/1999/xhtml',
  ): asserts node is Element {
    expect(node).toBeTruthy();
    expect(node.nodeType).toBe(Node.ELEMENT_NODE);
    expect((node as Element).localName).toBe(tag);
    expect((node as Element).namespaceURI).toBe(namespace);
  }

  function diff(old: RootFiber, renderable: CoercedRenderable, container: Node) {
    diffTree(old, coerceRenderable(renderable), container);
  }

  function expectShallowEqual<T, U>(actual: T[], expected: U[]) {
    expect(actual).toHaveLength(expected.length);
    for (let i = 0; i < actual.length; i++) {
      expect(actual[i]).toBe(expected[i]);
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  function spyOn<T extends {}, M extends jest.FunctionPropertyNames<Required<T>>>(
    obj: T,
    method: M,
    spy: (...args: jest.ArgsType<Required<T>[M]>) => void,
  ) {
    const original = obj[method] as unknown as (...args: jest.ArgsType<Required<T>[M]>) => any;
    jest.spyOn(obj, method).mockImplementation((...args) => {
      spy(...args);
      return original.apply(obj, args);
    });
  }

  type Mutations = { added: Node[]; removed: Node[] };
  function listenForChildMutations(container: Node): Mutations {
    const added: Node[] = [];
    const removed: Node[] = [];

    jest.spyOn(container, 'appendChild');

    spyOn(container, 'appendChild', (child: Node) => {
      if (child.parentNode === container) removed.push(child);
      added.push(child);
    });
    spyOn(container, 'insertBefore', (child: Node) => {
      if (child.parentNode === container) removed.push(child);
      added.push(child);
    });
    spyOn(container, 'removeChild', (child: Node) => {
      removed.push(child);
    });
    spyOn(container, 'replaceChild', (child: Node, oldChild: Node) => {
      if (child.parentNode === container) removed.push(child);
      added.push(child);
      removed.push(oldChild);
    });

    return { added, removed };
  }

  describe('rendered null', () => {
    function makeOldFiberTree(container: Node) {
      return makeTree(null, container);
    }

    describe('rendering null', () => {
      it('does nothing', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = null;

        diff(tree, renderable, container);

        expect(container.firstChild).toBe(null);
      });
    });

    describe('rendering string', () => {
      it('renders text node', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = 'test';

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expect(container.firstChild).toBe(container.lastChild);
      });
    });

    describe('rendering element', () => {
      it('renders element', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = createElement('div');

        diff(tree, renderable, container);

        expectElement(container.firstChild!, 'div');
        expect(container.firstChild).toBe(container.lastChild);
      });

      describe('namespace', () => {
        it('preserves HTML namespace in children', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(container);
          const renderable = createElement('div');

          diff(tree, renderable, container);

          expectElement(container.firstChild!, 'div', 'http://www.w3.org/1999/xhtml');
        });

        it('preserves SVG namespace in children', () => {
          const container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          const tree = makeOldFiberTree(container);
          const renderable = createElement('circle');

          diff(tree, renderable, container);

          expectElement(container.firstChild!, 'circle', 'http://www.w3.org/2000/svg');
        });

        it('preserves HTML namespace in children of foreignObject', () => {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          const container = svg.appendChild(
            document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject'),
          );
          const tree = makeOldFiberTree(container);
          const renderable = createElement('div');

          diff(tree, renderable, container);

          expectElement(container.firstChild!, 'div', 'http://www.w3.org/1999/xhtml');
        });
      });
    });

    describe('rendering function component', () => {
      it("renders component's return value", () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = createElement(() => 'test');

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expect(container.firstChild).toBe(container.lastChild);
      });
    });

    describe('rendering class component', () => {
      it("renders component's return value", () => {
        class C extends Component {
          render() {
            return 'test';
          }
        }
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = createElement(C);

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expect(container.firstChild).toBe(container.lastChild);
      });
    });

    describe('rendering array', () => {
      it("renders array's items", () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = ['test', createElement('div')];

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expectElement(container.lastChild!, 'div');
        expect(container.firstChild!.nextSibling).toBe(container.lastChild);
      });
    });

    describe('rendering signal', () => {
      it('renders signal text', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const [signal] = createChildSignalTrack('test');

        diff(tree, signal, container);

        expectTextNode(container.firstChild!, 'test');
      });
    });
  });

  describe('rendered string', () => {
    function makeOldFiberTree(old: string, container: Node) {
      return makeTree(old, container);
    }

    describe('rendering null', () => {
      it('removes text node', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree('before', container);
        const renderable = null;

        diff(tree, renderable, container);

        expect(container.firstChild).toBe(null);
      });
    });

    describe('rendering string', () => {
      it('updates rendered text node', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree('before', container);
        const renderable = 'test';
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).toBe(old);
        expect(container.lastChild).toBe(old);
        expectTextNode(old, 'test');
      });
    });

    describe('rendering element', () => {
      it('replaces text node with element', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree('before', container);
        const renderable = createElement('div');

        diff(tree, renderable, container);

        expectElement(container.firstChild!, 'div');
        expect(container.firstChild).toBe(container.lastChild);
      });

      describe('namespace', () => {
        it('preserves HTML namespace in children', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree('before', container);
          const renderable = createElement('div');

          diff(tree, renderable, container);

          expectElement(container.firstChild!, 'div', 'http://www.w3.org/1999/xhtml');
        });

        it('preserves SVG namespace in children', () => {
          const container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          const tree = makeOldFiberTree('before', container);
          const renderable = createElement('circle');

          diff(tree, renderable, container);

          expectElement(container.firstChild!, 'circle', 'http://www.w3.org/2000/svg');
        });

        it('preserves HTML namespace in children of foreignObject', () => {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          const container = svg.appendChild(
            document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject'),
          );
          const tree = makeOldFiberTree('before', container);
          const renderable = createElement('div');

          diff(tree, renderable, container);

          expectElement(container.firstChild!, 'div', 'http://www.w3.org/1999/xhtml');
        });
      });
    });

    describe('rendering function component', () => {
      it("renders component's return value", () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree('before', container);
        const renderable = createElement(() => 'test');

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expect(container.firstChild).toBe(container.lastChild);
      });

      it('does not reuse text node', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree('before', container);
        const renderable = createElement(() => 'test');
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
      });
    });

    describe('rendering class component', () => {
      it("renders component's return value", () => {
        class C extends Component {
          render() {
            return 'test';
          }
        }
        const container = document.createElement('body');
        const tree = makeOldFiberTree('before', container);
        const renderable = createElement(C);

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expect(container.firstChild).toBe(container.lastChild);
      });

      it('does not reuse text node', () => {
        class C extends Component {
          render() {
            return 'test';
          }
        }
        const container = document.createElement('body');
        const tree = makeOldFiberTree('before', container);
        const renderable = createElement(C);
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
      });
    });

    describe('rendering array', () => {
      it("renders array's items", () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree('before', container);
        const renderable = ['test', createElement('div')];

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expectElement(container.lastChild!, 'div');
        expect(container.firstChild!.nextSibling).toBe(container.lastChild);
      });

      it('does not reuse text node', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree('before', container);
        const renderable = ['test'];
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
      });
    });

    describe('rendering signal', () => {
      it('renders signal text', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree('before', container);
        const [signal] = createChildSignalTrack('test');

        diff(tree, signal, container);

        expectTextNode(container.firstChild!, 'test');
      });
    });
  });

  describe('rendered signal', () => {
    function makeOldFiberTree(container: Node) {
      const signal = () => 'before';
      return makeTree(signal, container);
    }

    describe('rendering null', () => {
      it('removes tree', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = null;

        diff(tree, renderable, container);

        expect(container.firstChild).toBe(null);
      });

      it('cleans up context when unmounting', () => {
        const container = document.createElement('body');
        const [signal, setSignal] = createChildSignalTrack('test');
        const tree = makeTree(signal, container);
        const node = container.firstChild!;

        setSignal('after');
        expectTextNode(node, 'after');

        diff(tree, null, container);
        setSignal('ignored');

        expect(container.firstChild).toBe(null);
        expect(node.textContent).toBe('after');
      });
    });

    describe('rendering string', () => {
      it('replaces signal with text', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = 'after';

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'after');
      });

      it('cleans up context when replaced by string', () => {
        const container = document.createElement('body');
        const [signal, setSignal] = createChildSignalTrack('test');
        const tree = makeTree(signal, container);
        const node = container.firstChild!;

        setSignal('after');
        expectTextNode(node, 'after');

        diff(tree, 'new-string', container);
        setSignal('ignored');

        expectTextNode(container.firstChild!, 'new-string');
        expect(node.textContent).toBe('after');
      });
    });

    describe('rendering element', () => {
      it('replaces signal with element', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = createElement('div');

        diff(tree, renderable, container);

        expectElement(container.firstChild!, 'div');
      });

      it('cleans up context when replaced by element', () => {
        const container = document.createElement('body');
        const [signal, setSignal] = createChildSignalTrack('test');
        const tree = makeTree(signal, container);
        const node = container.firstChild!;

        setSignal('after');
        expectTextNode(node, 'after');

        diff(tree, createElement('div'), container);
        setSignal('ignored');

        expectElement(container.firstChild!, 'div');
        expect(node.textContent).toBe('after');
      });
    });

    describe('rendering signal', () => {
      it('updates signal getter', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = () => 'after';

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'after');
      });

      it('cleans up context when replaced by signal', () => {
        const container = document.createElement('body');
        const [signal1, setSignal1] = createChildSignalTrack('test1');
        const tree = makeTree(signal1, container);
        const node = container.firstChild!;

        setSignal1('after1');
        expectTextNode(node, 'after1');

        const [signal2] = createChildSignalTrack('test2');
        diff(tree, signal2, container);

        expectTextNode(container.firstChild!, 'test2');
        expect(node).toBe(container.firstChild!); // Verify it was reused!

        setSignal1('ignored');

        expect(node.textContent).toBe('test2');
      });

      it('renders number as string', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = () => 123;

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, '123');
      });

      it('renders boolean as nothing', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = () => true;

        diff(tree, renderable, container);

        expect(container.firstChild).toBe(null);
      });

      it('renders null as nothing', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = () => null;

        diff(tree, renderable, container);

        expect(container.firstChild).toBe(null);
      });

      it('renders element from signal', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = () => createElement('div');

        diff(tree, renderable, container);

        expectElement(container.firstChild!, 'div');
      });

      it('renders array from signal', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = () => ['a', 'b'];

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'a');
        expectTextNode(container.lastChild!, 'b');
      });

      it('renders nested signal', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = () => () => 'nested';

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'nested');
      });
    });

    describe('updating signal value', () => {
      it('updates number as string', () => {
        const container = document.createElement('body');
        const [signal, setSignal] = createChildSignalTrack<any>('before');
        makeTree(signal, container);

        expectTextNode(container.firstChild!, 'before');

        setSignal(123);

        expectTextNode(container.firstChild!, '123');
      });

      it('updates text as text', () => {
        const container = document.createElement('body');
        const [signal, setSignal] = createChildSignalTrack<any>('before');
        makeTree(signal, container);

        expectTextNode(container.firstChild!, 'before');

        setSignal('after');

        expectTextNode(container.firstChild!, 'after');
      });

      it('updates boolean as nothing', () => {
        const container = document.createElement('body');
        const [signal, setSignal] = createChildSignalTrack<any>('before');
        makeTree(signal, container);

        expectTextNode(container.firstChild!, 'before');

        setSignal(true);

        expect(container.firstChild).toBe(null);
      });

      it('updates null as nothing', () => {
        const container = document.createElement('body');
        const [signal, setSignal] = createChildSignalTrack<any>('before');
        makeTree(signal, container);

        expectTextNode(container.firstChild!, 'before');

        setSignal(null);

        expect(container.firstChild).toBe(null);
      });

      it('updates element from signal', () => {
        const container = document.createElement('body');
        const [signal, setSignal] = createChildSignalTrack<any>('before');
        makeTree(signal, container);

        expectTextNode(container.firstChild!, 'before');

        setSignal(createElement('div'));

        expectElement(container.firstChild!, 'div');
      });

      it('updates array from signal', () => {
        const container = document.createElement('body');
        const [signal, setSignal] = createChildSignalTrack<any>('before');
        makeTree(signal, container);

        expectTextNode(container.firstChild!, 'before');

        setSignal(['a', 'b']);

        expectTextNode(container.firstChild!, 'a');
        expectTextNode(container.lastChild!, 'b');
      });

      it('updates nested signal', () => {
        const container = document.createElement('body');
        const [signal1, setSignal1] = createChildSignalTrack<any>('before');
        const [signal2, setSignal2] = createChildSignalTrack<any>('nested');
        makeTree(signal1, container);

        expectTextNode(container.firstChild!, 'before');

        setSignal1(signal2);
        expectTextNode(container.firstChild!, 'nested');

        setSignal2('after');
        expectTextNode(container.firstChild!, 'after');
      });

      it('cleans up nested context when replaced', () => {
        const container = document.createElement('body');
        const [signal2, setSignal2] = createChildSignalTrack<any>('nested');
        const [signal1, setSignal1] = createChildSignalTrack<any>(signal2);
        makeTree(signal1, container);
        const node = container.firstChild!;

        expectTextNode(node, 'nested');

        setSignal1('after');
        setSignal2('ignored');

        expectTextNode(container.firstChild!, 'after');
        expect(node.textContent).toBe('nested');
      });
    });

    describe('rendering component', () => {
      it('replaces signal with component', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const C = () => 'test';
        const renderable = createElement(C);

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
      });

      it('cleans up context when replaced by component', () => {
        const container = document.createElement('body');
        const [signal, setSignal] = createChildSignalTrack('test');
        const tree = makeTree(signal, container);
        const C = () => 'test';
        const renderable = createElement(C);
        const node = container.firstChild!;

        setSignal('after');

        expectTextNode(node, 'after');

        diff(tree, renderable, container);
        setSignal('ignored');

        expectTextNode(container.firstChild!, 'test');
        expect(node.textContent).toBe('after');
      });
    });

    describe('rendering array', () => {
      it('replaces signal with array', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(container);
        const renderable = ['test', createElement('div')];

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expectElement(container.lastChild!, 'div');
      });

      it('cleans up context when replaced by array', () => {
        const container = document.createElement('body');
        const [signal, setSignal] = createChildSignalTrack('test');
        const tree = makeTree(signal, container);
        const renderable = ['after'];
        const node = container.firstChild!;

        setSignal('signal-after');

        expectTextNode(node, 'signal-after');

        diff(tree, renderable, container);
        setSignal('ignored');

        expectTextNode(container.firstChild!, 'after');
        expect(node.textContent).toBe('signal-after');
      });
    });
  });

  describe('rendered element', () => {
    function makeOldFiberTree(old: ElementVNode, container: Node) {
      return makeTree(old, container);
    }

    describe('rendering null', () => {
      it('removes element', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(createElement('before'), container);
        const renderable = null;

        diff(tree, renderable, container);

        expect(container.firstChild).toBe(null);
      });
    });

    describe('rendering string', () => {
      it('replaces element with text node', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(createElement('before'), container);
        const renderable = 'test';

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expect(container.firstChild).toBe(container.lastChild);
      });
    });

    describe('rendering element', () => {
      it('replaces element with element if tagname differs', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(createElement('before'), container);
        const renderable = createElement('div');
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
        expectElement(container.firstChild!, 'div');
        expect(container.firstChild).toBe(container.lastChild);
      });

      it('reuses element if same tagname', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(createElement('div'), container);
        const renderable = createElement('div');
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).toBe(old);
        expect(container.lastChild).toBe(old);
      });

      describe('with refs', () => {
        it('unmounts old ref if changed', () => {
          const container = document.createElement('body');
          const oldRef = jest.fn();
          const ref = jest.fn();
          const tree = makeOldFiberTree(createElement('div', { ref: oldRef }), container);
          const renderable = createElement('div', { ref });

          diff(tree, renderable, container);

          expect(oldRef).toHaveBeenLastCalledWith(null);
        });

        it('mounts new ref if changed', () => {
          const container = document.createElement('body');
          const oldRef = jest.fn();
          const ref = jest.fn();
          const tree = makeOldFiberTree(createElement('div', { ref: oldRef }), container);
          const renderable = createElement('div', { ref });

          diff(tree, renderable, container);

          expect(ref).toHaveBeenLastCalledWith(container.firstChild);
        });

        it('does not remount ref if unchanged', () => {
          const container = document.createElement('body');
          const oldRef = jest.fn();
          const ref = oldRef;
          const tree = makeOldFiberTree(createElement('div', { ref: oldRef }), container);
          const renderable = createElement('div', { ref });
          ref.mockClear();

          diff(tree, renderable, container);

          expect(ref).not.toHaveBeenCalled();
        });

        it('unmounts old ref if element removed', () => {
          const container = document.createElement('body');
          const oldRef = jest.fn();
          const tree = makeOldFiberTree(createElement('div', { ref: oldRef }), container);
          const renderable = null;

          diff(tree, renderable, container);

          expect(oldRef).toHaveBeenLastCalledWith(null);
        });

        it('unmounts old ref if tagname changed', () => {
          const container = document.createElement('body');
          const oldRef = jest.fn();
          const tree = makeOldFiberTree(createElement('div', { ref: oldRef }), container);
          const renderable = createElement('after');

          diff(tree, renderable, container);

          expect(oldRef).toHaveBeenLastCalledWith(null);
        });

        it('unmounts and remounts ref if used on a new element', () => {
          const container = document.createElement('body');
          const oldRef = jest.fn();
          const ref = oldRef;
          const tree = makeOldFiberTree(createElement('div', { ref: oldRef }), container);
          const renderable = createElement('before', { ref });
          ref.mockClear();

          diff(tree, renderable, container);

          expect(ref).toHaveBeenCalledTimes(2);
          expect(ref).toHaveBeenNthCalledWith(1, null);
          expect(ref).toHaveBeenNthCalledWith(2, container.firstChild);
        });
      });

      describe('with props', () => {
        it('updates props', () => {
          const container = document.createElement('body');
          const old = createElement('div', { id: 'before' });
          const tree = makeOldFiberTree(old, container);
          const renderable = createElement('div', { id: 'after' });
          const div = container.firstChild as Element;

          diff(tree, renderable, container);

          expect(container.firstChild).toBe(div);
          expect(div.id).toBe('after');
        });

        it('adds new props', () => {
          const container = document.createElement('body');
          const old = createElement('div', { id: 'before' });
          const tree = makeOldFiberTree(old, container);
          const renderable = createElement('div', { id: 'after', foo: 'bar' });
          const div = container.firstChild as Element;

          diff(tree, renderable, container);

          expect(container.firstChild).toBe(div);
          expect(div.getAttribute('foo')).toBe('bar');
        });

        it('removes old props', () => {
          const container = document.createElement('body');
          const old = createElement('div', { foo: 'before' });
          const tree = makeOldFiberTree(old, container);
          const renderable = createElement('div', {});
          const div = container.firstChild as Element;

          diff(tree, renderable, container);

          expect(container.firstChild).toBe(div);
          expect(div.hasAttribute('foo')).toBe(false);
        });

        it('sets props if tagname differs', () => {
          const container = document.createElement('body');
          const old = createElement('before', { id: 'before' });
          const tree = makeOldFiberTree(old, container);
          const renderable = createElement('div', { foo: 'bar' });
          const div = container.firstChild as Element;

          diff(tree, renderable, container);

          const firstChild = container.firstChild as Element;
          expect(container.firstChild).not.toBe(div);
          expect(firstChild.hasAttribute('id')).toBe(false);
          expect(firstChild.getAttribute('foo')).toBe('bar');
        });

        it('does not unset properties if tagname differs', () => {
          const container = document.createElement('body');
          const old = createElement('before', { id: 'before' });
          const tree = makeOldFiberTree(old, container);
          const renderable = createElement('div', { foo: 'bar' });
          const div = container.firstChild as Element;

          diff(tree, renderable, container);

          expect(container.firstChild).not.toBe(div);
          expect(div.id).toBe('before');
        });
      });

      describe('with children', () => {
        it('updates children', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(createElement('div', null, 'before'), container);
          const renderable = createElement('div', null, 'test');
          const old = container.firstChild!;
          const oldText = old.firstChild!;

          diff(tree, renderable, container);

          expect(container.firstChild).toBe(old);
          expect(container.lastChild).toBe(old);
          expectTextNode(oldText, 'test');
          expect(old.firstChild).toBe(oldText);
          expect(old.lastChild).toBe(oldText);
        });

        it('removes children', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(createElement('div', null, 'before'), container);
          const renderable = createElement('div');
          const old = container.firstChild!;

          diff(tree, renderable, container);

          expect(container.firstChild).toBe(old);
          expect(container.lastChild).toBe(old);
          expect(old.firstChild).toBe(null);
        });

        it('adds children', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(createElement('div'), container);
          const renderable = createElement('div', null, 'test');
          const old = container.firstChild!;

          diff(tree, renderable, container);

          expect(container.firstChild).toBe(old);
          expect(container.lastChild).toBe(old);
          expectTextNode(old.firstChild!, 'test');
          expect(old.firstChild).toBe(old.lastChild);
        });

        it('renders children if tagname differs', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(createElement('before'), container);
          const renderable = createElement('div', null, 'test');
          const old = container.firstChild!;

          diff(tree, renderable, container);

          const firstChild = container.firstChild!;
          expect(firstChild).not.toBe(old);
          expect(container.firstChild).toBe(container.lastChild);
          expectTextNode(firstChild.firstChild!, 'test');
          expect(firstChild.firstChild).toBe(firstChild.lastChild);
        });

        it('does not reuse children if tagname differs', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(createElement('before', null, 'before'), container);
          const renderable = createElement('div', null, 'test');
          const old = container.firstChild!;
          const oldText = old.firstChild;

          diff(tree, renderable, container);

          expect(container.firstChild).not.toBe(old);
          expect(container.firstChild!.firstChild).not.toBe(oldText);
        });
      });

      describe('namespace', () => {
        describe('rendered was HTML namespace', () => {
          it('preserves HTML namespace in children', () => {
            const container = document.createElement('body');
            const tree = makeOldFiberTree(createElement('div'), container);
            const renderable = createElement('a');

            diff(tree, renderable, container);

            expectElement(container.firstChild!, 'a', 'http://www.w3.org/1999/xhtml');
          });

          it('creates SVG namespace', () => {
            const container = document.createElement('body');
            const tree = makeOldFiberTree(createElement('div'), container);
            const renderable = createElement('svg');

            diff(tree, renderable, container);

            expectElement(container.firstChild!, 'svg', 'http://www.w3.org/2000/svg');
          });
        });

        describe('rendered was SVG namespace', () => {
          it('preserves SVG namespace in children', () => {
            const container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const tree = makeOldFiberTree(createElement('circle'), container);
            const renderable = createElement('a');

            diff(tree, renderable, container);

            expectElement(container.firstChild!, 'a', 'http://www.w3.org/2000/svg');
          });
        });

        describe('rendered was inside foreignObject', () => {
          it('preserves HTML namespace in children', () => {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const container = svg.appendChild(
              document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject'),
            );
            const tree = makeOldFiberTree(createElement('div'), container);
            const renderable = createElement('a');

            diff(tree, renderable, container);

            expectElement(container.firstChild!, 'a', 'http://www.w3.org/1999/xhtml');
          });

          it('creates SVG namespace', () => {
            const container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const tree = makeOldFiberTree(createElement('circle'), container);
            const renderable = createElement('svg');

            diff(tree, renderable, container);

            expectElement(container.firstChild!, 'svg', 'http://www.w3.org/2000/svg');
          });
        });
      });
    });

    describe('rendering function component', () => {
      it("renders component's return value", () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(createElement('before'), container);
        const renderable = createElement(() => 'test');

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expect(container.firstChild).toBe(container.lastChild);
      });

      it('does not reuse element', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(createElement('div'), container);
        const renderable = createElement(() => createElement('div'));
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
      });
    });

    describe('rendering class component', () => {
      it("renders component's return value", () => {
        class C extends Component {
          render() {
            return 'test';
          }
        }
        const container = document.createElement('body');
        const tree = makeOldFiberTree(createElement('before'), container);
        const renderable = createElement(C);

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expect(container.firstChild).toBe(container.lastChild);
      });

      it('does not reuse element', () => {
        class C extends Component {
          render() {
            return createElement('div');
          }
        }
        const container = document.createElement('body');
        const tree = makeOldFiberTree(createElement('div'), container);
        const renderable = createElement(C);
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
      });
    });

    describe('rendering array', () => {
      it("renders array's items", () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(createElement('before'), container);
        const renderable = ['test', createElement('div')];

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expectElement(container.lastChild!, 'div');
        expect(container.firstChild!.nextSibling).toBe(container.lastChild);
      });

      it('does not reuse text node', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(createElement('div'), container);
        const renderable = [createElement('div')];
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
      });
    });

    describe('rendering signal', () => {
      it('renders signal text', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(createElement('before'), container);
        const [signal] = createChildSignalTrack('test');

        diff(tree, signal, container);

        expectTextNode(container.firstChild!, 'test');
      });
    });
  });

  describe('rendered function component', () => {
    function makeOldFiberTree(old: FunctionComponentVNode<any>, container: Node) {
      return makeTree(old, container);
    }

    describe('rendering null', () => {
      it("removes component's render", () => {
        const container = document.createElement('body');
        const C = () => 'before';
        const tree = makeOldFiberTree(createElement(C), container);
        const renderable = null;

        diff(tree, renderable, container);

        expect(container.firstChild).toBe(null);
      });
    });

    describe('rendering string', () => {
      it("removes component's render", () => {
        const container = document.createElement('body');
        const C = () => createElement('div');
        const tree = makeOldFiberTree(createElement(C), container);
        const renderable = 'test';
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
        expect(container.firstChild).toBe(container.lastChild);
        expectTextNode(container.firstChild!, 'test');
      });

      it("does not reuse component's text", () => {
        const container = document.createElement('body');
        const C = () => 'before';
        const tree = makeOldFiberTree(createElement(C), container);
        const renderable = 'test';
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
        expect(container.firstChild).toBe(container.lastChild);
        expectTextNode(container.firstChild!, 'test');
      });
    });

    describe('rendering element', () => {
      it("removes component's render", () => {
        const container = document.createElement('body');
        const C = () => 'test';
        const tree = makeOldFiberTree(createElement(C), container);
        const renderable = createElement('div');

        diff(tree, renderable, container);

        expectElement(container.firstChild!, 'div');
        expect(container.firstChild).toBe(container.lastChild);
      });

      it("does not reuse component's element", () => {
        const container = document.createElement('body');
        const C = () => createElement('div');
        const tree = makeOldFiberTree(createElement(C), container);
        const renderable = createElement('div');
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
        expect(container.firstChild).toBe(container.lastChild);
        expectElement(container.firstChild!, 'div');
      });
    });

    describe('rendering function component', () => {
      describe('component is same function', () => {
        it('calls component again', () => {
          const container = document.createElement('body');
          const C = jest.fn(() => 'test');
          const tree = makeOldFiberTree(createElement(C), container);
          const renderable = createElement(C);

          diff(tree, renderable, container);

          expect(C).toHaveBeenCalledTimes(2);
        });

        it('passes props to component', () => {
          const container = document.createElement('body');
          const C = (props: any) => props.test;
          const tree = makeOldFiberTree(createElement(C, { test: 'before' }), container);
          const renderable = createElement(C, { test: 'test' });

          diff(tree, renderable, container);

          expectTextNode(container.firstChild!, 'test');
          expect(container.firstChild).toBe(container.lastChild);
        });

        it('updates render', () => {
          const container = document.createElement('body');
          const C = (props: any) => props.test;
          const tree = makeOldFiberTree(createElement(C, { test: 'before' }), container);
          const renderable = createElement(C, { test: 'test' });
          const old = container.firstChild!;

          diff(tree, renderable, container);

          expect(container.firstChild).toBe(old);
          expect(container.lastChild).toBe(old);
          expectTextNode(old, 'test');
        });
      });

      describe('component is different function', () => {
        it("removes component's render", () => {
          const container = document.createElement('body');
          const C = () => 'before';
          const tree = makeOldFiberTree(createElement(C), container);
          const renderable = createElement(() => 'test');

          diff(tree, renderable, container);

          expectTextNode(container.firstChild!, 'test');
          expect(container.firstChild).toBe(container.lastChild);
        });

        it('passes props to component', () => {
          const container = document.createElement('body');
          const C = () => 'before';
          const tree = makeOldFiberTree(createElement(C), container);
          const renderable = createElement((props: any) => props.test, { test: 'test' });

          diff(tree, renderable, container);

          expectTextNode(container.firstChild!, 'test');
          expect(container.firstChild).toBe(container.lastChild);
        });

        it("does not reuse component's render", () => {
          const container = document.createElement('body');
          const C = () => 'before';
          const tree = makeOldFiberTree(createElement(C), container);
          const renderable = createElement(() => 'test');
          const old = container.firstChild!;

          diff(tree, renderable, container);

          expect(container.firstChild).not.toBe(old);
        });
      });
    });

    describe('rendering class component', () => {
      it("renders component's return value", () => {
        class C extends Component {
          render() {
            return 'test';
          }
        }
        const oldC = () => 'before';
        const container = document.createElement('body');
        const tree = makeOldFiberTree(createElement(oldC), container);
        const renderable = createElement(C);

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expect(container.firstChild).toBe(container.lastChild);
      });

      it('does not reuse text node', () => {
        class C extends Component {
          render() {
            return 'test';
          }
        }
        const oldC = () => 'before';
        const container = document.createElement('body');
        const tree = makeOldFiberTree(createElement(oldC), container);
        const renderable = createElement(C);
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
      });
    });

    describe('rendering array', () => {
      it("renders array's items", () => {
        const container = document.createElement('body');
        const C = () => 'before';
        const tree = makeOldFiberTree(createElement(C), container);
        const renderable = ['test', createElement('div')];

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expectElement(container.lastChild!, 'div');
        expect(container.firstChild!.nextSibling).toBe(container.lastChild);
      });

      it('does not reuse text node', () => {
        const container = document.createElement('body');
        const C = () => 'before';
        const tree = makeOldFiberTree(createElement(C), container);
        const renderable = ['test'];
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
      });
    });

    describe('rendering signal', () => {
      it('renders signal text', () => {
        const container = document.createElement('body');
        const C = () => 'before';
        const tree = makeOldFiberTree(createElement(C), container);
        const [signal] = createChildSignalTrack('test');

        diff(tree, signal, container);

        expectTextNode(container.firstChild!, 'test');
      });
    });
  });

  describe('rendered class component', () => {
    function makeOldFiberTree(old: ClassComponentVNode<any>, container: Node) {
      return makeTree(old, container);
    }

    describe('rendering null', () => {
      it("removes component's render", () => {
        const container = document.createElement('body');
        class C extends Component {
          render() {
            return 'before';
          }
        }
        const tree = makeOldFiberTree(createElement(C), container);
        const renderable = null;

        diff(tree, renderable, container);

        expect(container.firstChild).toBe(null);
      });
    });

    describe('rendering string', () => {
      it("removes component's render", () => {
        const container = document.createElement('body');
        class C extends Component {
          render() {
            return createElement('div');
          }
        }
        const tree = makeOldFiberTree(createElement(C), container);
        const renderable = 'test';
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
        expect(container.firstChild).toBe(container.lastChild);
        expectTextNode(container.firstChild!, 'test');
      });

      it("does not reuse component's text", () => {
        const container = document.createElement('body');
        class C extends Component {
          render() {
            return 'before';
          }
        }
        const tree = makeOldFiberTree(createElement(C), container);
        const renderable = 'test';
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
        expect(container.firstChild).toBe(container.lastChild);
        expectTextNode(container.firstChild!, 'test');
      });
    });

    describe('rendering element', () => {
      it("removes component's render", () => {
        const container = document.createElement('body');
        class C extends Component {
          render() {
            return 'test';
          }
        }
        const tree = makeOldFiberTree(createElement(C), container);
        const renderable = createElement('div');

        diff(tree, renderable, container);

        expectElement(container.firstChild!, 'div');
        expect(container.firstChild).toBe(container.lastChild);
      });

      it("does not reuse component's element", () => {
        const container = document.createElement('body');
        class C extends Component {
          render() {
            return createElement('div');
          }
        }
        const tree = makeOldFiberTree(createElement(C), container);
        const renderable = createElement('div');
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
        expect(container.firstChild).toBe(container.lastChild);
        expectElement(container.firstChild!, 'div');
      });
    });

    describe('rendering function component', () => {
      it("renders component's return value", () => {
        class OldC extends Component {
          render() {
            return 'before';
          }
        }
        const C = () => 'test';
        const container = document.createElement('body');
        const tree = makeOldFiberTree(createElement(OldC), container);
        const renderable = createElement(C);

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expect(container.firstChild).toBe(container.lastChild);
      });

      it('does not reuse text node', () => {
        class OldC extends Component {
          render() {
            return 'before';
          }
        }
        const C = () => 'test';
        const container = document.createElement('body');
        const tree = makeOldFiberTree(createElement(OldC), container);
        const renderable = createElement(C);
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
      });
    });

    describe('rendering class component', () => {
      describe('component is same function', () => {
        it('calls component again', () => {
          const container = document.createElement('body');
          class C extends Component {
            render() {
              return 'test';
            }
          }
          const spy = jest.spyOn(C.prototype, 'render');
          const tree = makeOldFiberTree(createElement(C), container);
          const renderable = createElement(C);

          diff(tree, renderable, container);

          expect(spy).toHaveBeenCalledTimes(2);
        });

        it('passes props to component', () => {
          const container = document.createElement('body');
          class C extends Component {
            render(props: any) {
              return props.test;
            }
          }
          const tree = makeOldFiberTree(createElement(C, { test: 'before' }), container);
          const renderable = createElement(C, { test: 'test' });

          diff(tree, renderable, container);

          expectTextNode(container.firstChild!, 'test');
          expect(container.firstChild).toBe(container.lastChild);
        });

        it('updates render', () => {
          const container = document.createElement('body');
          class C extends Component {
            render(props: any) {
              return props.test;
            }
          }
          const tree = makeOldFiberTree(createElement(C, { test: 'before' }), container);
          const renderable = createElement(C, { test: 'test' });
          const old = container.firstChild!;

          diff(tree, renderable, container);

          expect(container.firstChild).toBe(old);
          expect(container.lastChild).toBe(old);
          expectTextNode(old, 'test');
        });
      });

      describe('component is different function', () => {
        it("removes component's render", () => {
          const container = document.createElement('body');
          class OldC extends Component {
            render() {
              return 'before';
            }
          }
          class C extends Component {
            render() {
              return 'test';
            }
          }
          const tree = makeOldFiberTree(createElement(OldC), container);
          const renderable = createElement(C);

          diff(tree, renderable, container);

          expectTextNode(container.firstChild!, 'test');
          expect(container.firstChild).toBe(container.lastChild);
        });

        it('passes props to component', () => {
          const container = document.createElement('body');
          class OldC extends Component {
            render() {
              return 'before';
            }
          }
          class C extends Component {
            render(props: any) {
              return props.test;
            }
          }
          const tree = makeOldFiberTree(createElement(OldC), container);
          const renderable = createElement(C, { test: 'test' });

          diff(tree, renderable, container);

          expectTextNode(container.firstChild!, 'test');
          expect(container.firstChild).toBe(container.lastChild);
        });

        it("does not reuse component's render", () => {
          const container = document.createElement('body');
          class OldC extends Component {
            render() {
              return 'before';
            }
          }
          class C extends Component {
            render() {
              return 'test';
            }
          }
          const tree = makeOldFiberTree(createElement(OldC), container);
          const renderable = createElement(C);
          const old = container.firstChild!;

          diff(tree, renderable, container);

          expect(container.firstChild).not.toBe(old);
        });
      });
    });

    describe('rendering array', () => {
      it("renders array's items", () => {
        const container = document.createElement('body');
        class C extends Component {
          render() {
            return 'before';
          }
        }
        const tree = makeOldFiberTree(createElement(C), container);
        const renderable = ['test', createElement('div')];

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expectElement(container.lastChild!, 'div');
        expect(container.firstChild!.nextSibling).toBe(container.lastChild);
      });

      it('does not reuse text node', () => {
        const container = document.createElement('body');
        class C extends Component {
          render() {
            return 'before';
          }
        }
        const tree = makeOldFiberTree(createElement(C), container);
        const renderable = ['test'];
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
      });
    });

    describe('rendering signal', () => {
      it('renders signal text', () => {
        const container = document.createElement('body');
        class C extends Component {
          render() {
            return 'before';
          }
        }
        const tree = makeOldFiberTree(createElement(C), container);
        const [signal] = createChildSignalTrack('test');

        diff(tree, signal, container);

        expectTextNode(container.firstChild!, 'test');
      });
    });
  });

  describe('rendered array', () => {
    function makeOldFiberTree(old: RenderableArray, container: Node) {
      return makeTree(old, container);
    }

    describe('rendering null', () => {
      it("removes array's render", () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(['before'], container);
        const renderable = null;

        diff(tree, renderable, container);

        expect(container.firstChild).toBe(null);
      });
    });

    describe('rendering string', () => {
      it("removes array's render", () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(['before'], container);
        const renderable = 'test';
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
        expect(container.firstChild).toBe(container.lastChild);
        expectTextNode(container.firstChild!, 'test');
      });

      it("does not reuse array's text", () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(['before'], container);
        const renderable = 'test';
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
        expect(container.firstChild).toBe(container.lastChild);
        expectTextNode(container.firstChild!, 'test');
      });
    });

    describe('rendering element', () => {
      it("removes array's render", () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree([createElement('before')], container);
        const renderable = createElement('div');

        diff(tree, renderable, container);

        expectElement(container.firstChild!, 'div');
        expect(container.firstChild).toBe(container.lastChild);
      });

      it("does not reuse array's element", () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree([createElement('div')], container);
        const renderable = createElement('div');
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
        expect(container.firstChild).toBe(container.lastChild);
        expectElement(container.firstChild!, 'div');
      });
    });

    describe('rendering function component', () => {
      it("removes array's render", () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(['before'], container);
        const renderable = createElement(() => 'test');

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expect(container.firstChild).toBe(container.lastChild);
      });

      it("does not reuse array's render", () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(['before'], container);
        const renderable = createElement(() => 'test');
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
      });
    });

    describe('rendering class component', () => {
      it("renders array's return value", () => {
        class C extends Component {
          render() {
            return 'test';
          }
        }
        const container = document.createElement('body');
        const tree = makeOldFiberTree(['before'], container);
        const renderable = createElement(C);

        diff(tree, renderable, container);

        expectTextNode(container.firstChild!, 'test');
        expect(container.firstChild).toBe(container.lastChild);
      });

      it('does not reuse text node', () => {
        class C extends Component {
          render() {
            return 'test';
          }
        }
        const container = document.createElement('body');
        const tree = makeOldFiberTree(['before'], container);
        const renderable = createElement(C);
        const old = container.firstChild!;

        diff(tree, renderable, container);

        expect(container.firstChild).not.toBe(old);
      });
    });

    describe('rendering array', () => {
      it('updates children', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(
          ['before', createElement('div', { id: 'before' })],
          container,
        );
        const renderable = ['test', createElement('div', { id: 'test' })];
        const oldText = container.firstChild!;
        const oldEl = container.lastChild as Element;

        diff(tree, renderable, container);

        expect(container.firstChild).toBe(oldText);
        expect(container.lastChild).toBe(oldEl);
        expectTextNode(oldText, 'test');
        expectElement(oldEl, 'div');
        expect(oldEl.id).toBe('test');
      });

      it('removes children', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(['1', '2', '3'], container);
        const renderable = ['1'];

        diff(tree, renderable, container);

        const { childNodes } = container;
        expect(childNodes).toHaveLength(1);
        expectTextNode(childNodes[0], '1');
      });

      it('empties children', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(['1', '2', '3'], container);
        const renderable: RenderableArray = [];

        diff(tree, renderable, container);

        expect(container.firstChild).toBe(null);
      });

      it('empties children 2', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(['1', '2', '3'], container);
        const renderable: RenderableArray = [];

        diff(tree, renderable, container);
        expect(container.firstChild).toBe(null);

        diff(tree, ['1'], container);
        const { childNodes } = container;
        expect(childNodes).toHaveLength(1);
        expectTextNode(childNodes[0], '1');
      });

      it('adds children', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree(['test'], container);
        const renderable = ['1', '2', '3'];

        diff(tree, renderable, container);

        const { childNodes } = container;
        expect(childNodes).toHaveLength(3);
        expectTextNode(childNodes[0], '1');
        expectTextNode(childNodes[1], '2');
        expectTextNode(childNodes[2], '3');
      });

      it('adds children from empty', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree([], container);
        const renderable = ['1', '2', '3'];

        diff(tree, renderable, container);

        const { childNodes } = container;
        expect(childNodes).toHaveLength(3);
        expectTextNode(childNodes[0], '1');
        expectTextNode(childNodes[1], '2');
        expectTextNode(childNodes[2], '3');
      });

      describe('keyed children', () => {
        it('updates keyed child in same position', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(
            [
              createElement('first', { key: 'first', id: 'before' }),
              createElement('second', { key: 'second', id: 'before' }),
            ],
            container,
          );
          const renderable = [
            createElement('first', { key: 'first', id: 'after' }),
            createElement('second', { key: 'second', id: 'after' }),
          ];
          const oldChildren = Array.from(container.childNodes);
          const { added, removed } = listenForChildMutations(container);

          diff(tree, renderable, container);

          const childNodes = Array.from(container.childNodes);
          expectShallowEqual(childNodes, oldChildren);

          expectShallowEqual(added, []);
          expectShallowEqual(removed, []);
        });

        it('updates keyed child in different position', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(
            [
              createElement('first', { key: 'first', id: 'before' }),
              createElement('second', { key: 'second', id: 'before' }),
              createElement('third', { key: 'third', id: 'before' }),
            ],
            container,
          );
          const renderable = [
            createElement('third', { key: 'third', id: 'after' }),
            createElement('second', { key: 'second', id: 'after' }),
            createElement('first', { key: 'first', id: 'after' }),
          ];
          const oldChildren = Array.from(container.childNodes);
          const { added, removed } = listenForChildMutations(container);

          diff(tree, renderable, container);

          const childNodes = Array.from(container.childNodes);
          expectShallowEqual(childNodes, [oldChildren[2], oldChildren[1], oldChildren[0]]);

          expectShallowEqual(added, [oldChildren[2], oldChildren[1]]);
          expectShallowEqual(removed, [oldChildren[2], oldChildren[1]]);
        });

        it('removes keyed child before reused keyed child', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(
            [
              createElement('first', { key: 'first', id: 'before' }),
              createElement('second', { key: 'second', id: 'before' }),
            ],
            container,
          );
          const renderable = [createElement('second', { key: 'second', id: 'after' })];
          const oldChildren = Array.from(container.childNodes);
          const { added, removed } = listenForChildMutations(container);

          diff(tree, renderable, container);

          const childNodes = Array.from(container.childNodes);
          expectShallowEqual(childNodes, [oldChildren[1]]);

          expectShallowEqual(added, [oldChildren[1]]);
          expectShallowEqual(removed, [oldChildren[1], oldChildren[0]]);
        });

        it('removes keyed child before reused non-keyed child', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(
            [
              createElement('first', { key: 'first', id: 'before' }),
              createElement('second', { id: 'before' }),
            ],
            container,
          );
          const renderable = [createElement('second', { id: 'before' })];
          const oldChildren = Array.from(container.childNodes);
          const { added, removed } = listenForChildMutations(container);

          diff(tree, renderable, container);

          const childNodes = Array.from(container.childNodes);
          expect(childNodes).toHaveLength(1);
          expectElement(childNodes[0], 'second');

          expectShallowEqual(added, [childNodes[0]]);
          expectShallowEqual(removed, oldChildren);
        });

        it('removes keyed child after reused keyed child', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(
            [
              createElement('first', { key: 'first', id: 'before' }),
              createElement('second', { key: 'second', id: 'before' }),
            ],
            container,
          );
          const renderable = [createElement('first', { key: 'first', id: 'after' })];
          const oldChildren = Array.from(container.childNodes);
          const { added, removed } = listenForChildMutations(container);

          diff(tree, renderable, container);

          const childNodes = Array.from(container.childNodes);
          expectShallowEqual(childNodes, [oldChildren[0]]);

          expectShallowEqual(added, []);
          expectShallowEqual(removed, [oldChildren[1]]);
        });

        it('removes keyed child after reused non-keyed child', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(
            [
              createElement('first', { id: 'before' }),
              createElement('second', { key: 'second', id: 'before' }),
            ],
            container,
          );
          const renderable = [createElement('first', { id: 'before' })];
          const oldChildren = Array.from(container.childNodes);
          const { added, removed } = listenForChildMutations(container);

          diff(tree, renderable, container);

          const childNodes = Array.from(container.childNodes);
          expect(childNodes).toHaveLength(1);
          expectShallowEqual(childNodes, [oldChildren[0]]);

          expectShallowEqual(added, []);
          expectShallowEqual(removed, [oldChildren[1]]);
        });

        it('removes non-keyed child before reused keyed child', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(
            [
              createElement('first', { id: 'before' }),
              createElement('second', { key: 'second', id: 'before' }),
            ],
            container,
          );
          const renderable = [createElement('second', { key: 'second', id: 'after' })];
          const oldChildren = Array.from(container.childNodes);
          const { added, removed } = listenForChildMutations(container);

          diff(tree, renderable, container);

          const childNodes = Array.from(container.childNodes);
          expectShallowEqual(childNodes, [oldChildren[1]]);

          expectShallowEqual(added, [oldChildren[1]]);
          expectShallowEqual(removed, [oldChildren[1], oldChildren[0]]);
        });

        it('removes non-keyed child after reused keyed child', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(
            [
              createElement('first', { key: 'first', id: 'before' }),
              createElement('second', { id: 'before' }),
            ],
            container,
          );
          const renderable = [createElement('first', { key: 'first', id: 'after' })];
          const oldChildren = Array.from(container.childNodes);
          const { added, removed } = listenForChildMutations(container);

          diff(tree, renderable, container);

          const childNodes = Array.from(container.childNodes);
          expectShallowEqual(childNodes, [oldChildren[0]]);

          expectShallowEqual(added, []);
          expectShallowEqual(removed, [oldChildren[1]]);
        });

        it('inserts keyed child before reused keyed child', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(
            [createElement('second', { key: 'second', id: 'before' })],
            container,
          );
          const renderable = [
            createElement('first', { key: 'first', id: 'after' }),
            createElement('second', { key: 'second', id: 'after' }),
          ];
          const oldChildren = Array.from(container.childNodes);
          const { added, removed } = listenForChildMutations(container);

          diff(tree, renderable, container);

          const childNodes = Array.from(container.childNodes);
          expect(childNodes).toHaveLength(2);
          expectElement(childNodes[0], 'first');
          expect(childNodes[1]).toBe(oldChildren[0]);

          expectShallowEqual(added, [childNodes[0]]);
          expect(removed).toHaveLength(0);
        });

        it('inserts keyed child before reused non-keyed child', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree([createElement('second', { id: 'before' })], container);
          const renderable = [
            createElement('first', { key: 'first', id: 'after' }),
            createElement('second', { id: 'after' }),
          ];
          const oldChildren = Array.from(container.childNodes);
          const { added, removed } = listenForChildMutations(container);

          diff(tree, renderable, container);

          const childNodes = Array.from(container.childNodes);
          expect(childNodes).toHaveLength(2);
          expectElement(childNodes[0], 'first');
          expectElement(childNodes[1], 'second');
          expect(childNodes[1]).not.toBe(oldChildren[0]);

          expectShallowEqual(added, childNodes);
          expectShallowEqual(removed, oldChildren);
        });

        it('inserts keyed child after reused keyed child', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(
            [createElement('first', { key: 'first', id: 'before' })],
            container,
          );
          const renderable = [
            createElement('first', { key: 'first', id: 'after' }),
            createElement('second', { key: 'second', id: 'after' }),
          ];
          const oldChildren = Array.from(container.childNodes);
          const { added, removed } = listenForChildMutations(container);

          diff(tree, renderable, container);

          const childNodes = Array.from(container.childNodes);
          expect(childNodes).toHaveLength(2);
          expect(childNodes[0]).toBe(oldChildren[0]);
          expectElement(childNodes[1], 'second');

          expectShallowEqual(added, [childNodes[1]]);
          expect(removed).toHaveLength(0);
        });

        it('inserts keyed child after reused non-keyed child', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree([createElement('first', { id: 'before' })], container);
          const renderable = [
            createElement('first', { id: 'after' }),
            createElement('second', { key: 'second', id: 'after' }),
          ];
          const oldChildren = Array.from(container.childNodes);
          const { added, removed } = listenForChildMutations(container);

          diff(tree, renderable, container);

          const childNodes = Array.from(container.childNodes);
          expect(childNodes).toHaveLength(2);
          expect(childNodes[0]).toBe(oldChildren[0]);
          expectElement(childNodes[1], 'second');

          expectShallowEqual(added, [childNodes[1]]);
          expect(removed).toHaveLength(0);
        });

        it('inserts non-keyed child before reused keyed child', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(
            [createElement('second', { key: 'second', id: 'before' })],
            container,
          );
          const renderable = [
            createElement('first', { id: 'after' }),
            createElement('second', { key: 'second', id: 'after' }),
          ];
          const oldChildren = Array.from(container.childNodes);
          const { added, removed } = listenForChildMutations(container);

          diff(tree, renderable, container);

          const childNodes = Array.from(container.childNodes);
          expect(childNodes).toHaveLength(2);
          expectElement(childNodes[0], 'first');
          expect(childNodes[1]).toBe(oldChildren[0]);

          expectShallowEqual(added, [childNodes[0]]);
          expect(removed).toHaveLength(0);
        });

        it('inserts non-keyed child after reused keyed child', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(
            [createElement('first', { key: 'first', id: 'before' })],
            container,
          );
          const renderable = [
            createElement('first', { key: 'first', id: 'after' }),
            createElement('second', { id: 'after' }),
          ];
          const oldChildren = Array.from(container.childNodes);
          const { added, removed } = listenForChildMutations(container);

          diff(tree, renderable, container);

          const childNodes = Array.from(container.childNodes);
          expect(childNodes).toHaveLength(2);
          expect(childNodes[0]).toBe(oldChildren[0]);
          expectElement(childNodes[1], 'second');

          expectShallowEqual(added, [childNodes[1]]);
          expect(removed).toHaveLength(0);
        });

        it('updates non-keyed child in same position before a keyed child', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(
            [
              createElement('first', { id: 'before' }),
              createElement('second', { key: 'second', id: 'before' }),
            ],
            container,
          );
          const renderable = [
            createElement('first', { id: 'after' }),
            createElement('second', { key: 'second', id: 'after' }),
          ];
          const oldChildren = Array.from(container.childNodes);
          const { added, removed } = listenForChildMutations(container);

          diff(tree, renderable, container);

          const childNodes = Array.from(container.childNodes);
          expectShallowEqual(childNodes, oldChildren);

          expectShallowEqual(added, []);
          expectShallowEqual(removed, []);
        });

        it('updates non-keyed child in same position after a keyed child', () => {
          const container = document.createElement('body');
          const tree = makeOldFiberTree(
            [
              createElement('first', { key: 'first', id: 'before' }),
              createElement('second', { id: 'before' }),
            ],
            container,
          );
          const renderable = [
            createElement('first', { key: 'first', id: 'after' }),
            createElement('second', { id: 'after' }),
          ];
          const oldChildren = Array.from(container.childNodes);
          const { added, removed } = listenForChildMutations(container);

          diff(tree, renderable, container);

          const childNodes = Array.from(container.childNodes);
          expectShallowEqual(childNodes, oldChildren);

          expectShallowEqual(added, []);
          expectShallowEqual(removed, []);
        });
      });
    });

    describe('rendering signal', () => {
      it('renders signal text', () => {
        const container = document.createElement('body');
        const tree = makeOldFiberTree([createElement('before')], container);
        const [signal] = createChildSignalTrack('test');

        diff(tree, signal, container);

        expectTextNode(container.firstChild!, 'test');
      });
    });
  });
});

describe('rediffComponent', () => {
  function expectFunctionComponentFiber(fiber: null | Fiber): FunctionComponentFiber {
    expect(fiber).not.toBeNull();
    const { data } = fiber!;
    expect(typeof data).toBe('object');
    expect(typeof (data as any).type).toBe('function');
    return fiber as FunctionComponentFiber;
  }

  it('invokes component with the same props', () => {
    const container = document.createElement('body');
    const C = jest.fn();
    const props = {};
    const tree = makeTree(createElement(C, props), container);
    const component = expectFunctionComponentFiber(tree.child);
    C.mockClear();

    rediffComponent(component);

    expect(C).toHaveBeenCalledTimes(1);
    expect(C).toHaveBeenCalledWith(props);
  });

  it('updates render', () => {
    const container = document.createElement('body');
    const C = jest.fn();
    C.mockReturnValue('before');
    const tree = makeTree(createElement(C), container);
    const component = expectFunctionComponentFiber(tree.child);
    const old = container.firstChild!;

    C.mockReturnValue('test');
    rediffComponent(component);

    expect(container.firstChild).toBe(old);
    expect(container.lastChild).toBe(old);
    expectTextNode(old, 'test');
  });

  it('applies layoutEffects from rerender', () => {
    const container = document.createElement('body');
    const C = jest.fn();
    C.mockReturnValue('before');
    const tree = makeTree(createElement(C), container);
    const component = expectFunctionComponentFiber(tree.child);
    const effect = jest.fn();

    C.mockImplementation(() => {
      useLayoutEffect(effect);
    });
    rediffComponent(component);

    expect(effect).toHaveBeenCalledTimes(1);
  });

  it('diffs the component in isolation', () => {
    const container = document.createElement('body');
    const C = jest.fn();
    const D = jest.fn();
    const tree = makeTree([createElement(C), createElement(D)], container);
    const cComponent = expectFunctionComponentFiber(tree.child!.child);
    D.mockClear();

    rediffComponent(cComponent);

    expect(D).not.toHaveBeenCalled();
  });
});

import type { Fiber, FunctionComponentFiber } from '../../src/fiber';
import type { Renderable } from '../../src/render';

import { createElement } from '../../src/jsx2';
import { createTree } from '../../src/diff/create-tree';
import { enqueueDiff } from '../../src/diff/enqueue-diff';
import { coerceRenderable } from '../../src/util/coerce-renderable';

describe('enqueueDiff', () => {
  let process: () => void;
  function defaultScheduler(p: () => void): void {
    process = p;
  }

  function makeTree(renderable: Renderable, container: Node) {
    return createTree(coerceRenderable(renderable), container, false);
  }

  function expectCalledBefore(first: jest.Mock, second: jest.Mock) {
    expect(first.mock.invocationCallOrder[0]).toBeLessThan(second.mock.invocationCallOrder[0]);
  }

  function expectFunctionComponentFiber(fiber: null | Fiber): FunctionComponentFiber {
    expect(fiber).not.toBeNull();
    const { data } = fiber!;
    expect(typeof data).toBe('object');
    expect(typeof (data as any).type).toBe('function');
    return fiber as FunctionComponentFiber;
  }

  afterEach(() => {
    if (process) process();
  });

  it('calls scheduler', () => {
    const container = document.createElement('body');
    const scheduler = jest.fn(defaultScheduler);
    const tree = makeTree(
      createElement(() => {}),
      container,
    );
    const component = expectFunctionComponentFiber(tree.child);

    enqueueDiff(component, scheduler);

    expect(scheduler).toHaveBeenCalledTimes(1);
  });

  it('only calls scheduler once until drained', () => {
    const container = document.createElement('body');
    const scheduler = jest.fn(defaultScheduler);
    const tree = makeTree([createElement(() => {}), createElement(() => {})], container);
    const firstComponent = expectFunctionComponentFiber(tree.child!.child);
    const secondComponent = expectFunctionComponentFiber(firstComponent.next);

    enqueueDiff(firstComponent, scheduler);
    enqueueDiff(secondComponent, scheduler);

    expect(scheduler).toHaveBeenCalledTimes(1);
  });

  it('calls scheduler after draining', () => {
    const container = document.createElement('body');
    const scheduler = jest.fn(defaultScheduler);
    const tree = makeTree([createElement(() => {}), createElement(() => {})], container);
    const firstComponent = expectFunctionComponentFiber(tree.child!.child);
    const secondComponent = expectFunctionComponentFiber(firstComponent.next);

    enqueueDiff(firstComponent, scheduler);
    process();
    enqueueDiff(secondComponent, scheduler);

    expect(scheduler).toHaveBeenCalledTimes(2);
  });

  it('does not schedule fiber if dirty', () => {
    const container = document.createElement('body');
    const scheduler = jest.fn(defaultScheduler);
    const tree = makeTree(
      createElement(() => {}),
      container,
    );
    const component = expectFunctionComponentFiber(tree.child);

    component.dirty = true;
    enqueueDiff(component, scheduler);

    expect(scheduler).not.toHaveBeenCalled();
  });

  it('does not schedule fiber if unmounted', () => {
    const container = document.createElement('body');
    const scheduler = jest.fn(defaultScheduler);
    const tree = makeTree(
      createElement(() => {}),
      container,
    );
    const component = expectFunctionComponentFiber(tree.child);

    component.mounted = false;
    enqueueDiff(component, scheduler);

    expect(scheduler).not.toHaveBeenCalled();
  });

  it('does not schedule fiber if current', () => {
    const container = document.createElement('body');
    const scheduler = jest.fn(defaultScheduler);
    const tree = makeTree(
      createElement(() => {}),
      container,
    );
    const component = expectFunctionComponentFiber(tree.child);

    component.current = true;
    enqueueDiff(component, scheduler);

    expect(scheduler).not.toHaveBeenCalled();
  });

  it('marks fiber as dirty if current', () => {
    const container = document.createElement('body');
    const scheduler = jest.fn(defaultScheduler);
    const tree = makeTree(
      createElement(() => {}),
      container,
    );
    const component = expectFunctionComponentFiber(tree.child);

    component.current = true;
    enqueueDiff(component, scheduler);

    expect(component.dirty).toBe(true);
  });

  it('processes parent components before children components', () => {
    const container = document.createElement('body');
    const scheduler = jest.fn(defaultScheduler);
    const Parent = jest.fn(() => {
      return createElement(Child);
    });
    const Child = jest.fn(() => {});
    const tree = makeTree(createElement(Parent), container);
    const parent = expectFunctionComponentFiber(tree.child);
    const child = expectFunctionComponentFiber(parent.child);
    Parent.mockClear();
    Child.mockClear();

    enqueueDiff(child, scheduler);
    enqueueDiff(parent, scheduler);

    process();

    expect(Parent).toHaveBeenCalledTimes(1);
    expect(Child).toHaveBeenCalledTimes(1);
    expectCalledBefore(Parent, Child);
  });

  it('skips reprocessing component if it becomes unmounted', () => {
    const container = document.createElement('body');
    const scheduler = jest.fn(defaultScheduler);
    const First = jest.fn(() => {});
    const tree = makeTree(createElement(First), container);
    const first = expectFunctionComponentFiber(tree.child);
    First.mockClear();

    enqueueDiff(first, scheduler);
    first.mounted = false;

    process();

    expect(First).not.toHaveBeenCalled();
  });

  it('processes components reentrantly', () => {
    const container = document.createElement('body');
    const scheduler = jest.fn(defaultScheduler);
    const First = jest.fn(() => {});
    const Second = jest.fn(() => {});
    const tree = makeTree([createElement(First), createElement(Second)], container);
    const first = expectFunctionComponentFiber(tree.child!.child);
    const second = expectFunctionComponentFiber(first.next);
    First.mockClear();
    Second.mockClear();
    First.mockImplementationOnce(() => {
      enqueueDiff(second, scheduler);
    });

    enqueueDiff(first, scheduler);

    process();

    expect(First).toHaveBeenCalledTimes(1);
    expect(Second).toHaveBeenCalledTimes(1);
  });

  it('processes same component reentrantly', () => {
    const container = document.createElement('body');
    const scheduler = jest.fn(defaultScheduler);
    const First = jest.fn(() => {});
    const tree = makeTree(createElement(First), container);
    const first = expectFunctionComponentFiber(tree.child);
    First.mockClear();
    First.mockImplementationOnce(() => {
      enqueueDiff(first, scheduler);
    });

    enqueueDiff(first, scheduler);

    process();

    expect(First).toHaveBeenCalledTimes(2);
  });
});

type CoercedRenderable<R> = import('../util/coerce-renderable').CoercedRenderable<R>;
type RenderableArray<R> = import('../render').RenderableArray<R>;
type VNode<R> = import('../create-element').VNode<R>;
type MarkedNode<R> = import('./mark').MarkedNode<R>;

import { Component, isFunctionComponent } from '../component';
import { coerceRenderable } from '../util/coerce-renderable';
import { isArray } from '../util/is-array';
import { insertElement } from './create-tree';
import { diffRef } from './diff-ref';
import { mark, markComponent } from './mark';
import { nextSibling } from './next-sibling';
import { diffProps } from './prop';
import { removeRange } from './remove';

export function diffTree<R>(
  old: CoercedRenderable<R>,
  renderable: CoercedRenderable<R>,
  container: Node,
  node: null | ChildNode,
): void {
  if (old === renderable) return;
  if (old === null) return insertElement(renderable, container, node);
  if (node === null) throw new Error('old vnode was non-null but dom node is null');

  if (typeof old === 'string') {
    return oldWasText(old, renderable, container, node as Text);
  }

  if (isArray(old)) {
    return oldWasArray(old, renderable, container, node);
  }

  if (typeof old.type === 'string') {
    return oldWasElement(old, renderable, container, node as Element);
  }

  return oldWasComponent(old, renderable, container, node);
}

function oldWasText<R>(
  old: string,
  renderable: CoercedRenderable<R>,
  container: Node,
  node: Text,
): void {
  if (old === renderable) return;
  if (typeof renderable !== 'string') {
    insertElement(renderable, container, node);
    removeRange(node);
    return;
  }

  node.data = renderable;
  mark(renderable, node, node);
}

function oldWasArray<R>(
  old: RenderableArray<R>,
  renderable: CoercedRenderable<R>,
  container: Node,
  node: ChildNode,
): void {
  if (!isArray(renderable)) {
    insertElement(renderable, container, node);
    removeRange(node);
    return;
  }

  // TODO: Figure out key.
  const previous = node.previousSibling;
  let current = node as null | ChildNode;

  const shortest = Math.min(old.length, renderable.length);
  let i = 0;
  for (; i < shortest; i++) {
    const n = nextSibling(current!);
    diffTree(coerceRenderable(old[i]), coerceRenderable(renderable[i]), container, current);
    current = n;
  }
  for (; i < old.length; i++) {
    current = removeRange(current!);
  }
  for (; i < renderable.length; i++) {
    insertElement(coerceRenderable(renderable[i]), container, current);
  }

  const first = previous ? previous.nextSibling : container.firstChild;
  if (first === null) return;
  if (first === current) return;

  const last = current ? current.previousSibling! : container.lastChild!;
  mark(renderable, first, last);
}

function oldWasElement<R>(
  old: VNode<R>,
  renderable: CoercedRenderable<R>,
  container: Node,
  node: Element,
): void {
  if (renderable === null || typeof renderable === 'string' || isArray(renderable)) {
    insertElement(renderable, container, node);
    removeRange(node);
    return;
  }

  const { type } = renderable;
  if (type !== old.type) {
    insertElement(renderable, container, node);
    removeRange(node);
    return;
  }

  const oldProps = old.props;
  const { props } = renderable;
  diffProps(node as HTMLElement, oldProps, props);
  diffTree(
    coerceRenderable(oldProps.children),
    coerceRenderable(props.children),
    node,
    node.firstChild,
  );
  diffRef((node as unknown) as R, old.ref, renderable.ref);
  mark(renderable, node, node);
  return;
}

function oldWasComponent<R>(
  old: VNode<R>,
  renderable: CoercedRenderable<R>,
  container: Node,
  node: ChildNode,
): void {
  if (renderable === null || typeof renderable === 'string' || isArray(renderable)) {
    insertElement(renderable, container, node);
    removeRange(node);
    return;
  }

  const { type } = renderable;
  if (typeof type === 'string' || type !== old.type) {
    insertElement(renderable, container, node);
    removeRange(node);
    return;
  }

  const { props } = renderable;
  const next = nextSibling(node);
  const component = (node as MarkedNode<R>)._component;
  const rendered = isFunctionComponent<R>(type) ? type(props) : component!.render(props);

  diffTree(old, coerceRenderable(rendered), container, node.nextSibling);
  const end = next ? next.previousSibling! : container.lastChild!;
  mark(renderable, node, end, component);
}

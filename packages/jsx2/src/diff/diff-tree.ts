import { coerceRenderable } from './coerce-renderable';
import { insertElement } from './insert-element';
import { isArray } from './is-array';
import { diffProp } from './prop';
import { setRef } from './set-ref';

type CoercedRenderable<R> = import('./coerce-renderable').CoercedRenderable<R>;
type VNode<R> = import('../create-element').VNode<R>;
type Ref<R> = import('../create-ref').Ref<R>;

export function diffTree<R>(
  old: CoercedRenderable<R>,
  renderable: CoercedRenderable<R>,
  container: Node,
  node: null | Node
): void {
  if (old === renderable) return;
  if (old === null) {
    insertElement(renderable, container, node);
    return;
  }

  if (node === null) throw new Error('old vnode was non-null but dom node is null');

  if (typeof old === 'string') {
    if (typeof renderable === 'string') {
      node.textContent = renderable;
      return;
    }

    insertElement(renderable, container, node);
    return removeNode(node);
  }

  if (isArray(old)) {
    if (renderable === null || typeof renderable === 'string') {
      // TODO
      return;
    }

    if (isArray(renderable)) {
      // TODO
      return;
    }

    // TODO
    // renderable;
    return;
  }

  const oldType = old.type;
  if (typeof oldType === 'string') {
    if (renderable === null || typeof renderable === 'string') {
      insertElement(renderable, container, node);
      removeNode(node);
      return;
    }

    if (isArray(renderable)) {
      // TODO
      return;
    }

    // TODO
    const { type } = renderable;

    if (typeof type === 'string') {
      if (type === oldType) {
        const oldProps = old.props;
        const { props } = renderable;
        diffProps(node as HTMLElement, oldProps, props);
        diffTree(
          coerceRenderable(oldProps.children),
          coerceRenderable(props.children),
          node,
          node.firstChild
        );
        const { ref } = renderable;
        if (ref) setRef(ref as Ref<HTMLElement>, node as HTMLElement);
        ((node as unknown) as { _vnode: unknown })._vnode = renderable;
        return;
      }

      insertElement(renderable, container, node);
      removeNode(node);
      return;
    }

    // renderable;
    // type;
    return;
  }

  // oldType;
}

function removeNode(node: Node): void {
  const { parentNode } = node;
  if (parentNode) parentNode.removeChild(node);
}

function diffProps<R>(
  el: HTMLElement,
  oldProps: VNode<R>['props'],
  props: VNode<R>['props']
): void {
  for (const name in oldProps) {
    if (!(name in props)) diffProp(el, name, oldProps[name], null);
  }
  for (const name in props) {
    diffProp(el, name, oldProps[name], props[name]);
  }
}

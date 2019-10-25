import { coerceRenderable } from '../coerce-renderable';
import { isFunctionComponent } from '../component';
import { RenderedChild } from '../render';
import { insertElement } from './insert-element';
import { isArray } from './is-array';
import { mark } from './mark';
import { diffProp } from './prop';
import { removeRange } from './remove';
import { setRef } from './set-ref';

type CoercedRenderable<R> = import('../coerce-renderable').CoercedRenderable<R>;
type VNode<R> = import('../create-element').VNode<R>;
type Ref<R> = import('../create-ref').Ref<R>;

export function diffTree<R>(
  old: CoercedRenderable<R>,
  renderable: CoercedRenderable<R>,
  container: Node,
  node: null | RenderedChild | Comment
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
      mark(renderable, node);
      return;
    }

    insertElement(renderable, container, node);
    return removeRange(node);
  }

  if (isArray(old)) {
    if (renderable === null || typeof renderable === 'string') {
      insertElement(renderable, container, node);
      return removeRange(node);
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
      removeRange(node);
      return;
    }

    if (isArray(renderable)) {
      insertElement(renderable, container, node);
      removeRange(node);
      return;
    }

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
          node.firstChild as null | RenderedChild | Comment
        );
        const { ref } = renderable;
        if (ref) setRef(ref as Ref<HTMLElement>, node as HTMLElement);
        mark(renderable, node);
        return;
      }

      insertElement(renderable, container, node);
      removeRange(node);
      return;
    }

    insertElement(renderable, container, node);
    removeRange(node);
    return;
  }

  if (renderable === null || typeof renderable === 'string') {
    insertElement(renderable, container, node);
    removeRange(node);
    return;
  }

  if (isArray(renderable)) {
    insertElement(renderable, container, node);
    removeRange(node);
    return;
  }

  const { type } = renderable;

  if (typeof type === 'string') {
    insertElement(renderable, container, node);
    removeRange(node);
    return;
  }

  if (type === oldType) {
    // const { props } = renderable;
    // if (isFunctionComponent<R>(type)) {
    //   const rendered = coerceRenderable(type(props));
    //   if (rendered === null) return null;
    //   return markComponent(renderable, rendered);
    // }
    // const component = new type(props);
    // const rendered = renderableToNode(coerceRenderable(component.render(props)));
    // if (rendered === null) return null;
    // return markComponent(renderable, rendered);
  }

  insertElement(renderable, container, node);
  removeRange(node);
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

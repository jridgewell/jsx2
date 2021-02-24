import type { ComponentChildren, ComponentProps } from './component';
import type {
  ClassComponentVNode,
  ElementVNode,
  FunctionComponentVNode,
  Props,
  VNode,
} from './create-element';
import type { Renderable } from './render';

import { createElement } from './create-element';

export const undefProps: { key: undefined; ref: undefined; children?: null } = {
  key: undefined,
  ref: undefined,
} as const;

export function cloneElement<T extends VNode>(
  vnode: T,
  props?:
    | null
    | undefined
    | (T extends FunctionComponentVNode<any>
        ? ComponentProps
        : T extends ClassComponentVNode<any>
        ? ComponentProps
        : Props),
  ...children: T extends ElementVNode ? Renderable[] : ComponentChildren[]
): T {
  const { key = vnode.key, ref = vnode.ref } = (props || undefProps) as Props;
  const _props = { ...vnode.props, ...props, key, ref };
  return createElement(vnode.type, _props, ...children) as T;
}

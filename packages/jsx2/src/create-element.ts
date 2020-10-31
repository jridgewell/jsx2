import type { FunctionComponent, Component, ComponentProps, ComponentChildren } from './component';
import type { Ref } from './create-ref';
import type { Renderable } from './render';

export interface SharedVNode {
  readonly key: string | number | null;
  readonly ref: null | Ref;
  readonly props: RegularProps & { readonly children?: Renderable };
  readonly constructor: undefined;
}

export interface ElementVNode extends SharedVNode {
  readonly type: string;
}

export interface FunctionComponentVNode extends SharedVNode {
  readonly type: FunctionComponent;
}

export interface ClassComponentVNode extends SharedVNode {
  readonly type: new (props: Record<string, unknown>) => Component;
}

export type VNode = ElementVNode | FunctionComponentVNode | ClassComponentVNode;

export type RegularProps = Record<string, unknown>;

export interface SpecialProps {
  readonly key?: SharedVNode['key'];
  readonly ref?: SharedVNode['ref'];
  readonly children?: Renderable;
}

export type Props = SpecialProps & RegularProps;

const nilProps: { key: null; ref: null; children?: null } = {
  key: null,
  ref: null,
} as const;

export function createElement<T extends VNode['type']>(
  type: T,
  props?: null | undefined | (T extends ElementVNode['type'] ? Props : ComponentProps),
  ...children: T extends ElementVNode['type'] ? Renderable[] : ComponentChildren
): T extends ElementVNode['type']
  ? ElementVNode
  : T extends FunctionComponentVNode['type']
  ? FunctionComponentVNode
  : T extends ClassComponentVNode['type']
  ? ClassComponentVNode
  : never {
  const { key = null, ref = null, ..._props } = (props || nilProps) as Props;
  if (children.length > 0) {
    _props.children = children.length === 1 ? children[0] : children;
  }

  return Object.freeze({
    type,
    key,
    ref,
    props: Object.freeze(_props),
    constructor: void 0,
  }) as any;
}

export function isValidElement(value: unknown): value is VNode {
  return (
    typeof value === 'object' &&
    !!value &&
    value.constructor === void 0 &&
    !!(value as { type?: unknown }).type
  );
}

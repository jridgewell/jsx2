import type { Component, ComponentChildren, ComponentProps, FunctionComponent } from './component';
import type { Ref } from './create-ref';
import type { Renderable } from './render';

export type Key = string | number | null;

export interface SharedVNode {
  readonly key: Key;
  readonly ref: null | Ref;
  readonly props: RegularProps & { readonly children?: Renderable };
  readonly constructor: undefined;
}

export interface ElementVNode extends SharedVNode {
  readonly type: string;
}

export interface FunctionComponentVNode<P extends ComponentProps> extends SharedVNode {
  readonly type: FunctionComponent<P>;
}

export interface ClassComponentVNode<P extends ComponentProps> extends SharedVNode {
  readonly type: new (props: P) => Component<P>;
}

export type VNode = ElementVNode | FunctionComponentVNode<any> | ClassComponentVNode<any>;

export type RegularProps = Record<string, unknown>;

export interface SpecialProps {
  readonly key?: SharedVNode['key'];
  readonly ref?: SharedVNode['ref'];
  readonly children?: unknown;
}

export type Props = SpecialProps & RegularProps;

const nilProps: { key: null; ref: null; children?: null } = {
  key: null,
  ref: null,
} as const;

export function createElement<T extends VNode['type']>(
  type: T,
  props?:
    | null
    | undefined
    | (T extends FunctionComponentVNode<infer P>['type']
        ? P
        : T extends ClassComponentVNode<infer P>['type']
        ? P
        : Props),
  ...children: T extends ElementVNode['type'] ? Renderable[] : ComponentChildren[]
): T extends ElementVNode['type']
  ? ElementVNode
  : T extends FunctionComponentVNode<any>['type']
  ? FunctionComponentVNode<any>
  : T extends ClassComponentVNode<any>['type']
  ? ClassComponentVNode<any>
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

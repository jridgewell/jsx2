type Ref = import('./create-ref').Ref;
type FunctionComponent = import('./component').FunctionComponent;
type Component = import('./component').Component;
type Renderable = import('./render').Renderable;

export interface VNode {
  readonly type: string | FunctionComponent | (new (props: object) => Component);
  readonly key: string | number | null | undefined;
  readonly ref: null | undefined | Ref;
  readonly props: RegularProps & { readonly children?: Renderable };
  readonly constructor: undefined;
}

export interface RegularProps {
  readonly [key: string]: unknown;
}

export interface SpecialProps {
  readonly key?: VNode['key'];
  readonly ref?: VNode['ref'];
  readonly children?: Renderable;
}

export type Props = SpecialProps & RegularProps;

const nilProps: { key: null; ref: null; children?: null } = {
  key: null,
  ref: null,
} as const;

export function createElement(
  type: VNode['type'],
  props?: null | undefined | Props,
  ...children: Renderable[]
): VNode {
  const { key = null, ref = null, ..._props } = props || nilProps;
  if (children.length > 0) {
    _props.children = children.length === 1 ? children[0] : children;
  }

  return Object.freeze({
    type,
    key,
    ref,
    props: Object.freeze(_props),
    constructor: void 0,
  });
}

export function isValidElement(value: unknown): value is VNode {
  return (
    typeof value === 'object' &&
    !!value &&
    value.constructor === void 0 &&
    !!(value as { type?: unknown }).type
  );
}

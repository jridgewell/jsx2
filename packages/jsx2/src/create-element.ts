type TemplateResult = import('./template-result').TemplateResult;
type Ref<R> = import('./create-ref').Ref<R>;

export type Renderable<R> = string | number | boolean | null | undefined | Node<R> | TemplateResult;

export interface FunctionComponent<R> {
  (props: object): void | Renderable<R>;
}

export interface ClassComponent<R> {
  render(props: object): ReturnType<FunctionComponent<R>>;
}

export interface Node<R> {
  readonly type: string | FunctionComponent<R> | (new (props: object) => ClassComponent<R>);
  readonly key: string | number | null | undefined;
  readonly ref: null | undefined | Ref<R>;
  readonly props: RegularProps & { readonly children?: unknown };
  readonly constructor: undefined;
}

export interface RegularProps {
  readonly [key: string]: unknown;
}

export interface SpecialProps<R> {
  readonly key?: Node<R>['key'];
  readonly ref?: Node<R>['ref'];
  readonly children?: unknown;
}

export type Props<R> = SpecialProps<R> & RegularProps;

const nilProps: { key: null; ref: null; children?: null } = {
  key: null,
  ref: null,
} as const;

export function createElement<R>(
  type: Node<R>['type'],
  _props?: null | undefined | Props<R>,
  ...children: unknown[]
): Node<R> {
  const { key = null, ref = null, ...props } = _props || nilProps;
  if (children.length > 0) {
    props.children = children.length === 1 ? children[0] : children;
  }

  return {
    type,
    key,
    ref,
    props,
    constructor: void 0,
  };
}

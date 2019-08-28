type Marker = { readonly constructor: undefined };
type TagName = string | Marker;
type Key = string | Marker | null;
type PropValue = string | number | null | boolean | Marker | Node;
type Props = {
  readonly [key: string]: PropValue | PropValue[];
};
type Ref = { current: Element | null } | ((current: Element) => void);

type Node = {
  readonly type: string | Marker;
  readonly key: Key;
  readonly ref: Ref | Marker | null;
  readonly props: Props | null;
};

type Template = {
  readonly tree: Node;
  readonly expressions: unknown[];
  readonly constructor: undefined;
};

export const expressionMarker = { constructor: void 0 } as const;

export function createElement(type: TagName, key: Key, properties: null | Props): Node {
  const { ref = null, ...props } = properties || {} as Props;
  return { type, key, ref: ref as unknown as Ref, props };
}

export function createTemplate(tree: Node, expressions: unknown[]): Template {
  return { tree, expressions, constructor: void 0 };
}

export function createRef(): Ref {
  return { current: null };
}

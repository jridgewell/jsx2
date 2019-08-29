type Primitive = string | number | boolean | null | undefined;
type Expression = Primitive | Template;
type TagName = string | Marker;
type Key = string | number | null | Marker;
type Ref = RefObject | ((current: Element) => void);
type PropValue = Primitive | Marker | Node | Ref;

interface Marker {
  readonly constructor: undefined
}

interface Props {
  readonly [key: string]: PropValue | PropValue[];
}

interface RefObject {
  current: Element | null;
}

export interface Node {
  readonly type: TagName;
  readonly key: Key;
  readonly ref: Ref | Marker | null;
  readonly props: Props | null;
}

export interface Template {
  readonly tree: Node;
  readonly expressions: Expression[];
  readonly constructor: undefined;
}

export const expressionMarker: Marker = { constructor: void 0 } as const;

export function createElement(type: TagName, key: Key, properties: null | Props): Node {
  const { ref = null, ...props } = properties || {} as Props;
  return { type, key, ref: ref as Ref, props };
}

export function createTemplate(tree: Node, expressions: Expression[]): Template {
  return { tree, expressions, constructor: void 0 };
}

export function createRef(): RefObject {
  return { current: null };
}

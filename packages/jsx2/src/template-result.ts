type Renderable = import('./render').Renderable;

export type Primitive = string | boolean | null;
export type Marker = number;

export type PropValue = Primitive | Marker;
export interface RegularProps {
  readonly [key: string]: PropValue;
}
export type Props = {
  readonly children?: PropValue | readonly PropValue[];
} & RegularProps;
export type SpreadProps = Marker | readonly (Marker | Props)[];

export interface StaticNode {
  readonly type: string;
  readonly key?: string | null | Marker;
  readonly ref?: null | Marker;
  readonly props?: null | Props | SpreadProps;
}

export interface TemplateResult {
  readonly tree: StaticNode;
  readonly expressions: Renderable[];
  readonly constructor: undefined;
}

const parsed = new WeakMap<TemplateStringsArray, StaticNode>();

function parse(strings: TemplateStringsArray): StaticNode {
  let s = strings[0];
  for (let i = 1; i < strings.length; i++) {
    s = s + (i - 1) + strings[i];
  }
  return JSON.parse(s) as StaticNode;
}

function getTree(strings: TemplateStringsArray): StaticNode {
  let tree = parsed.get(strings);
  if (tree) return tree;

  tree = parse(strings);
  parsed.set(strings, tree);
  return tree;
}

export function templateResult(
  strings: TemplateStringsArray,
  ...expressions: Renderable[]
): TemplateResult {
  return {
    tree: getTree(strings),
    expressions,
    constructor: void 0,
  };
}

export function isValidTemplate(value: unknown): value is TemplateResult {
  return (
    typeof value === 'object' &&
    !!value &&
    value.constructor === void 0 &&
    !!(value as { tree?: unknown }).tree
  );
}

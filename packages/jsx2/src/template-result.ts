export type Primitive = string | boolean | null;
export type Marker = number;

export type PropValue = Primitive | Marker | StaticNode;
export type Props = {
  readonly children?: PropValue | readonly PropValue[];
} & {
  readonly [key: string]: PropValue;
};

export interface StaticNode {
  readonly type: string | Marker;
  readonly key?: string | null | Marker;
  readonly ref?: null | Marker;
  readonly props?: null | Marker | Props | readonly (Marker | Props)[];
}

export interface TemplateResult {
  readonly tree: StaticNode;
  readonly expressions: unknown[];
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
  ...expressions: unknown[]
): TemplateResult {
  return {
    tree: getTree(strings),
    expressions,
    constructor: void 0,
  };
}

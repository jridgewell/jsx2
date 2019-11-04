type Component = import('../component').Component;
type ElementVNode = import('../create-element').ElementVNode;
type FunctionComponentVNode = import('../create-element').FunctionComponentVNode;
type ClassComponentVNode = import('../create-element').ClassComponentVNode;
type TemplateResult = import('../template-result').TemplateResult;
type StaticNode = import('../template-result').StaticNode;
type SpreadProps = import('../template-result').SpreadProps;
type RenderableArray = import('../render').RenderableArray;
type Ref = import('../create-ref').Ref;

export interface SharedFiber {
  parent: null | Fiber;
  child: null | Fiber;
  next: null | Fiber;
}

export interface NullFiber extends SharedFiber {
  data: null;
  key: null;
  dom: null;
  component: null;
  ref: null;
  dynamics: null;
}

export interface TextFiber extends SharedFiber {
  data: string;
  key: null;
  dom: null | Text;
  component: null;
  ref: null;
  dynamics: null;
}

export interface ElementFiber extends SharedFiber {
  data: ElementVNode;
  key: ElementVNode['key'];
  dom: null | Element;
  component: null;
  ref: null | Ref;
  dynamics: null;
}

export interface FunctionComponentFiber extends SharedFiber {
  data: FunctionComponentVNode;
  key: FunctionComponentVNode['key'];
  dom: null;
  component: null;
  ref: null;
  dynamics: null;
}

export interface ClassComponentFiber extends SharedFiber {
  data: ClassComponentVNode;
  key: ClassComponentVNode['key'];
  dom: null;
  component: null | Component;
  ref: null | Ref;
  dynamics: null;
}

export interface ArrayFiber extends SharedFiber {
  data: RenderableArray;
  key: null;
  dom: null;
  component: null;
  ref: null;
  dynamics: null;
}

export interface StaticNodeFiber extends SharedFiber {
  data: null | StaticNode;
  key: StaticNode['key'];
  dom: null | HTMLElement;
  component: null;
  ref: StaticNode['ref'];
  dynamics: null;
}

export interface TemplateResultFiber extends SharedFiber {
  data: TemplateResult;
  key: null;
  dom: null;
  component: null;
  ref: null;
  dynamics: null | DynamicExpression[];
}

interface AttributeExpression {
  type: 'attribute';
  fiber: Fiber;
  el: HTMLElement;
  name: string;
  old: unknown;
}
interface SpreadAttributeExpression {
  type: 'spread';
  fiber: Fiber;
  el: HTMLElement;
  spread: SpreadProps;
  old: object;
}
interface FiberExpression {
  type: 'fiber';
  fiber: Fiber;
  previous: null | Fiber;
}

interface FiberExpression {
  type: 'fiber';
  fiber: Fiber;
  previous: null | Fiber;
}

export type DynamicExpression = FiberExpression | AttributeExpression | SpreadAttributeExpression;

export type Fiber =
  | NullFiber
  | TextFiber
  | ElementFiber
  | FunctionComponentFiber
  | ClassComponentFiber
  | ArrayFiber
  | StaticNodeFiber
  | TemplateResultFiber;

export function fiber<T extends Fiber['data']>(
  data: T,
): T extends NullFiber['data']
  ? NullFiber
  : T extends TextFiber['data']
  ? TextFiber
  : T extends ElementFiber['data']
  ? ElementFiber
  : T extends FunctionComponentFiber['data']
  ? FunctionComponentFiber
  : T extends ClassComponentFiber['data']
  ? ClassComponentFiber
  : T extends ArrayFiber['data']
  ? ArrayFiber
  : T extends StaticNodeFiber['data']
  ? StaticNodeFiber
  : T extends TemplateResultFiber['data']
  ? TemplateResultFiber
  : never {
  return {
    data,
    key: null,
    dom: null,
    component: null,
    parent: null,
    child: null,
    next: null,
    ref: null,
    dynamics: null,
  } as any;
}

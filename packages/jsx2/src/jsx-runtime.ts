import type {
  ClassComponentVNode,
  ElementVNode,
  FunctionComponentVNode,
  Key,
  Props,
  VNode,
} from './create-element';

export { Fragment } from 'jsx2';

export function jsx<T extends VNode['type']>(
  type: T,
  props?: T extends FunctionComponentVNode<infer P>['type']
    ? P
    : T extends ClassComponentVNode<infer P>['type']
    ? P
    : Props,
  key?: Key,
): T extends ElementVNode['type']
  ? ElementVNode
  : T extends FunctionComponentVNode<any>['type']
  ? FunctionComponentVNode<any>
  : T extends ClassComponentVNode<any>['type']
  ? ClassComponentVNode<any>
  : never {
  const { ref = null, ..._props } = props as Props;

  return Object.freeze({
    type,
    key,
    ref,
    props: Object.freeze(_props),
    constructor: void 0,
  }) as any;
}

export { jsx as jsxs, jsx as jsxDEV };

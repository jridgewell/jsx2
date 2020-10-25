type FunctionComponent = import('../component').FunctionComponent;
type VNode = import('../create-element').VNode;
type FunctionComponentFiber = import('../fiber').FunctionComponentFiber;
type CoercedRenderable = import('../util/coerce-renderable').CoercedRenderable;

import { popHooksFiber, pushHooksFiber } from '../hooks';
import { coerceRenderable } from '../util/coerce-renderable';

export function renderComponentWithHooks(
  type: FunctionComponent,
  props: VNode['props'],
  fiber: FunctionComponentFiber,
): CoercedRenderable {
  pushHooksFiber(fiber);
  try {
    return coerceRenderable(type(props));
  } finally {
    popHooksFiber();
  }
}

import type { FunctionComponent } from '../component';
import type { VNode } from '../create-element';
import type { FunctionComponentFiber } from '../fiber';
import type { CoercedRenderable } from '../util/coerce-renderable';
import type { RefWork } from './ref';

import { popHooksFiber, pushHooksFiber } from '../hooks';
import { coerceRenderable } from '../util/coerce-renderable';

export function renderComponentWithHooks(
  type: FunctionComponent,
  props: VNode['props'],
  fiber: FunctionComponentFiber,
  refs: RefWork[],
): CoercedRenderable {
  pushHooksFiber(fiber, refs);
  try {
    return coerceRenderable(type(props));
  } finally {
    popHooksFiber();
  }
}

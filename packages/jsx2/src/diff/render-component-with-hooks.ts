import type { FunctionComponent } from '../component';
import type { VNode } from '../create-element';
import type { FunctionComponentFiber } from '../fiber';
import type { CoercedRenderable } from '../util/coerce-renderable';
import type { EffectState } from '../hooks';

import { popHooksFiber, pushHooksFiber } from '../hooks';
import { coerceRenderable } from '../util/coerce-renderable';

export function renderComponentWithHooks(
  type: FunctionComponent,
  props: VNode['props'],
  fiber: FunctionComponentFiber,
  layoutEffects: EffectState[]
): CoercedRenderable {
  pushHooksFiber(fiber, layoutEffects);
  try {
    return coerceRenderable(type(props));
  } finally {
    popHooksFiber();
  }
}

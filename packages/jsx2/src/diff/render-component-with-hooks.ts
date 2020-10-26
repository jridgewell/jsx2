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
  layoutEffects: EffectState[],
): CoercedRenderable {
  const { length } = layoutEffects;
  let i = 0;
  let rendered;
  fiber.current = true;
  for (; i < 25; i++) {
    pushHooksFiber(fiber, layoutEffects);
    rendered = type(props);
    popHooksFiber();

    if (!fiber.dirty) break;

    fiber.dirty = false;
    layoutEffects.length = length;
  }
  fiber.current = false;

  return coerceRenderable(rendered);
}

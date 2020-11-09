import type { FunctionComponent } from '../component';
import type { VNode } from '../create-element';
import type { FunctionComponentFiber } from '../fiber';
import type { EffectState } from '../hooks';
import type { CoercedRenderable } from '../util/coerce-renderable';

import { assert } from '../util/assert';
import { coerceRenderable } from '../util/coerce-renderable';

export type FiberState = {
  index: number;
  fiber: FunctionComponentFiber;
  layoutEffects: EffectState[];
};

let currentFiber: null | FiberState = null;

export function getCurrentFiberState(): FiberState {
  debug: assert(currentFiber !== null, 'current fiber is not assigned');
  return currentFiber;
}

export function renderComponentWithHooks(
  type: FunctionComponent<any>,
  props: VNode['props'],
  fiber: FunctionComponentFiber,
  layoutEffects: EffectState[],
): CoercedRenderable {
  const { length } = layoutEffects;
  let rendered;

  debug: assert(currentFiber === null, 'current fiber already assigned');
  currentFiber = {
    index: 0,
    fiber,
    layoutEffects,
  };
  fiber.current = true;

  for (let renderCount = 0; renderCount < 25; renderCount++) {
    // The component may have been dirtied by a component change
    fiber.dirty = false;
    rendered = type(props);

    if (!fiber.dirty) break;

    layoutEffects.length = length;
    currentFiber.index = 0;
  }

  fiber.current = false;
  currentFiber = null;

  return coerceRenderable(rendered);
}

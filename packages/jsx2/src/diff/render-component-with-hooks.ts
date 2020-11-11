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

let currentFiberState: null | FiberState = null;
const fiberStateStack: FiberState[] = [];

export function getCurrentFiberState(): FiberState {
  debug: assert(currentFiberState !== null, 'current fiber is not assigned');
  return currentFiberState;
}

export function renderComponentWithHooks(
  type: FunctionComponent<any>,
  props: VNode['props'],
  fiber: FunctionComponentFiber,
  layoutEffects: EffectState[],
): CoercedRenderable {
  const { length } = layoutEffects;
  let rendered;

  currentFiberState = {
    index: 0,
    fiber,
    layoutEffects,
  };
  fiberStateStack.push(currentFiberState);
  fiber.current = true;

  for (let renderCount = 0; renderCount < 25; renderCount++) {
    // The component may have been dirtied by a component change
    fiber.dirty = false;
    rendered = type(props);

    if (!fiber.dirty) break;

    layoutEffects.length = length;
    currentFiberState.index = 0;
  }

  fiber.current = false;
  fiberStateStack.pop();
  currentFiberState =
    fiberStateStack.length > 0 ? fiberStateStack[fiberStateStack.length - 1] : null;

  return coerceRenderable(rendered);
}

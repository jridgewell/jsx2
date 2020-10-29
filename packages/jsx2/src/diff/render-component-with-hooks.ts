import type { FunctionComponent } from '../component';
import type { VNode } from '../create-element';
import type { FunctionComponentFiber } from '../fiber';
import type { EffectState } from '../hooks';
import type { CoercedRenderable } from '../util/coerce-renderable';

import { coerceRenderable } from '../util/coerce-renderable';

type FiberState = {
  index: number;
  fiber: FunctionComponentFiber;
  layoutEffects: EffectState[];
};

const fiberStack: FiberState[] = [];

export function currentFiberState(): FiberState {
  return fiberStack[fiberStack.length - 1];
}

export function renderComponentWithHooks(
  type: FunctionComponent,
  props: VNode['props'],
  fiber: FunctionComponentFiber,
  layoutEffects: EffectState[],
): CoercedRenderable {
  const { length } = layoutEffects;
  let rendered;
  const fiberState = {
    index: 0,
    fiber,
    layoutEffects,
  };
  fiberStack.push(fiberState);
  fiber.current = true;

  for (let renderCount = 0; renderCount < 25; renderCount++) {
    rendered = type(props);

    if (!fiber.dirty) break;

    fiber.dirty = false;
    layoutEffects.length = length;
    fiberState.index = 0;
  }
  fiber.current = false;
  fiberStack.pop();

  return coerceRenderable(rendered);
}

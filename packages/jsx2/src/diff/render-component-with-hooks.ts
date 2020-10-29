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

export function pushHooksFiber(fiber: FunctionComponentFiber, layoutEffects: EffectState[]): void {
  fiberStack.push({
    index: 0,
    fiber,
    layoutEffects,
  });
}

export function popHooksFiber(): void {
  fiberStack.pop();
}

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

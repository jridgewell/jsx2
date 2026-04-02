import type { FunctionComponent } from '../component';
import type { VNode } from '../create-element';
import type { Ref } from '../create-ref';
import type { FunctionComponentFiber } from '../fiber';
import type { LayoutEffectData } from '../hooks';
import type { CoercedRenderable } from '../util/coerce-renderable';

import { SignalContextType, cleanupContext, setContext } from '../signals';
import { assert } from '../util/assert';
import { coerceRenderable } from '../util/coerce-renderable';

export type FiberState = {
  index: number;
  fiber: FunctionComponentFiber;
  layoutEffects: LayoutEffectData[];
  ref: null | Ref;
};

let currentFiberState: null | FiberState = null;

export function getCurrentFiberState(): FiberState {
  debug: assert(currentFiberState !== null, 'current fiber is not assigned');
  return currentFiberState;
}

export function renderComponentWithHooks(
  type: FunctionComponent<any>,
  props: VNode['props'],
  ref: VNode['ref'],
  fiber: FunctionComponentFiber,
  layoutEffects: LayoutEffectData[],
): CoercedRenderable {
  const { length } = layoutEffects;
  let rendered;

  const prevFiberState = currentFiberState;
  currentFiberState = {
    index: 0,
    fiber,
    layoutEffects,
    ref,
  };
  fiber.current = true;

  let context = fiber.signalContext;
  if (context === null) {
    context = fiber.signalContext = {
      type: SignalContextType.COMPONENT,
      fiber,
      dependents: new Set(),
      dependencies: new Set(),
    };
  } else {
    cleanupContext(context);
  }
  const oldContext = setContext(context);
  try {
    for (let renderCount = 0; renderCount < 25; renderCount++) {
      // The component may have been dirtied by a component change
      fiber.dirty = false;
      rendered = type(props);

      if (!fiber.dirty) break;

      layoutEffects.length = length;
      currentFiberState.index = 0;
    }
  } finally {
    setContext(oldContext);
    fiber.current = false;
    currentFiberState = prevFiberState;
  }

  return coerceRenderable(rendered);
}

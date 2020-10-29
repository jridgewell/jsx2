import type { Renderable } from '../render';

import { isArray } from './is-array';
import { isValidElement } from '../create-element';

export type CoercedRenderable = Exclude<Renderable, boolean | number | undefined>;

export function coerceRenderable(renderable: Renderable | void): CoercedRenderable {
  if (renderable == null) return null;
  if (typeof renderable === 'boolean') return null;
  if (typeof renderable === 'number') return String(renderable);
  if (typeof renderable === 'string') return renderable;

  if (isArray(renderable)) return renderable;

  if (isValidElement(renderable)) return renderable;
  return null;
}

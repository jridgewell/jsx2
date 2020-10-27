import type { Renderable } from '../render';

import { isValidElement } from '../create-element';
import { isArray } from './is-array';

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

import type { Renderable } from './render';

export function Fragment(props: Record<string, unknown>): Renderable {
  return (props as { children?: Renderable }).children;
}

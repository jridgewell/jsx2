import type { Renderable } from './render';

export type ComponentProps = Record<string, unknown>;
export type ComponentChildren = unknown;

export interface FunctionComponent<P extends ComponentProps> {
  (props: P): void | Renderable;
}

export class Component<P extends ComponentProps = any> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  render(_props: P): void | Renderable {}
}

export function isFunctionComponent<P extends ComponentProps>(
  value: Function, // eslint-disable-line @typescript-eslint/ban-types
): value is FunctionComponent<P> {
  return !value.prototype || !(value.prototype as { render?: unknown }).render;
}

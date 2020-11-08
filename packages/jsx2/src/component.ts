import type { Renderable } from './render';

export type ComponentProps = Record<string, unknown> & any;
export type ComponentChildren = any;

export interface FunctionComponent {
  (props: ComponentProps): void | Renderable;
}

export class Component {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  render(_props: ComponentProps): void | Renderable {}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunctionComponent(value: Function): value is FunctionComponent {
  return !value.prototype || !(value.prototype as { render?: unknown }).render;
}

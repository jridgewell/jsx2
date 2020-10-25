type Renderable = import('./render').Renderable;
type Props = Record<string, unknown>;

export interface FunctionComponent {
  (props: Props): void | Renderable;
}

export class Component {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  render(_props: Props): void | Renderable {}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunctionComponent(value: Function): value is FunctionComponent {
  return !value.prototype || !(value.prototype as { render?: unknown }).render;
}

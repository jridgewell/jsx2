type Renderable = import('./render').Renderable;

export interface FunctionComponent {
  (props: object): void | Renderable;
}

export class Component {
  render(props: object): void | Renderable {}
}

export function isFunctionComponent(value: Function): value is FunctionComponent {
  return !value.prototype || !(value.prototype as { render?: unknown }).render;
}

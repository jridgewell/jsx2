type Renderable<R> = import('./render').Renderable<R>;

export interface FunctionComponent<R> {
  (props: object): void | Renderable<R>;
}

export class Component<R = {}> {
  render(props: object): void | Renderable<R> {}
}

export function isFunctionComponent<R>(value: Function): value is FunctionComponent<R> {
  return !value.prototype || !(value.prototype as { render?: unknown }).render;
}

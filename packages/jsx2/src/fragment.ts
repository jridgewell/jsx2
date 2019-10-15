type Renderable<R> = import('./render').Renderable<R>;

export function Fragment(props: object): Renderable<unknown> {
  return (props as { children?: Renderable<unknown> }).children;
}

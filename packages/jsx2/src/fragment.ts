type Renderable<R> = import('./render').Renderable<R>;

export function Fragment<R>(props: object): Renderable<R> {
  return (props as { children?: Renderable<R> }).children;
}

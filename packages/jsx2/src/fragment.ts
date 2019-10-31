type Renderable = import('./render').Renderable;

export function Fragment(props: object): Renderable {
  return (props as { children?: Renderable }).children;
}

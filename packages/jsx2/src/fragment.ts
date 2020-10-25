type Renderable = import('./render').Renderable;

export function Fragment(props: Record<string, unknown>): Renderable {
  return (props as { children?: Renderable }).children;
}

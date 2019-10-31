type Fiber = import('../util/fiber').Fiber;
type CoercedRenderable = import('../util/coerce-renderable').CoercedRenderable;


export function diffTree(
  old: Fiber,
  renderable: CoercedRenderable,
): void {
  const { data } = old;
  if (data === renderable) return;
}

function renderText(old: CoercedRenderable, renderable: string, container: Node, node: Text) {

}
/*
  if (old === renderable) return;
  if (old === null) return insertElement(renderable, container, node);
  if (node === null) throw new Error('old vnode was non-null but dom node is null');

  if (typeof old === 'string') {
    return oldWasText(old, renderable, container, node as Text);
  }

  if (isArray(old)) {
    return oldWasArray(old, renderable, container, node);
  }

  if (typeof old.type === 'string') {
    return oldWasElement(old, renderable, container, node as Element);
  }

  return oldWasComponent(old, renderable, container, node);
}

function oldWasText(
  old: string,
  renderable: CoercedRenderable,
  container: Node,
  node: Text,
): void {
  if (old === renderable) return;

  if (typeof renderable !== 'string') {
    insertElement(renderable, container, node);
    remove(node);
    return;
  }

  node.data = renderable;
  mark(renderable, node, node);
}

function oldWasArray(
  old: RenderableArray,
  renderable: CoercedRenderable,
  container: Node,
  node: ChildNode,
): void {
  if (!isArray(renderable)) {
    insertElement(renderable, container, node);
    remove(node);
    return;
  }

  // TODO: Figure out key.
  const previous = node.previousSibling;
  let current = node as null | ChildNode;

  const shortest = Math.min(old.length, renderable.length);
  let i = 0;
  for (; i < shortest; i++) {
    const n = nextSibling(current!);
    diffTree(coerceRenderable(old[i]), coerceRenderable(renderable[i]), container, current);
    current = n;
  }
  for (; i < old.length; i++) {
    current = remove(current!);
  }
  for (; i < renderable.length; i++) {
    insertElement(coerceRenderable(renderable[i]), container, current);
  }

  const first = previous ? previous.nextSibling : container.firstChild;
  if (first === null) return;
  if (first === current) return;

  const last = current ? current.previousSibling! : container.lastChild!;
  mark(renderable, first, last);
}

function oldWasElement(
  old: VNode,
  renderable: CoercedRenderable,
  container: Node,
  node: Element,
): void {
  if (old === renderable) return;

  if (renderable === null || typeof renderable === 'string' || isArray(renderable)) {
    insertElement(renderable, container, node);
    remove(node);
    return;
  }

  const { type } = renderable;
  if (type !== old.type) {
    insertElement(renderable, container, node);
    remove(node);
    return;
  }

  const oldProps = old.props;
  const { props } = renderable;
  diffProps(node as HTMLElement, oldProps, props);
  diffTree(
    coerceRenderable(oldProps.children),
    coerceRenderable(props.children),
    node,
    node.firstChild,
  );
  diffRef(node, old.ref, renderable.ref);
  mark(renderable, node, node);
  return;
}

function oldWasComponent(
  old: VNode,
  renderable: CoercedRenderable,
  container: Node,
  node: ChildNode,
): void {
  if (old === renderable) return;

  if (renderable === null || typeof renderable === 'string' || isArray(renderable)) {
    insertElement(renderable, container, node);
    remove(node);
    return;
  }

  const { type } = renderable;
  if (typeof type === 'string' || type !== old.type) {
    insertElement(renderable, container, node);
    remove(node);
    return;
  }

  const { props } = renderable;
  const next = nextSibling(node);
  const component = (node as MarkedNode)._component;
  const rendered = coerceRenderable(
    isFunctionComponent(type) ? type(props) : component!.render(props),
  );

  const start = node.nextSibling!;
  const oldRendered = (start as MarkedNode)._vnode as CoercedRenderable;
  diffTree(oldRendered, rendered, container, start);

  // TODO: I think all this difficutly is caused by `render(null, Container)`
  // not inserting a comment.
  if (node.nextSibling === next) {
    container.insertBefore(start, next);
    mark(rendered, start, start);
  }

  const end = next ? next.previousSibling! : container.lastChild!;
  mark(renderable, node, end, component);
}
*/

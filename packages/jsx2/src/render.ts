type Template = import('./create-element').Template;

interface CommentMarkers {
  start: Comment;
  end: Comment;
}
interface RenderedTemplate extends Template {
  markers: CommentMarkers[];
}
interface RenderContainer extends Element {
  _jsx2_template: RenderedTemplate;
}

export default function render(template: Template, container: Element): void {
  return internalRender(template, container as RenderContainer);
}

function internalRender(template: Template, container: RenderContainer): void {
  const current = container._jsx2_template;

  if (current && current.tree === template.tree) {
    return diffExpressions(current, template);
  }
  const markers: CommentMarkers[] = [];
  container._jsx2_template = {
    ...template,
    markers
  };

  return diffTree(template, container, markers);
}

function diffExpressions(current: RenderedTemplate, template: Template): void {
  const { markers, expressions: oldExpressions } = current;
  return;
}

function diffTree(template: Template, container: RenderContainer, markers: CommentMarkers[]): void {
  return;
}

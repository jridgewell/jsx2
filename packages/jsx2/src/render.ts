type TemplateResult = import('./template-result').TemplateResult;
type Node<R> = import('./create-element').Node<R>;

export type Renderable<R> = string | number | boolean | null | undefined | Node<R> | TemplateResult;
export type Container = Element | Document | ShadowRoot | DocumentFragment;

export function render<R>(element: Renderable<R>, continer: Container): void {}

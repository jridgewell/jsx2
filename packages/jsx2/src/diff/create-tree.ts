type CoercedRenderable<R> = import('./coerce-renderable').CoercedRenderable<R>;

import { insertElement } from './insert-element';

export function createTree<R>(renderable: CoercedRenderable<R>, container: Node): void {
  container.textContent = '';
  insertElement(renderable, container, null);
}

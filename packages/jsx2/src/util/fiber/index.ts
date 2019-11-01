type Component = import('../../component').Component;
type VNode = import('../../create-element').VNode;
type CoercedRenderable = import('../coerce-renderable').CoercedRenderable;

export interface Fiber {
  data: CoercedRenderable;
  key: VNode['key'];
  dom: null | Node;
  component: null | Component;
  parent: null | Fiber;
  child: null | Fiber;
  next: null | Fiber;
}

export function fiber(data: Fiber['data']): Fiber {
  return {
    data,
    key: null,
    dom: null,
    component: null,
    parent: null,
    child: null,
    next: null,
  };
}

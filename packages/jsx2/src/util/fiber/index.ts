type Component = import('../../component').Component;
type VNode = import('../../create-element').VNode;
type CoercedRenderable = import('../coerce-renderable').CoercedRenderable;

export interface Fiber {
  data: CoercedRenderable;
  key: VNode['key'];
  dom: null | Node;
  parent: null | Fiber;
  child: null | Fiber;
  next: null | Fiber;
  component: null | Component;
}

export function fiber(key: Fiber['key'], data: Fiber['data']): Fiber {
  return {
    key,
    data,
    dom: null,
    parent: null,
    child: null,
    next: null,
    component: null,
  };
}

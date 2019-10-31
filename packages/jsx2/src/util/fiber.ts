type Component = import('../component').Component;
type VNode = import('../create-element').VNode;

type RenderedData = string | null | VNode;

export interface Fiber {
  index: number;
  data: RenderedData;
  key: VNode['key'];
  dom: null | Node;
  child: null | Fiber;
  next: null | Fiber;
  component: null | Component;
}

export function fiber(key: Fiber['key'], data: Fiber['data']): Fiber {
  return {
    key,
    data,
    index: 0,
    dom: null,
    child: null,
    next: null,
    component: null,
  };
}

import type { Component } from '../component';
import type { ElementVNode } from '../create-element';
import type { FunctionComponentVNode } from '../create-element';
import type { ClassComponentVNode } from '../create-element';
import type { RenderableArray } from '../render';
import type { Ref } from '../create-ref';
import type { HookState } from '../hooks';

export interface SharedFiber {
  parent: null | Fiber;
  child: null | Fiber;
  next: null | Fiber;
  index: number;
  depth: number;
  dirty: boolean;
}

export interface NullFiber extends SharedFiber {
  data: null;
  key: null;
  dom: null;
  stateData: null;
  component: null;
  ref: null;
}

export interface TextFiber extends SharedFiber {
  data: string;
  key: null;
  dom: null | Text;
  stateData: null;
  component: null;
  ref: null;
}

export interface ElementFiber extends SharedFiber {
  data: ElementVNode;
  key: ElementVNode['key'];
  dom: null | Element;
  stateData: null;
  component: null;
  ref: null | Ref;
}

export interface FunctionComponentFiber extends SharedFiber {
  data: FunctionComponentVNode;
  key: FunctionComponentVNode['key'];
  dom: null;
  stateData: HookState[];
  component: null;
  ref: null;
}

export interface ClassComponentFiber extends SharedFiber {
  data: ClassComponentVNode;
  key: ClassComponentVNode['key'];
  dom: null;
  stateData: null;
  component: null | Component;
  ref: null | Ref;
}

export interface ArrayFiber extends SharedFiber {
  data: RenderableArray;
  key: null;
  dom: null;
  stateData: null;
  component: null;
  ref: null;
}

export type Fiber =
  | NullFiber
  | TextFiber
  | ElementFiber
  | FunctionComponentFiber
  | ClassComponentFiber
  | ArrayFiber;

export function fiber<T extends Fiber['data']>(
  data: T,
): T extends NullFiber['data']
  ? NullFiber
  : T extends TextFiber['data']
  ? TextFiber
  : T extends ElementFiber['data']
  ? ElementFiber
  : T extends FunctionComponentFiber['data']
  ? FunctionComponentFiber
  : T extends ClassComponentFiber['data']
  ? ClassComponentFiber
  : T extends ArrayFiber['data']
  ? ArrayFiber
  : never {
  return {
    data,
    index: 0,
    depth: 0,
    dirty: false,
    key: null,
    dom: null,
    stateData: null,
    component: null,
    parent: null,
    child: null,
    next: null,
    ref: null,
  } as any;
}

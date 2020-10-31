import type { Component } from '../component';
import type { Context, ContextHolder } from '../context';
import type { ElementVNode, FunctionComponentVNode, ClassComponentVNode } from '../create-element';
import type { Ref } from '../create-ref';
import type { HookState } from '../hooks';
import type { RenderableArray } from '../render';

export interface SharedFiber {
  parent: null | Fiber;
  child: null | DiffableFiber;
  next: null | DiffableFiber;
  index: number;
  depth: number;
  dirty: boolean;
  current: boolean;
}

export interface RootFiber extends SharedFiber {
  data: Node;
  key: null;
  dom: Node;
  stateData: null;
  component: null;
  providedContexts: null;
  consumedContexts: null;
  ref: null;
}

export interface NullFiber extends SharedFiber {
  data: null;
  key: null;
  dom: null;
  stateData: null;
  component: null;
  providedContexts: null;
  consumedContexts: null;
  ref: null;
}

export interface TextFiber extends SharedFiber {
  data: string;
  key: null;
  dom: null | Text;
  stateData: null;
  component: null;
  providedContexts: null;
  consumedContexts: null;
  ref: null;
}

export interface ElementFiber extends SharedFiber {
  data: ElementVNode;
  key: ElementVNode['key'];
  dom: null | Element;
  stateData: null;
  component: null;
  providedContexts: null;
  consumedContexts: null;
  ref: null | Ref;
}

export interface FunctionComponentFiber extends SharedFiber {
  data: FunctionComponentVNode;
  key: FunctionComponentVNode['key'];
  dom: null;
  stateData: HookState[];
  component: null;
  providedContexts: null | WeakMap<Context<any>, ContextHolder<any>>;
  consumedContexts: null | ContextHolder<any>[];
  ref: null;
}

export interface ClassComponentFiber extends SharedFiber {
  data: ClassComponentVNode;
  key: ClassComponentVNode['key'];
  dom: null;
  stateData: null;
  component: null | Component;
  providedContexts: null;
  consumedContexts: null;
  ref: null | Ref;
}

export interface ArrayFiber extends SharedFiber {
  data: RenderableArray;
  key: null;
  dom: null;
  stateData: null;
  component: null;
  providedContexts: null;
  consumedContexts: null;
  ref: null;
}

export type Fiber =
  | RootFiber
  | NullFiber
  | TextFiber
  | ElementFiber
  | FunctionComponentFiber
  | ClassComponentFiber
  | ArrayFiber;

export type DiffableFiber = Exclude<Fiber, RootFiber>;

export function fiber<T extends Fiber['data']>(
  data: T,
): T extends RootFiber['data']
  ? RootFiber
  : T extends NullFiber['data']
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
    current: false,
    key: null,
    dom: null,
    stateData: null,
    component: null,
    providedContexts: null,
    consumedContexts: null,
    parent: null,
    child: null,
    next: null,
    ref: null,
  } as any;
}

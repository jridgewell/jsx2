import type { ElementFiber, FunctionComponentFiber, SignalFiber } from './fiber';
import type { EffectEffectData } from './hooks';

import { scheduleEffect } from './diff/effects';
import { enqueueDiff, enqueueProp, enqueueSignalChild } from './diff/enqueue-diff';
import { assert } from './util/assert';

export enum SignalContextEnum {
  SIGNAL = 0,
  COMPONENT = 1,
  COMPUTED = 2,
  EFFECT = 3,
  CHILD = 4,
  ATTRIBUTE = 5,
}

interface SignalLink {
  source: SignalContext;
  sink: SignalContext;
  prevDependent: SignalLink | null;
  nextDependent: SignalLink | null;
  prevDependency: SignalLink | null;
  nextDependency: SignalLink | null;
}

interface BaseContext {
  type: SignalContextEnum;
  nextDependent: SignalLink | null;
  nextDependency: SignalLink | null;
  tailDependency: SignalLink | null;
  active: boolean;
}

export interface SignalSignalContext extends BaseContext {
  type: SignalContextEnum.SIGNAL;
  fiber: null;
  dirty: false;
  state: null;
  el: null;
  name: '';
  getter: null;
  oldValue: null;
}

export interface ComponentSignalContext extends BaseContext {
  type: SignalContextEnum.COMPONENT;
  fiber: FunctionComponentFiber;
  dirty: false;
  state: null;
  el: null;
  name: '';
  getter: null;
  oldValue: null;
}

export interface ComputedSignalContext extends BaseContext {
  type: SignalContextEnum.COMPUTED;
  fiber: null;
  dirty: boolean;
  state: null;
  el: null;
  name: '';
  getter: null;
  oldValue: null;
}

export interface EffectSignalContext extends BaseContext {
  type: SignalContextEnum.EFFECT;
  fiber: null;
  dirty: false;
  state: EffectEffectData;
  el: null;
  name: '';
  getter: null;
  oldValue: null;
}

export interface ChildSignalContext extends BaseContext {
  type: SignalContextEnum.CHILD;
  fiber: SignalFiber;
  dirty: false;
  state: null;
  el: null;
  name: '';
  getter: null;
  oldValue: null;
}

export interface AttributeSignalContext extends BaseContext {
  type: SignalContextEnum.ATTRIBUTE;
  fiber: ElementFiber;
  dirty: false;
  state: null;
  el: HTMLElement | SVGElement;
  name: string;
  getter: () => unknown;
  oldValue: unknown;
}

export type SignalContext =
  | SignalSignalContext
  | ComponentSignalContext
  | ComputedSignalContext
  | EffectSignalContext
  | ChildSignalContext
  | AttributeSignalContext;

let currentContext: null | SignalContext = null;

export function getCurrentContext(): SignalContext | null {
  return currentContext;
}

export function setContext(ctx: SignalContext | null): null | SignalContext {
  const old = currentContext;
  currentContext = ctx;
  return old;
}

function cleanupLinks(link: SignalLink | null): void {
  while (link !== null) {
    const { source, prevDependency, nextDependent, prevDependent } = link;
    link = prevDependency;

    if (prevDependent) prevDependent.nextDependent = nextDependent;
    else source.nextDependent = nextDependent;

    if (nextDependent) nextDependent.prevDependent = prevDependent;
  }
}

export function cleanupContext(ctx: SignalContext): void {
  cleanupLinks(getTail(ctx.nextDependency));
  ctx.nextDependency = null;
  ctx.active = false;
}

export function linkContexts(source: SignalContext, sink: SignalContext): void {
  const { nextDependent } = source;
  const { nextDependency, tailDependency } = sink;

  if (tailDependency !== null && tailDependency.source === source) {
    debug: assert(sink === tailDependency.sink);

    sink.tailDependency = tailDependency.prevDependency;
    sink.nextDependency = tailDependency;
    tailDependency.nextDependency = nextDependency;
    if (nextDependency) nextDependency.prevDependency = tailDependency;

    return;
  }

  const link: SignalLink = {
    source,
    sink,
    prevDependent: null,
    nextDependent,
    prevDependency: null,
    nextDependency,
  };

  if (nextDependent) nextDependent.prevDependent = link;
  source.nextDependent = link;

  if (nextDependency) nextDependency.prevDependency = link;
  sink.nextDependency = link;
}

function getTail(link: SignalLink | null): SignalLink | null {
  let tail = null;
  while (link !== null) {
    tail = link;
    link = link.nextDependency;
  }
  return tail;
}

export function prepareDependencies(ctx: SignalContext): void {
  const tail = getTail(ctx.nextDependency);
  ctx.tailDependency = tail;
  ctx.nextDependency = null;
}

export function finalizeDependencies(ctx: SignalContext): void {
  const { tailDependency } = ctx;
  if (tailDependency) tailDependency.prevDependency = null;
  ctx.tailDependency = null;
  cleanupLinks(tailDependency);
}

export function notifyDependents(head: SignalLink | null): void {
  let link = head;
  while (link !== null) {
    const dep = link.sink;
    link = link.nextDependent;

    if (dep.type === SignalContextEnum.COMPONENT) {
      enqueueDiff(dep.fiber);
    } else if (dep.type === SignalContextEnum.COMPUTED) {
      if (dep.dirty) continue;
      dep.dirty = true;
      notifyDependents(dep.nextDependent);
    } else if (dep.type === SignalContextEnum.EFFECT) {
      scheduleEffect(dep.state);
    } else if (dep.type === SignalContextEnum.CHILD) {
      enqueueSignalChild(dep);
    } else if (dep.type === SignalContextEnum.ATTRIBUTE) {
      enqueueProp(dep);
    }
  }
}

export function context<T extends SignalContext['type']>(
  type: T,
): T extends SignalContextEnum.SIGNAL
  ? SignalSignalContext
  : T extends SignalContextEnum.COMPONENT
  ? ComponentSignalContext
  : T extends SignalContextEnum.COMPUTED
  ? ComputedSignalContext
  : T extends SignalContextEnum.EFFECT
  ? EffectSignalContext
  : T extends SignalContextEnum.CHILD
  ? ChildSignalContext
  : T extends SignalContextEnum.ATTRIBUTE
  ? AttributeSignalContext
  : never {
  return {
    type,
    nextDependent: null,
    nextDependency: null,
    tailDependency: null,
    active: true,
    fiber: null,
    dirty: false,
    state: null,
    el: null,
    name: '',
    getter: null,
    oldValue: null,
  } as any;
}

export function createSignal<S>(
  initial: S,
): readonly [() => S, (next: S) => void, (cb: (prev: S) => S) => void, SignalSignalContext] {
  let value = initial;
  const ctx = context(SignalContextEnum.SIGNAL);

  function getter() {
    const current = getCurrentContext();
    if (current) linkContexts(ctx, current);
    return value;
  }

  function setter(next: S) {
    if (next === value) return;
    value = next;
    notifyDependents(ctx.nextDependent);
  }

  function update(cb: (prev: S) => S) {
    setter(cb(value));
  }

  return [getter, setter, update, ctx] as const;
}

export function signal<S>(
  initial: S,
): readonly [() => S, (next: S) => void, (cb: (prev: S) => S) => void] {
  const { 0: getter, 1: setter, 2: update } = createSignal(initial);
  return [getter, setter, update];
}

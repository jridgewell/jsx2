import type { ListenerTypes } from './event';
import type { StyleTypes } from './style';
import type { VNode } from '../create-element';
import type { ElementFiber } from '../fiber';
import type { AttributeSignalContext } from '../signals';

import { diffEvent } from './event';
import { diffStyle } from './style';
import {
  SignalContextEnum,
  cleanupContext,
  context,
  finalizeDependencies,
  prepareDependencies,
  setContext,
} from '../signals';
import { assert } from '../util/assert';
import { DOM_XLINK_NAMESPACE } from '../util/namespace';

export function diffProp(
  el: HTMLElement | SVGElement,
  name: string,
  oldValue: unknown,
  newValue: unknown,
  fiber: ElementFiber,
): void {
  const { attributeSignals } = fiber;
  debug: assert(attributeSignals !== null, 'attributeSignals initialized during createTree');

  if (name === 'children' || name === 'key' || name === 'ref') return;
  if (newValue === oldValue) return;

  if (name === 'class') name = 'className';

  if (name === 'dangerouslySetInnerHTML') {
    throw new Error('dangerouslySetInnerHTML is not supported yet');
  } else if (name.startsWith('on')) {
    diffEvent(el, name, oldValue as ListenerTypes, newValue as ListenerTypes);
  } else if (typeof newValue === 'function') {
    let ctx = attributeSignals[name];

    if (!ctx) {
      ctx = context(SignalContextEnum.ATTRIBUTE);
      ctx.el = el;
      ctx.name = name;
      ctx.getter = newValue as () => unknown;
      ctx.oldValue = oldValue;
      attributeSignals[name] = ctx;
    } else {
      cleanupContext(ctx);
      ctx.getter = newValue as () => unknown;
    }

    rediffProp(ctx);
  } else {
    if (typeof oldValue === 'function') {
      const context = attributeSignals[name];
      if (context) {
        cleanupContext(context);
        attributeSignals[name] = null;
      }
    }
    applyAttr(el, name, oldValue, newValue);
  }
}

function applyAttr(
  el: HTMLElement | SVGElement,
  name: string,
  oldValue: unknown,
  newValue: unknown,
) {
  if (name === 'style') {
    diffStyle(el, oldValue as StyleTypes, newValue as StyleTypes);
  } else if (name in el) {
    (el as any)[name] = newValue == null ? '' : newValue;
  } else if (typeof newValue !== 'function') {
    let ns: Parameters<Element['setAttributeNS']>[0] = null;
    if (name.startsWith('xlink')) {
      name = 'xlink:' + name.replace(/xlink:?/, '').toLowerCase();
      ns = DOM_XLINK_NAMESPACE;
    }
    if (newValue == null || newValue === false) {
      el.removeAttribute(name);
    } else {
      el.setAttributeNS(ns, name, newValue as any);
    }
  }
}

export function rediffProp(context: AttributeSignalContext): void {
  const { el, name, getter, oldValue } = context;
  const oldContext = setContext(context);
  let newValue: unknown;
  try {
    prepareDependencies(context);
    newValue = getter();
    finalizeDependencies(context);
  } finally {
    setContext(oldContext);
  }
  applyAttr(el, name, oldValue, newValue);
  context.oldValue = newValue;
}

export function diffProps(
  el: HTMLElement | SVGElement,
  oldProps: VNode['props'],
  props: VNode['props'],
  fiber: ElementFiber,
): void {
  for (const name in oldProps) {
    if (!(name in props)) diffProp(el, name, oldProps[name], null, fiber);
  }
  for (const name in props) {
    diffProp(el, name, oldProps[name], props[name], fiber);
  }
}

export function addProps(
  el: HTMLElement | SVGElement,
  props: VNode['props'],
  fiber: ElementFiber,
): void {
  for (const name in props) {
    diffProp(el, name, null, props[name], fiber);
  }
}

export function hydrateProps(
  el: HTMLElement | SVGElement,
  props: VNode['props'],
  fiber: ElementFiber,
): void {
  for (const name in props) {
    const val = props[name];
    if (typeof val === 'function') diffProp(el, name, null, val, fiber);
  }
}

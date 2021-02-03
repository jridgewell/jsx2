import type { ListenerTypes } from './event';
import type { StyleTypes } from './style';
import type { VNode } from '../create-element';

import { diffEvent } from './event';
import { diffStyle } from './style';
import { DOM_XLINK_NAMESPACE } from '../util/namespace';

export function diffProp(
  el: HTMLElement | SVGElement,
  name: string,
  oldValue: unknown,
  newValue: unknown,
): void {
  if (name === 'children' || name === 'key' || name === 'ref') return;
  if (newValue === oldValue) return;

  if (name === 'class') name = 'className';

  if (name === 'style') {
    diffStyle(el, oldValue as StyleTypes, newValue as StyleTypes);
  } else if (name === 'dangerouslySetInnerHTML') {
    throw new Error('dangerouslySetInnerHTML is not supported yet');
  } else if (name.startsWith('on')) {
    diffEvent(el, name, oldValue as ListenerTypes, newValue as ListenerTypes);
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

export function diffProps(
  el: HTMLElement | SVGElement,
  oldProps: VNode['props'],
  props: VNode['props'],
): void {
  for (const name in oldProps) {
    if (!(name in props)) diffProp(el, name, oldProps[name], null);
  }
  for (const name in props) {
    diffProp(el, name, oldProps[name], props[name]);
  }
}

export function addProps(el: HTMLElement | SVGElement, props: VNode['props']): void {
  for (const name in props) {
    diffProp(el, name, null, props[name]);
  }
}

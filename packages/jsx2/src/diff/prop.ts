type StyleTypes = import('./style').StyleTypes;
type ListenerTypes = import('./event').ListenerTypes;
type VNode = import('../create-element').VNode;

import { diffEvent } from './event';
import { diffStyle } from './style';

export function diffProp(
  el: HTMLElement,
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
    if (newValue == null || newValue === false) {
      el.removeAttribute(name);
    } else {
      el.setAttribute(name, newValue as any);
    }
  }
}

export function diffProps(
  el: HTMLElement,
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

export function addProps(el: HTMLElement, props: VNode['props']): void {
  for (const name in props) {
    diffProp(el, name, null, props[name]);
  }
}

import { assert } from '../util/assert';

type Listener = (event: Event) => void;
type ListenerElement = HTMLElement & {
  _listeners: Record<string, null | Listener>;
};
export type ListenerTypes = null | undefined | Listener;

export function diffEvent(
  _el: HTMLElement | SVGElement,
  name: string,
  oldValue: ListenerTypes,
  newValue: ListenerTypes,
): void {
  const useCapture = name.endsWith('Capture');
  if (useCapture) {
    name = name.slice(0, -'Capture'.length);
  }

  const el = _el as ListenerElement;
  const nameLower = name.toLowerCase();
  name = (nameLower in el ? nameLower : name).slice(2);

  if (newValue) {
    if (!oldValue) {
      if (!el._listeners) el._listeners = {};
      el.addEventListener(name, listener, useCapture);
    }
    el._listeners[name] = newValue;
  } else if (oldValue) {
    el._listeners[name] = null;
    el.removeEventListener(name, listener, useCapture);
  }
}

function listener(this: ListenerElement, event: Event): void {
  const listener = this._listeners[event.type];
  debug: assert(listener !== null, `listener ${event.type} was not found`);
  listener(event);
}

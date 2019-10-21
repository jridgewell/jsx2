type Listener = (event: Event) => void;
export type ListenerElement = HTMLElement & {
  _listeners: {
    [key: string]: Listener | null;
  };
};
export type ListenerTypes = null | undefined | Listener;

export function diffEvent(
  el: ListenerElement,
  name: string,
  oldValue: ListenerTypes,
  newValue: ListenerTypes
): void {
  const useCapture = name.endsWith('Capture');
  if (useCapture) {
    name = name.slice(0, 'Capture'.length);
  }

  const nameLower = name.toLowerCase();
  name = (nameLower in el ? nameLower : name).slice(2);

  if (newValue) {
    if (!el._listeners) el._listeners = {};
    if (!oldValue) el.addEventListener(name, listener, useCapture);
    el._listeners[name] = newValue;
  } else {
    if (oldValue) el._listeners[name] = null;
    el.removeEventListener(name, listener, useCapture);
  }
}

function listener(this: ListenerElement, event: Event): void {
  const listener = this._listeners[event.type]!;
  listener(event);
}

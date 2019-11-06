type StyleObject = Record<string, unknown>;
export type StyleTypes = string | null | undefined | StyleObject;

export function diffStyle(el: HTMLElement, oldValue: StyleTypes, newValue: StyleTypes): void {
  const { style } = el;
  if (typeof newValue === 'string') {
    style.cssText = newValue;
    return;
  }

  if (typeof oldValue === 'string') {
    style.cssText = '';
  } else if (oldValue && newValue) {
    for (const s in oldValue) {
      if (!(s in newValue)) setStyle(style, s, '');
    }
  } else if (oldValue) {
    for (const s in oldValue) setStyle(style, s, '');
  }

  if (newValue) {
    for (const s in newValue) setStyle(style, s, newValue[s]);
  }
}

// Copied from Preact. Forgive me.
// https://github.com/facebook/react/blob/0f64703e/packages/react-dom/src/shared/CSSProperty.js
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

function setStyle(style: CSSStyleDeclaration, name: string, value: unknown): void {
  if (name[0] === '-') {
    style.setProperty(name, value as any);
  } else {
    (style as any)[name] =
      typeof value === 'number' && !IS_NON_DIMENSIONAL.test(name) ? `${value}px` : value;
  }
}

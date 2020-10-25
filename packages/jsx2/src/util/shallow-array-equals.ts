export function shallowArrayEquals(a: null | undefined | unknown[], b: null | undefined | unknown[]): boolean {
  if (a == null || b == null) return false;
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

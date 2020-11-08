type Nullish<T> = null | undefined | T;

export function shallowArrayEquals(a: Nullish<unknown[]>, b: Nullish<unknown[]>): boolean {
  if (a == null || b == null) return false;
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function isArray<T>(
  value: ReadonlyArray<T> | unknown
): value is ReadonlyArray<T> | Array<T> {
  return Array.isArray(value);
}

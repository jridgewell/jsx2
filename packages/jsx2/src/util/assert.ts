export function assert(condition: boolean, msg?: string): asserts condition {
  // istanbul ignore next
  if (!condition) throw new Error(msg);
}

export function assertType<T>(_value: unknown): asserts _value is T {
  // noop.
}

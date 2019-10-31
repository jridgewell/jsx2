type Ref = import('../create-ref').Ref;

export function diffRef(
  current: unknown,
  old: null | undefined | Ref,
  ref: null | undefined | Ref,
): void {
  // tslint:disable-next-line triple-equals
  if (old == ref) return;
  if (old) setRef(null, old);
  if (ref) setRef(current, ref);
}

function setRef(current: unknown, ref: Ref): void {
  if (typeof ref === 'function') {
    ref(current);
  } else {
    ref.current = current;
  }
}

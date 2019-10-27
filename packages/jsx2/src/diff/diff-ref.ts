type Ref<R> = import('../create-ref').Ref<R>;

export function diffRef<R>(
  current: R,
  old: null | undefined | Ref<R>,
  ref: null | undefined | Ref<R>,
): void {
  // tslint:disable-next-line triple-equals
  if (old == ref) return;
  if (old) setRef(null, old);
  if (ref) setRef(current, ref);
}

function setRef<R>(current: R, ref: Ref<R>): void {
  if (typeof ref === 'function') {
    ref(current);
  } else {
    ref.current = current;
  }
}

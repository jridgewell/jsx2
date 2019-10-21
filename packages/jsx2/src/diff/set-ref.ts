type Ref<R> = import('../create-ref').Ref<R>;

export function setRef<R>(ref: Ref<R>, current: R): void {
  if (typeof ref === 'function') {
    ref(current);
  } else {
    ref.current = current;
  }
}

type Ref = import('../create-ref').Ref;

export interface RefWork {
  current: unknown;
  old: null | undefined | Ref;
  ref: null | undefined | Ref;
}

export function setRef(current: unknown, ref: Ref): void {
  if (typeof ref === 'function') {
    ref(current);
  } else {
    ref.current = current;
  }
}

export function deferRef(
  refs: RefWork[],
  current: RefWork['current'],
  old: RefWork['old'],
  ref: RefWork['ref'],
): void {
  // tslint:disable-next-line triple-equals
  if (old == ref) return;
  refs.push({ current, old, ref });
}

export function applyRefs(refs: RefWork[]): void {
  for (let i = 0; i < refs.length; i++) {
    const { current, old, ref } = refs[i];
    if (old) setRef(null, old);
    if (ref) setRef(current, ref);
  }
}

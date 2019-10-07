export interface RefObject<R> {
  current: R | null;
}

export type Ref<R> = RefObject<R> | ((current: R | null) => void);

export function createRef<R>(): RefObject<R> {
  return { current: null };
}

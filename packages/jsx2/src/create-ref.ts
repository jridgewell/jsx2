// TODO: Generic-ize
export interface RefObject {
  current: any | null;
}

export type Ref = RefObject | ((current: any | null) => void);

export function createRef<T extends unknown>(): { current: null | T } {
  return { current: null };
}

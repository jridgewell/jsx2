// TODO: Generic-ize
export interface RefObject {
  current: unknown | null;
}

export type Ref = RefObject | ((current: unknown | null) => void);

export function createRef(): RefObject {
  return { current: null };
}

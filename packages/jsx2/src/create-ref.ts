// TODO: Generic-ize
export interface RefObject {
  current: any | null;
}

export type Ref = RefObject | ((current: any | null) => void);

export function createRef(): RefObject {
  return { current: null };
}

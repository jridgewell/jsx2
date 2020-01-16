// type Primitive = number | string | boolean;
type Nullish<T> = null | undefined | T;

export function equals<T extends object | Function>(a: Nullish<T>, b: Nullish<T>): boolean;
export function equals<T extends number | string | boolean>(a: Nullish<T>, b: Nullish<T>): boolean;
export function equals<T>(a: Nullish<T>, b: Nullish<T>): boolean {
  // tslint:disable-next-line triple-equals
  return a == b;
}

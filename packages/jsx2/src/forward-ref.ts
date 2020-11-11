import type { ComponentProps, FunctionComponent } from './component';
import type { Ref } from './create-ref';
import type { Renderable } from './render';

import { getCurrentFiberState } from './diff/render-component-with-hooks';

export interface ForwardFunctionComponent<P extends ComponentProps> {
  (props: P, ref: null | Ref): void | Renderable;
}

export function forwardRef<T extends ComponentProps>(
  Comp: ForwardFunctionComponent<T>,
): FunctionComponent<T> {
  return (props: T) => {
    const { ref } = getCurrentFiberState();
    return Comp(props, ref);
  };
}

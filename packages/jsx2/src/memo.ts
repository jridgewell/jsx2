import type { ComponentProps, FunctionComponent } from './component';
import type { FunctionComponentVNode } from './create-element';

import { createElement } from './create-element';
import { useRef } from './hooks';

type MemoContainer<P extends ComponentProps> = {
  vnode: FunctionComponentVNode<P>;
  props: ComponentProps;
};

function shallowObjectEquals(
  prev: Record<string, unknown>,
  props: Record<string, unknown>,
): boolean {
  for (const key in prev) {
    if (key !== '__source' && !(key in props)) return false;
  }
  for (const key in props) {
    if (key !== '__source' && prev[key] !== props[key]) return false;
  }
  return true;
}

export function memo<P extends ComponentProps>(
  Comp: FunctionComponent<P>,
  areEqual = shallowObjectEquals,
): FunctionComponent<P> {
  return (props: P) => {
    const ref = useRef<null | MemoContainer<P>>(null);
    let { current } = ref;
    if (current === null || !areEqual(current.props, props)) {
      current = ref.current = {
        props,
        vnode: createElement(Comp, props),
      };
    }
    return current.vnode;
  };
}

import type { FunctionComponentFiber } from './fiber';
import type { Renderable } from './render';

import { useContext } from './hooks';
import { getCurrentFiberState } from './diff/render-component-with-hooks';
import { enqueueDiff } from './diff/enqueue-diff';

export interface Context<T> {
  _defaultValue: T;
  Consumer: ContextConsumer<T>;
  Provider: ContextProvider<T>;
}

export type ContextHolder<T> = {
  value: T;
  consumers: FunctionComponentFiber[];
};

type ConsumerProps<T> = {
  children: (context: T) => Renderable;
};
export type ContextConsumer<T> = (props: ConsumerProps<T>) => Renderable;

type ProviderProps<T> = {
  value: T;
  children: Renderable;
};
export type ContextProvider<T> = (props: ProviderProps<T>) => Renderable;

export function createContext<T>(defaultValue: T): Context<T> {
  function Consumer(props: ConsumerProps<T>): Renderable {
    return props.children(useContext(ctx));
  }

  function Provider(props: ProviderProps<T>): Renderable {
    const { value, children } = props;
    const { fiber } = getCurrentFiberState();
    const contexts = (fiber.contexts ||= new WeakMap());
    const holder = contexts.get(ctx) as undefined | ContextHolder<T>;
    if (holder === undefined) {
      contexts.set(ctx, { value, consumers: [] });
      return children;
    }

    if (holder.value === value) {
      return children;
    }

    holder.value = value;
    const { consumers } = holder;
    for (let i = 0; i < consumers.length; i++) {
      enqueueDiff(consumers[i]);
    }
    return children;
  }

  const ctx = {
    _defaultValue: defaultValue,
    Consumer,
    Provider,
  };
  return ctx;
}

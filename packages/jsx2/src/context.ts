import type { Renderable } from './render';

import { useContext } from './hooks';
import { getCurrentFiberState } from './diff/render-component-with-hooks';

export interface Context<T> {
  _defaultValue: T,
  Consumer: ContextConsumer<T>;
  Provider: ContextProvider<T>;
}

type ConsumerProps<T> = {
  children: (context: T) => Renderable;
};
export type ContextConsumer<T> = (props: ConsumerProps<T>) => Renderable;

type ProviderProps<T> = {
  value: T,
  children: Renderable;
};
export type ContextProvider<T> = (props: ProviderProps<T>) => Renderable;

export function createContext<T>(defaultValue: T): Context<T> {
  const ctx = {
    _defaultValue: defaultValue,
    Consumer(props: ConsumerProps<T>): Renderable {
      return props.children(useContext(ctx));
    },
    Provider(props: ProviderProps<T>): Renderable {
      const { fiber } = getCurrentFiberState();
      const contexts = (fiber.contexts ||= new WeakMap());
      contexts.set(ctx as Context<unknown>, props.value);
      return props.children;
    },
  };
  return ctx;
}

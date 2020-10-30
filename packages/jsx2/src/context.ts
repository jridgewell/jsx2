import type { Renderable } from './render';

import { useContext } from './hooks';
import { getCurrentFiberState } from './diff/render-component-with-hooks';

export interface Context<T> {
  _defaultValue: T;
  Consumer: ContextConsumer<T>;
  Provider: ContextProvider<T>;
}

type Listener<T> = (value: T) => void;
export type ContextHolder<T> = {
  value: T;
  listeners: Listener<T>[];
};

export type ReverseContextHolder<T> = {
  listeners: Listener<T>[];
  set: Listener<T>;
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
  const ctx = {
    _defaultValue: defaultValue,
    Consumer(props: ConsumerProps<T>): Renderable {
      return props.children(useContext(ctx));
    },
    Provider(props: ProviderProps<T>): Renderable {
      const { value, children } = props;
      const { fiber } = getCurrentFiberState();
      const contexts = (fiber.contexts ||= new WeakMap());
      let holder = contexts.get(ctx);
      if (holder === undefined) {
        holder = {
          value,
          listeners: [],
        };
        contexts.set(ctx, holder);
      } else {
        holder.value = value;
        holder.listeners.forEach((s) => s(value));
      }
      return children;
    },
  };
  return ctx;
}

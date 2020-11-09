import type { FunctionComponentFiber } from './fiber';
import type { Renderable } from './render';

import { useContext } from './hooks';
import { enqueueDiff } from './diff/enqueue-diff';
import { getCurrentFiberState } from './diff/render-component-with-hooks';

export interface Context<T> {
  _defaultValue: T;
  Consumer: ContextConsumer<T>;
  Provider: ContextProvider<T>;
}

export type ContextHolder<T> = {
  value: T;
  context: Context<T>;
  consumers: FunctionComponentFiber[];
};

type ConsumerProps<T> = {
  children: (context: T) => Renderable;
};
export type ContextConsumer<T> = (props: ConsumerProps<T>) => Renderable;

type ProviderProps<T> = {
  value?: T;
  children?: Renderable;
};
export type ContextProvider<T> = (props: ProviderProps<T>) => Renderable;

export function createContext<T>(defaultValue: T): Context<T> {
  function Consumer(props: ConsumerProps<T>): Renderable {
    return props.children(useContext(ctx));
  }

  function Provider(props: ProviderProps<T>): Renderable {
    const { value, children } = props;
    const { fiber } = getCurrentFiberState();
    const providedContext = (fiber.providedContext ||= {
      value,
      context: ctx,
      consumers: [],
    });

    if (providedContext.value === value) {
      return children;
    }

    providedContext.value = value;
    const { consumers } = providedContext;
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

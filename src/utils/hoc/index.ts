import { ComponentType, ReactNode, createElement } from 'react';

type ConsumerType<T> = ComponentType<{
  children: (value: T) => ReactNode | null;
}>;

type HookFn<H, P extends {}, R> = (hookParams: H, props: P) => R;

export { default as withImmutablePropsToJS } from './withImmutablePropsToJS';

export const withConsumerFactory = (Consumer: ConsumerType<any>) => () => (
  Component: ComponentType<object>,
) => (props: object) =>
  createElement(Consumer, null, value =>
    createElement(Component, { ...value, ...props }),
  );

export const withHooks = <H, P extends {}, R>(hookFn: HookFn<H, P, R>) => (
  Component: ComponentType<P>,
) => (hookParams: H) => (props: P) => {
  const results = hookFn(hookParams, props);
  return createElement(Component, { ...props, ...results });
};

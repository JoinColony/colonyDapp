/* @flow */

import type { ComponentType, Node } from 'react';

import { createElement } from 'react';

type ConsumerType<T> = ComponentType<{
  children: (value: T) => ?Node,
}>;

type HookFn<H, P, R> = (hookParams: H, props: P) => R;

export {
  default as withImmutablePropsToJS,
} from './withImmutablePropsToJS.jsx';

export const withConsumerFactory = (Consumer: ConsumerType<*>) => () => (
  Component: ComponentType<Object>,
) => (props: Object) =>
  createElement(Consumer, null, value =>
    createElement(Component, { ...value, ...props }),
  );

export const withHooks = <H, P, R>(hookFn: HookFn<H, P, R>) => (
  Component: ComponentType<P>,
) => (hookParams: H) => (props: P) => {
  const results = hookFn(hookParams, props);
  return createElement(Component, { ...props, ...results });
};

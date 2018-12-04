/* @flow */

import type { ComponentType, Node } from 'react';

import { createElement } from 'react';

type ConsumerType<T> = ComponentType<{
  children: (value: T) => ?Node,
}>;

type Selector<T> = (reduxState: Object, props: Object) => T;

// eslint-disable-next-line import/prefer-default-export
export const withConsumerFactory = (Consumer: ConsumerType<*>) => () => (
  Component: ComponentType<{ [string]: any }>,
) => (props: Object) =>
  createElement(Consumer, null, value =>
    createElement(Component, { ...value, ...props }),
  );

/**
 * @method withFeatureFlags
 */
export const withFeatureFlags = (
  Component: ComponentType<{ [string]: any }>,
) => (props: Object) => createElement(Component, { ...props });

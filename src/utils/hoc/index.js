/* @flow */

import type { ComponentType, Node } from 'react';

import { createElement } from 'react';

type ConsumerType<T> = ComponentType<{
  children: (value: T) => ?Node,
}>;

export {
  default as withImmutablePropsToJS,
} from './withImmutablePropsToJS.jsx';

export const withConsumerFactory = (Consumer: ConsumerType<*>) => () => (
  Component: ComponentType<Object>,
) => (props: Object) =>
  createElement(Consumer, null, value =>
    createElement(Component, { ...value, ...props }),
  );

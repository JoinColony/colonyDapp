/* @flow */

import type { ComponentType, Node } from 'react';

import { createElement } from 'react';

import store from '../../createReduxStore';

type ConsumerType<T> = ComponentType<{
  children: (value: T) => ?Node,
}>;

type Selector<T> = (reduxState: Object, props: Object) => T;

type DependantSelector = (
  selector: Selector<any> | any,
  reduxState: Object,
  props: Object,
) => boolean;

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
) => (props: Object) => {
  const given = (
    potentialSelector: Selector<any> | any,
    dependantSelector: DependantSelector,
  ) => {
    /*
     * @NOTE I have mixed feelings about getting the state like this
     */
    const reduxState = store.getState();
    const potentialSelectorValue = potentialSelector(reduxState, props);
    if (dependantSelector && typeof dependantSelector === 'function') {
      return dependantSelector(potentialSelectorValue, reduxState, props);
    }
    return potentialSelectorValue;
  };
  return createElement(Component, { ...props, given });
};

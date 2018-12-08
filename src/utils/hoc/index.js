/* @flow */

import type { ComponentType, Node } from 'react';

import { createElement } from 'react';
import { connect } from 'react-redux';

type ConsumerType<T> = ComponentType<{
  children: (value: T) => ?Node,
}>;

type Selector<T> = (reduxState: Object, props: Object) => T;

type DependantSelector = (
  selector: Selector<any> | any,
  reduxState: Object,
  props: Object,
) => boolean;

export type Given = (
  potentialSelector: Selector<any> | any,
  dependantSelector?: DependantSelector,
) => any | boolean;

export const withConsumerFactory = (Consumer: ConsumerType<*>) => () => (
  Component: ComponentType<{ [string]: any }>,
) => (props: Object) =>
  createElement(Consumer, null, value =>
    createElement(Component, { ...value, ...props }),
  );

/**
 * @method withFeatureFlags
 */
export const withFeatureFlags = () => (
  Component: ComponentType<{ [string]: any }>,
) => (props: Object) => {
  const ConnectedComponent = connect((reduxState: Object) => ({
    given: (
      potentialSelector: Selector<any> | any,
      dependantSelector?: DependantSelector,
    ) => {
      let potentialSelectorValue = potentialSelector;
      if (potentialSelector && typeof potentialSelector === 'function') {
        potentialSelectorValue = potentialSelector(reduxState, props);
      }
      if (dependantSelector && typeof dependantSelector === 'function') {
        return dependantSelector(potentialSelectorValue, reduxState, props);
      }
      return potentialSelectorValue;
    },
  }))(Component);
  return createElement(ConnectedComponent, { ...props });
};

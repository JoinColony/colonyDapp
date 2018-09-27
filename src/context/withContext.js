/* @flow */

import { createElement } from 'react';

import { Consumer } from '../createReactContext';

/**
 * Higher order function that wraps a given component in a context consumer
 * and provides that Component access to the context via the `context` prop
 *
 * @method withContext
 *
 * @param {Node} Component The component to provide the context to
 *
 * @return {Node} The wrapped component
 */
const withContext = (Component: *) => (props: Object) =>
  createElement(Consumer, {}, value =>
    createElement(Component, { ...props, context: value }),
  );

export default withContext;

import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

const getDisplayName = Component =>
  Component.displayName || Component.name || 'Component';

/*
 * This is taken from https://github.com/tophat/with-immutable-props-to-js/blob/master/src/index.js
 * and modified such that immutable state from `combineReducers`
 * can be converted to JS.
 */
const withImmutablePropsToJS = (WrappedComponent: any) => {
  const Wrapper = props => {
    const propsJS = Object.entries(props).reduce((newProps, [key, value]) => {
      // eslint-disable-next-line no-param-reassign
      newProps[key] =
        value && typeof (value as any).toJS == 'function'
          ? (value as any).toJS()
          : value;
      return newProps;
    }, {});
    return <WrappedComponent {...propsJS} />;
  };

  Wrapper.displayName = `withImmutablePropsToJS(${getDisplayName(
    WrappedComponent,
  )})`;

  return hoistNonReactStatics(Wrapper, WrappedComponent);
};

export default withImmutablePropsToJS;

type InjectFunctionType = (*) => Object;
type CallbackFunctionType = (*, InjectFunctionType) => {};

/**
 * Lazy load route component helper
 * This will wrap the response from `webpack's` `import()` `promise`, to return a component
 * It can take an option decorator function passed in as an argument.
 *
 * @method loadRoute
 *
 * @param {Function} callback The callback function from `react-router`'s `getComponent()` method
 * @param {Function} injectFunction Component decorator function (optional)
 */
export const loadRoute = (
  callback: CallbackFunctionType,
  inject: InjectFunctionType,
) => (component: Object) => {
  if (inject) {
    return callback(null, inject(component.default));
  }
  return callback(null, component.default);
};

/**
 * A basic error catching function.
 * This will be called in the event of the code splitting promise failing
 *
 * @method errorLoadingRoute
 *
 * @param {object} err A error object resulting from an error being thrown.
 */
export const errorLoadingRoute = (err: Error) =>
  /* eslint-disable-next-line no-console */
  console.error('Component chunk loading failed', err);
/* @flow */

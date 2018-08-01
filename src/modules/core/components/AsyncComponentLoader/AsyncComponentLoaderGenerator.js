/* @flow */

import { createElement } from 'react';
import AsyncComponentLoader from './AsyncComponentLoader.jsx';

/**
 * A wrapper for the AsyncComponentLoader Component to use in non-JSX places (eg: compose() methods)
 *
 * @method AsyncComponentLoaderGenerator
 *
 * @param {[type]} loaderFn A function that returns the dynamic import call (eg: `() => import('./SomeComponent.jsx')`)
 *
 * @return {[type]} A new React component that will be lazy loaded by webpack (in Object form)
 */
const AsyncComponentLoaderGenerator = (loaderFn: () => Promise<Object>) => (
  props: Object,
) => createElement(AsyncComponentLoader, { loaderFn, ...props });

export default AsyncComponentLoaderGenerator;

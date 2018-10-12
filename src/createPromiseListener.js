/* @flow */

// Temporary fix until https://github.com/erikras/redux-promise-listener/pull/9 is in.
// eslint-disable-next-line max-len
import createReduxPromiseListener from './lib/__npmtemp/redux-promise-listener.es';

const reduxPromiseListener = createReduxPromiseListener();

export default reduxPromiseListener;

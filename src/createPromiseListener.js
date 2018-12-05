/* @flow */

import type { Middleware } from 'redux';
import type { State, Action, Config } from 'redux-promise-listener';

// Temporary fix until https://github.com/erikras/redux-promise-listener/pull/9 is in.
import createReduxPromiseListener from './lib/__npmtemp/redux-promise-listener.es';

// More specific types than in package (with generics)
export type AsyncFunction<Params, Return> = {
  asyncFunction: Params => Promise<Return>,
  unsubscribe: () => void,
};

export type PromiseListener = {
  middleware: Middleware<State, Action>,
  createAsyncFunction: <Params, Return>(
    Config,
  ) => AsyncFunction<Params, Return>,
};

const reduxPromiseListener: PromiseListener = createReduxPromiseListener();

export default reduxPromiseListener;

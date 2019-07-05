/* @flow */

import type { Middleware } from 'redux';
import type { State, Action, Config } from '@colony/redux-promise-listener';

import createReduxPromiseListener from '@colony/redux-promise-listener';

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

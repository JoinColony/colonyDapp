/* @flow */

export * from '../lib/ColonyManager/types';
export * from '../lib/database/types';
export * from './transaction';
export * from './TransactionReceipt';
export * from './RootState';

// TODO consider making this accept generics so that we can better test
// reducers: https://github.com/facebook/flow/issues/4737
export type Action = { type: string, payload: any };
export type ActionCreator = (...args: Array<any>) => Action;

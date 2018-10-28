/* @flow */

export * from './colony';
export * from './token';
export * from './transaction';
export * from './TransactionRecord';
export * from './UserRecord';
export * from './WalletRecord';

// TODO consider making this accept generics so that we can better test
// reducers: https://github.com/facebook/flow/issues/4737
export type Action = { type: string, payload: any };

/* @flow */

export * from '../lib/ColonyManager/types';
export * from '../lib/database/types';
export * from './TransactionReceipt';
export * from './RootState';

export type KeyPath = [*, *];

// TODO consider making this accept generics so that we can better test
// reducers: https://github.com/facebook/flow/issues/4737
export type Action = {
  type: string,
  payload: any,
  meta?: any,
  error?: boolean,
};

export type UniqueAction = {
  type: string,
  payload: any,
  meta: {
    id: string,
  },
  error?: boolean,
};

export type UniqueActionWithKeyPath = {
  type: string,
  payload: any,
  meta: {
    id: string,
    keyPath: KeyPath,
  },
  error?: boolean,
};

// export type UniqueAction = Action & { meta: { id: string } };

export type ActionCreator = (...args: Array<any>) => Action;

export type TakeFilter = (action: Action) => boolean;

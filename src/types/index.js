/* @flow */

export * from '../lib/ColonyManager/types';
export * from '../lib/database/types';
export * from './TransactionReceipt';

export type KeyPath = [*, *];

export type WithKeyPathDepth1 = {| keyPath: [*] |};
export type WithKeyPathDepth2 = {| keyPath: [*, *] |};

export * from './actions';
export * from './Pick';

// TODO remove
export type UniqueActionWithKeyPath = {
  type: string,
  payload: any,
  meta: {
    id: string,
    keyPath: KeyPath,
  },
  error?: boolean,
};

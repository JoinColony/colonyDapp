export * from '../lib/ColonyManager/types';
export * from '../data/types';
export * from '../lib/database/types';
export * from './keyTypes';
export * from './TransactionReceipt';
export * from './strings';
export * from './roles';

export type WithKey = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key: any;
};

export type ExcludesNull = <T>(x: T | null) => x is T;

export * from './DefaultValues';

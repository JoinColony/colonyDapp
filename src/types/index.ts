export * from '../lib/ColonyManager/types';
export * from '../data/types';
export * from '../lib/database/types';
export * from './keyTypes';
export * from './TransactionReceipt';
export * from './strings';
export * from './roles';
export * from './DefaultValues';
export * from './RecordToJS';

export type WithKey = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key: any;
};

export type ExcludesNull = <T>(x: T | null) => x is T;

// https://stackoverflow.com/questions/54607400/typescript-remove-entries-from-tuple-type
export type RemoveFirstFromTuple<T extends any[]> = T['length'] extends 0
  ? []
  : (((...b: T) => void) extends (a, ...b: infer I) => void ? I : []);

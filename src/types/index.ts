import { ReactNode } from 'react';

export * from './keyTypes';
export * from './TransactionReceipt';
export * from './domains';
export * from './DefaultValues';
export * from './RecordToJS';
export * from './context';

export type WithKey = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key: any;
};

export type ExcludesNull = <T>(x: T | null) => x is T;

// https://stackoverflow.com/questions/54607400/typescript-remove-entries-from-tuple-type
export type RemoveFirstFromTuple<T extends any[]> = T['length'] extends 0
  ? []
  : (((...b: T) => void) extends (a, ...b: infer I) => void ? I : []);

export interface DataObject<T> {
  data?: T;
  isFetching: boolean;
  error?: string;
}

export interface KeyedDataObject<T> extends DataObject<T> {
  key: string;
}

export type Address = string;

export type ENSName = string;

export type AddressOrENSName = Address | ENSName;

type PrimitiveType = string | number | boolean | null | undefined | Date;

/**
 * For messages that cannot contain JSX - use with `Intl.formatMessage()`;
 */
export type SimpleMessageValues = Record<string, PrimitiveType>;

/**
 * For messages that contain JSX - use with FormattedMessage
 */
export type ComplexMessageValues = Record<string, ReactNode>;

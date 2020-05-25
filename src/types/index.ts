import { ReactNode } from 'react';
import { BigNumberish } from 'ethers/utils';
import { ClientType, TransactionOverrides } from '@colony/colony-js';

import { TransactionEventData, TransactionMultisig } from '~immutable/index';

// FIXME get from ethers?
export type TransactionReceipt = any;

export * from './keyTypes';
// export * from './TransactionReceipt';
export * from './domains';
export * from './DefaultValues';
export * from './RecordToJS';
export * from './context';

export type WithKey = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key: any;
};

export type ExcludesNull = <T>(x: T | null) => x is T;
export type RequireProps<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// https://stackoverflow.com/questions/54607400/typescript-remove-entries-from-tuple-type
export type RemoveFirstFromTuple<T extends any[]> = T['length'] extends 0
  ? []
  : ((...b: T) => void) extends (a, ...b: infer I) => void
  ? I
  : [];

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

export type MethodParams = (string | BigNumberish | boolean)[];

export interface TxConfig {
  context: ClientType;
  group?: {
    key: string;
    id: string | string[];
    index: number;
  };
  identifier?: string;
  methodContext?: string;
  methodName: string;
  multisig?: boolean | TransactionMultisig;
  options?: TransactionOverrides;
  params?: MethodParams;
  ready?: boolean;
  parseEvents?: string[];
}

export interface TransactionResponse {
  receipt?: TransactionReceipt;
  eventData?: TransactionEventData;
  error?: Error;
}

export interface MultisigOperationJSON {
  nonce: number;
  payload: object; // MultisigOperationPayload
  signers: object; // Signers
}

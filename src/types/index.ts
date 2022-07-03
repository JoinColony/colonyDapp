import { ReactNode } from 'react';
import { TransactionReceipt } from 'ethers/providers';
import { BigNumberish } from 'ethers/utils';
import { ColonyRole, TransactionOverrides } from '@colony/colony-js';
import { MessageDescriptor } from 'react-intl';

export * from './keyTypes';
export * from './DefaultValues';
export * from './RecordToJS';
export * from './context';
export * from './colonyActions';
export * from './colonyMotions';
export * from './extensions';
export * from './user';

export type WithKey = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key: any;
};

export type ExcludesNull = <T>(x: T | null) => x is T;
export type RequireProps<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

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

export type PrimitiveType = string | number | boolean | null | undefined | Date;

/**
 * For messages that cannot contain JSX - use with `Intl.formatMessage()`;
 */
export type SimpleMessageValues = Record<string, PrimitiveType>;

/**
 * For messages that contain JSX - use with FormattedMessage
 */
export type ComplexMessageValues = Record<string, ReactNode>;

/**
 * For messages that contain both JSX and Primitive values - use with FormattedMessage directly
 */
export type UniversalMessageValues = Record<string, PrimitiveType | ReactNode>;

export type MethodParam = string | BigNumberish | boolean;
export type MethodParams = (MethodParam | MethodParam[])[];

export type ActionUserRoles = {
  id: ColonyRole;
  setTo: boolean;
};

export interface TxConfig {
  context: string;
  group?: {
    key: string;
    id: string | string[];
    index: number;
    title?: MessageDescriptor;
    titleValues?: SimpleMessageValues;
    description?: MessageDescriptor;
    descriptionValues?: SimpleMessageValues;
  };
  identifier?: string;
  methodContext?: string;
  methodName: string;
  options?: TransactionOverrides;
  params?: MethodParams;
  ready?: boolean;
  metatransaction?: boolean;
  title?: MessageDescriptor;
  titleValues?: SimpleMessageValues;
}

export interface TransactionResponse {
  receipt?: TransactionReceipt;
  eventData?: object;
  error?: Error;
}

export interface MultisigOperationJSON {
  nonce: number;
  payload: object; // MultisigOperationPayload
  signers: object; // Signers
}

export interface UserRolesForDomain {
  address: string;
  domainId: number;
  roles: ColonyRole[];
}

export interface FixedToken {
  address: Address;
  symbol: string;
  name: string;
  decimals?: number;
  iconHash?: string;
}

export enum ExtendedReduxContext {
  WrappedToken = 'WrappedToken',
  VestingSimple = 'VestingSimple',
}

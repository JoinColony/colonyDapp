import { Record } from 'immutable';
import { BigNumber } from 'ethers/utils';
import { TransactionReceipt } from 'ethers/providers';
import { ClientType, TransactionOverrides } from '@colony/colony-js';
import { MessageDescriptor } from 'react-intl';

import {
  AddressOrENSName,
  DefaultValues,
  MethodParams,
  RecordToJS,
  SimpleMessageValues,
} from '~types/index';

export enum TRANSACTION_ERRORS {
  ESTIMATE = 'ESTIMATE',
  EVENT_DATA = 'EVENT_DATA',
  RECEIPT = 'RECEIPT',
  SEND = 'SEND',
  UNSUCCESSFUL = 'UNSUCCESSFUL',
}

export enum TRANSACTION_STATUSES {
  CREATED = 'CREATED',
  READY = 'READY',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCEEDED = 'SUCCEEDED',
}

export enum TRANSACTION_METHODS {
  DeployToken = 'deployToken',
  DeployTokenViaNetwork = 'deployTokenViaNetwork',
  DeployTokenAuthority = 'deployTokenAuthority',
}

export interface TransactionError {
  type: TRANSACTION_ERRORS;
  message: string;
}

export type TransactionId = string;

export interface TransactionRecordProps {
  context: ClientType;
  createdAt: Date;
  deployedContractAddress?: string;
  error?: TransactionError;
  eventData?: object;
  from: string;
  gasLimit?: number;
  gasPrice?: BigNumber;
  group?: {
    key: string;
    id: string | string[];
    index: number;
    title?: MessageDescriptor;
    titleValues?: SimpleMessageValues;
    description?: MessageDescriptor;
    descriptionValues?: SimpleMessageValues;
  };
  hash?: string;
  id: TransactionId;
  identifier?: AddressOrENSName;
  methodContext?: string; // Context in which method is used e.g. setOneTxRole
  methodName: string;
  options: TransactionOverrides;
  params: MethodParams;
  receipt?: TransactionReceipt;
  status: TRANSACTION_STATUSES;
  loadingRelated?: boolean;
  metatransaction: boolean;
  title?: MessageDescriptor;
  titleValues?: SimpleMessageValues;
}

export type TransactionType = Readonly<TransactionRecordProps>;

const defaultValues: DefaultValues<TransactionRecordProps> = {
  // Just because we have to pick one
  context: undefined,
  createdAt: new Date(),
  deployedContractAddress: undefined,
  error: undefined,
  eventData: undefined,
  from: undefined,
  gasLimit: undefined,
  gasPrice: undefined,
  group: undefined,
  hash: undefined,
  id: undefined,
  identifier: undefined,
  methodContext: undefined,
  methodName: undefined,
  options: {},
  params: {},
  receipt: undefined,
  status: undefined,
  loadingRelated: false,
  metatransaction: false,
  title: undefined,
  titleValues: undefined,
};

export class TransactionRecord
  extends Record<TransactionRecordProps>(defaultValues)
  implements RecordToJS<TransactionType> {}

export const Transaction = (p: TransactionRecordProps) =>
  new TransactionRecord(p);

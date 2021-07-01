import { Record } from 'immutable';
import { BigNumber } from 'ethers/utils';
import { TransactionReceipt } from 'ethers/providers';
import { ClientType, TransactionOverrides } from '@colony/colony-js';

import {
  Address,
  AddressOrENSName,
  DefaultValues,
  MethodParams,
  RecordToJS,
} from '~types/index';

export enum TRANSACTION_ERRORS {
  ESTIMATE = 'ESTIMATE',
  EVENT_DATA = 'EVENT_DATA',
  MULTISIG_NONCE = 'MULTISIG_NONCE',
  MULTISIG_REFRESH = 'MULTISIG_REFRESH',
  MULTISIG_REJECT = 'MULTISIG_REJECT',
  MULTISIG_SIGN = 'MULTISIG_SIGN',
  RECEIPT = 'RECEIPT',
  SEND = 'SEND',
  UNSUCCESSFUL = 'UNSUCCESSFUL',
}

export enum TRANSACTION_STATUSES {
  CREATED = 'CREATED',
  READY = 'READY',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  MULTISIG = 'MULTISIG',
  SUCCEEDED = 'SUCCEEDED',
}

export interface TransactionError {
  type: TRANSACTION_ERRORS;
  message: string;
}

export type TransactionId = string;

export interface TransactionMultisig {
  missingSignees?: Address[];
  nonce?: number;
  payload?: object;
  requiredSignees?: Address[];
  signers?: object[];
}

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
  };
  hash?: string;
  id: TransactionId;
  identifier?: AddressOrENSName;
  methodContext?: string; // Context in which method is used e.g. setOneTxRole
  methodName: string;
  multisig?: TransactionMultisig; // Indicates tx is multisig if set
  options: TransactionOverrides;
  params: MethodParams;
  receipt?: TransactionReceipt;
  status: TRANSACTION_STATUSES;
  loadingRelated?: boolean;
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
  multisig: undefined,
  options: {},
  params: {},
  receipt: undefined,
  status: undefined,
  loadingRelated: false,
};

export class TransactionRecord
  extends Record<TransactionRecordProps>(defaultValues)
  implements RecordToJS<TransactionType> {}

export const Transaction = (p: TransactionRecordProps) =>
  new TransactionRecord(p);

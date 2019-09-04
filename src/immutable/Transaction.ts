import { $Values, $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';
import { SendOptions } from '@colony/colony-js-client';
import BigNumber from 'bn.js';

import {
  Address,
  AddressOrENSName,
  ContractContexts,
  TransactionReceipt,
} from '~types/index';

export const TRANSACTION_ERRORS = Object.freeze({
  ESTIMATE: 'ESTIMATE',
  EVENT_DATA: 'EVENT_DATA',
  MULTISIG_NONCE: 'MULTISIG_NONCE',
  MULTISIG_REFRESH: 'MULTISIG_REFRESH',
  MULTISIG_REJECT: 'MULTISIG_REJECT',
  MULTISIG_SIGN: 'MULTISIG_SIGN',
  RECEIPT: 'RECEIPT',
  SEND: 'SEND',
  UNSUCCESSFUL: 'UNSUCCESSFUL',
});

export const TRANSACTION_STATUSES = Object.freeze({
  CREATED: 'CREATED',
  READY: 'READY',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  MULTISIG: 'MULTISIG',
  SUCCEEDED: 'SUCCEEDED',
});

export type TransactionStatusType = $Values<typeof TRANSACTION_STATUSES>;

export interface TransactionError {
  type: $Values<typeof TRANSACTION_ERRORS>;
  message: string;
}

export type TransactionId = string;

export type TransactionParams = object;

export type TransactionEventData = object;

export interface TransactionMultisig {
  missingSignees?: Address[];
  nonce?: number;
  payload?: object;
  requiredSignees?: Address[];
  signers?: object[];
}

export interface TransactionRecordProps {
  context: ContractContexts;
  createdAt: Date;
  error?: TransactionError;
  eventData?: TransactionEventData;
  from: string;
  gasLimit?: number;
  gasPrice?: BigNumber;
  group?: RecordOf<{
    key: string;
    id: string | string[];
    index: number;
  }>;
  hash?: string;
  id: TransactionId;
  identifier?: AddressOrENSName;
  methodContext?: string; // Context in which method is used e.g. setOneTxRole
  methodName: string;
  multisig?: TransactionMultisig; // Indicates tx is multisig if set
  options: SendOptions;
  params: TransactionParams;
  receipt?: TransactionReceipt;
  status: TransactionStatusType;
  loadingRelated?: boolean;
}

export type TransactionType = $ReadOnly<TransactionRecordProps>;

export type TransactionRecordType = RecordOf<TransactionRecordProps>;

const defaultValues: TransactionRecordProps = {
  // Just because we have to pick one
  context: ContractContexts.NETWORK_CONTEXT,
  createdAt: new Date(),
  error: undefined,
  eventData: undefined,
  from: '',
  gasLimit: undefined,
  gasPrice: undefined,
  group: undefined,
  hash: undefined,
  id: '',
  identifier: undefined,
  methodContext: undefined,
  methodName: '',
  multisig: undefined,
  options: {},
  params: {},
  receipt: undefined,
  status: TRANSACTION_STATUSES.READY,
  loadingRelated: false,
};

export const TransactionRecord: Record.Factory<TransactionRecordProps> = Record(
  defaultValues,
);

export default TransactionRecord;

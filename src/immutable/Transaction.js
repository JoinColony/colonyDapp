/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';
import type { SendOptions } from '@colony/colony-js-client';
import type BigNumber from 'bn.js/lib/bn';

import { Record } from 'immutable';

import type {
  Address,
  AddressOrENSName,
  ColonyContext,
  TransactionReceipt,
} from '~types';

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

export type TransactionError = {|
  type: $Values<typeof TRANSACTION_ERRORS>,
  message: string,
|};

export type TransactionId = string;

export type TransactionParams = Object;

export type TransactionEventData = Object;

export type TransactionMultisig = {|
  missingSignees?: Array<Address>,
  nonce?: number,
  payload?: Object,
  requiredSignees?: Array<Address>,
  signers?: Array<Object>,
|};

type TransactionRecordProps = {|
  context: ColonyContext,
  createdAt: Date,
  error?: TransactionError,
  eventData?: TransactionEventData,
  from: string,
  gasLimit?: number,
  gasPrice?: BigNumber,
  group?: {
    key: string,
    id: string | string[],
    index: number,
  },
  hash?: string,
  id: TransactionId,
  identifier?: AddressOrENSName,
  methodContext?: string, // Context in which method is used e.g. setOneTxRole
  methodName: string,
  multisig?: TransactionMultisig, // Indicates tx is multisig if set
  options: SendOptions,
  params: TransactionParams,
  receipt?: TransactionReceipt,
  status: TransactionStatusType,
  loadingRelated?: boolean,
|};

export type TransactionType = $ReadOnly<TransactionRecordProps>;

export type TransactionRecordType = RecordOf<TransactionRecordProps>;

const defaultValues: $Shape<TransactionRecordProps> = {
  context: undefined,
  createdAt: new Date(),
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
  status: TRANSACTION_STATUSES.READY,
  loadingRelated: false,
};

const TransactionRecord: RecordFactory<TransactionRecordProps> = Record(
  defaultValues,
);

export default TransactionRecord;

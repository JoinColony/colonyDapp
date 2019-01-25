/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';
import type { SendOptions } from '@colony/colony-js-client';
import type BigNumber from 'bn.js/lib/bn';

import { Record, List } from 'immutable';
import nanoid from 'nanoid';

import type { LifecycleActionTypes } from '../modules/core/types';

import type {
  Address,
  AddressOrENSName,
  ColonyContext,
  TransactionReceipt,
} from '~types';

export type TransactionError = {
  type: 'send' | 'receipt' | 'eventData' | 'unsuccessful',
  message: string,
};

export type TransactionId = string;

export type TransactionParams = Object;

export type TransactionEventData = Object;

export type TransactionMultisig = {
  missingSignees?: Array<Address>,
  nonce?: number,
  payload?: Object,
  requiredSignees?: Array<Address>,
  signers?: Array<Object>,
};

export type TransactionProps<P: TransactionParams, E: TransactionEventData> = {|
  context?: ColonyContext,
  createdAt: Date,
  errors: List<TransactionError>,
  eventData?: E,
  gasLimit?: BigNumber,
  gasPrice?: BigNumber,
  hash?: string,
  id: TransactionId,
  identifier?: AddressOrENSName,
  lifecycle: LifecycleActionTypes,
  methodName: string,
  multisig?: TransactionMultisig, // Indicates tx is multisig if set
  options: SendOptions,
  params: P,
  receipt?: TransactionReceipt,
  status: 'created' | 'ready' | 'pending' | 'failed' | 'succeeded',
|};

export type TransactionRecord<
  P: TransactionParams,
  E: TransactionEventData,
> = RecordOf<TransactionProps<P, E>>;

const defaultValues: $Shape<TransactionProps<*, *>> = {
  context: undefined,
  createdAt: undefined,
  gasLimit: undefined,
  gasPrice: undefined,
  errors: new List(),
  eventData: undefined,
  hash: undefined,
  id: nanoid(),
  identifier: undefined,
  lifecycle: {},
  methodName: undefined,
  multisig: undefined,
  options: {},
  params: {},
  receipt: undefined,
  status: 'ready',
};

// $FlowFixMe
const Transaction: RecordFactory<TransactionProps<*, *>> = Record(
  defaultValues,
);

export default Transaction;

/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';
import type { SendOptions } from '@colony/colony-js-client';
import type BigNumber from 'bn.js/lib/bn';

import { Record, List } from 'immutable';
import nanoid from 'nanoid';

import type { LifecycleActionTypes } from '../modules/core/types';

import type { AddressOrENSName, ColonyContext } from '~types';

export type TransactionError = {
  type: 'send' | 'receipt' | 'eventData' | 'unsuccessful',
  message: string,
};

export type TransactionId = string;

export type TransactionParams = Object;

export type TransactionEventData = Object;

export type TransactionProps<P: TransactionParams, E: TransactionEventData> = {
  context?: ColonyContext,
  createdAt: Date,
  errors: List<TransactionError>,
  eventData?: E,
  hash?: string,
  id: TransactionId,
  identifier?: AddressOrENSName,
  lifecycle: LifecycleActionTypes,
  methodName: string,
  options: SendOptions,
  params: P,
  receiptReceived?: boolean,
  suggestedGasLimit?: BigNumber,
  suggestedGasPrice?: BigNumber,
};

export type TransactionRecord<
  P: TransactionParams,
  E: TransactionEventData,
> = RecordOf<TransactionProps<P, E>>;

const defaultValues: TransactionProps<*, *> = {
  context: undefined,
  createdAt: new Date(),
  errors: new List(),
  eventData: undefined,
  hash: undefined,
  id: nanoid(),
  identifier: undefined,
  lifecycle: {},
  methodName: '',
  options: {},
  params: {},
  receiptReceived: undefined,
  suggestedGasLimit: undefined,
  suggestedGasPrice: undefined,
};

const Transaction: RecordFactory<TransactionProps<*, *>> = Record(
  defaultValues,
);

export default Transaction;

/* @flow */

import type { SendOptions } from '@colony/colony-js-client';
import type BigNumber from 'bn.js';
import type { RecordOf, List } from 'immutable';

import type { LifecycleActionTypes } from '../modules/core/types';

export type TransactionError = {
  type: 'send' | 'receipt' | 'eventData',
  message: string,
};

export type TransactionId = string;

export type TransactionParams = Object;

export type TransactionEventData = Object;

export type TransactionProps<P: TransactionParams, E: TransactionEventData> = {
  actionType?: string,
  contextName: string,
  createdAt: Date,
  errors: List<TransactionError>,
  eventData?: E,
  hash?: string,
  id: TransactionId,
  lifecycleActionTypes: LifecycleActionTypes,
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

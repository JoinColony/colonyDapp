/* @flow */

import type { SendOptions } from '@colony/colony-js-client';
import type BigNumber from 'bn.js/lib/bn';
import type { RecordOf, List } from 'immutable';

import type { LifecycleActionTypes } from '../../modules/core/types';
import type {
  AddressOrENSName,
  ColonyContext,
} from '../../lib/ColonyManager/types';

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

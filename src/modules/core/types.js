/* @flow */

import type { SendOptions, ContractResponse } from '@colony/colony-js-client';
import type BigNumber from 'bn.js';
import type { Map as ImmutableMap } from 'immutable';

import type {
  TransactionEventData,
  TransactionId,
  TransactionParams,
  TransactionRecord,
} from '~types/TransactionRecord';
import type { TransactionReceipt } from '~types/index';

export type Sender<P: TransactionParams, E: TransactionEventData> = {
  client: {
    adapter: {
      provider: {
        getGasPrice: () => Promise<BigNumber>,
        on: (eventName: string, callback: Function) => void,
        removeListener: (eventName: string, callback: Function) => void,
      },
    },
  },
  send(params: P, options: SendOptions): Promise<ContractResponse<E>>,
  estimate(params: P): Promise<BigNumber>,
};

// eslint-disable-next-line flowtype/generic-spacing
export type TransactionsState = ImmutableMap<
  TransactionId,
  TransactionRecord<*, *>,
>;

export type LifecycleActionTypes = {
  created?: string,
  error?: string,
  eventDataReceived?: string,
  receiptReceived?: string,
  sent?: string,
  success?: string,
};

export type CreateTransactionAction<P: TransactionParams> = {
  type: string,
  payload: {
    contextName: string,
    lifecycleActionTypes: LifecycleActionTypes,
    methodName: string,
    options?: SendOptions,
    params: P,
  },
};

export type SendTransactionAction = {
  type: string,
  payload: {
    id: string,
  },
};

export type TransactionResponse<E: TransactionEventData> = {
  receipt?: TransactionReceipt,
  eventData?: E,
  error?: Error,
};

/* @flow */

import type { SendOptions, ContractResponse } from '@colony/colony-js-client';

import type { Map as ImmutableMap } from 'immutable';

import type {
  TransactionRecord,
  TransactionId,
} from '~types/TransactionRecord';

export type Sender<Params: Object, EventData: Object> = {
  client: {
    adapter: {
      provider: {
        on: (eventName: string, callback: Function) => void,
        removeListener: (eventName: string, callback: Function) => void,
      },
    },
  },
  send(
    params: Params,
    options: SendOptions,
  ): Promise<ContractResponse<EventData>>,
};

export type TransactionAction<Params: Object> = {
  type: string,
  payload: {
    options: SendOptions,
    params: Params,
  },
};

export type TransactionsState = ImmutableMap<TransactionId, TransactionRecord>;

export type LifecycleActionTypes = {
  started?: string,
  sent?: string,
  error?: string,
  eventDataReceived?: string,
  receiptReceived?: string,
  success?: string,
};

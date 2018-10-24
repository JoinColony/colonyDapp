/* @flow */

import type { SendOptions, ContractResponse } from '@colony/colony-js-client';

import type { Map as ImmutableMap } from 'immutable';

export type Sender<Params: Object> = {
  client: {
    adapter: {
      provider: {
        on: (eventName: string, callback: Function) => void,
        removeListener: (eventName: string, callback: Function) => void,
      },
    },
  },
  send(params: Params, options: SendOptions): Promise<ContractResponse<*>>,
};

export type TransactionAction<Params: Object> = {
  type: string,
  payload: {
    options: SendOptions,
    params: Params,
  },
};

export type TransactionError = {
  type: 'send' | 'receipt' | 'eventData',
  message: string,
};

export type TransactionId = string;

export type Transaction = {
  createdAt: Date,
  errors?: Array<TransactionError>,
  eventData?: Object,
  hash?: string,
  id: TransactionId,
  receiptReceived?: boolean,
};

export type TransactionsState = ImmutableMap<TransactionId, Transaction>;

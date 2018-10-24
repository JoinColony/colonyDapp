/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
  TRANSACTION_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SENT,
  TRANSACTION_STARTED,
} from '../actionTypes';

import type { TransactionsState, TransactionId } from '../types';

type Action = {
  type: string,
  payload: { id: TransactionId }, // `id` is required, but the type is unsealed
};

const transactionsReducer = (
  state: TransactionsState = new ImmutableMap(),
  { type, payload = {} }: Action = {},
): State => {
  switch (type) {
    case TRANSACTION_STARTED: {
      const { actionType, createdAt, id, options, params } = payload;
      return state.set(id, { id, createdAt, actionType, options, params });
    }
    case TRANSACTION_SENT: {
      const { id, hash } = payload;
      return state.set(id, { ...state.get(id), hash });
    }
    case TRANSACTION_RECEIPT_RECEIVED: {
      const { id } = payload;
      return state.set(id, { ...state.get(id), receiptReceived: true });
    }
    case TRANSACTION_EVENT_DATA_RECEIVED: {
      const { eventData, id } = payload;
      return state.set(id, { ...state.get(id), eventData });
    }
    case TRANSACTION_ERROR: {
      const { error, id } = payload;
      return state.update(id, tx => ({
        ...tx,
        errors: (tx.errors || []).concat(error),
      }));
    }
    default:
      return state;
  }
};

export default transactionsReducer;

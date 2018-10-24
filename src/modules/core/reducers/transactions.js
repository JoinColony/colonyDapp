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
  payload: { id: TransactionId } & Object, // `id` is required, but the type is unsealed
};

const transactionsReducer = (
  state: TransactionsState = new ImmutableMap(),
  { type, payload }: Action = {},
): TransactionsState => {
  switch (type) {
    case TRANSACTION_STARTED: {
      const { actionType, createdAt, id, options, params } = payload;
      return state.set(id, { id, createdAt, actionType, options, params });
    }
    case TRANSACTION_SENT: {
      const { id, hash } = payload;
      return state.setIn([id, 'hash'], hash);
    }
    case TRANSACTION_RECEIPT_RECEIVED: {
      const { id } = payload;
      return state.setIn([id, 'receiptReceived'], true);
    }
    case TRANSACTION_EVENT_DATA_RECEIVED: {
      const { eventData, id } = payload;
      return state.setIn([id, 'eventData'], eventData);
    }
    case TRANSACTION_ERROR: {
      const { error, id } = payload;
      return state.updateIn([id, 'errors'], (errors = []) =>
        errors.concat(error),
      );
    }
    default:
      return state;
  }
};

export default transactionsReducer;

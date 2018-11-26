/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
  TRANSACTION_CREATED,
  TRANSACTION_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_GAS_SET,
  TRANSACTION_GAS_SUGGESTED,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SENT,
} from '../actionTypes';

import { Transaction } from '../records';

import type { TransactionsState } from '../types';

import type { TransactionId } from '~types/TransactionRecord';

type Action = {
  type: string,
  payload: { id: TransactionId } & Object, // `id` is required, but the type is unsealed
};

const INITIAL_STATE = new ImmutableMap();

const transactionsReducer = (
  state: TransactionsState = INITIAL_STATE,
  { type, payload }: Action,
): TransactionsState => {
  switch (type) {
    case TRANSACTION_CREATED: {
      const {
        context,
        createdAt,
        id,
        identifier,
        lifecycle,
        methodName,
        options,
        params,
      } = payload;
      return state.set(
        id,
        Transaction({
          context,
          createdAt,
          id,
          identifier,
          lifecycle,
          methodName,
          options,
          params,
        }),
      );
    }
    case TRANSACTION_GAS_SUGGESTED: {
      const { id, suggestedGasLimit, suggestedGasPrice } = payload;
      return state.mergeIn([id], {
        suggestedGasLimit,
        suggestedGasPrice,
      });
    }
    case TRANSACTION_GAS_SET: {
      const { id, gasLimit, gasPrice } = payload;
      return state.mergeIn([id, 'options'], { gasLimit, gasPrice });
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
      return state.updateIn([id, 'errors'], errors => errors.push(error));
    }
    default:
      return state;
  }
};

export default transactionsReducer;

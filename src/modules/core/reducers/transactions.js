/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
  TRANSACTION_CREATED,
  TRANSACTION_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_GAS_SET,
  TRANSACTION_GAS_SUGGESTED,
  TRANSACTION_GAS_MANUAL,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SENT,
} from '../actionTypes';

import { Transaction } from '~immutable';

import type { TransactionsState } from '../types';

import type { TransactionId } from '~immutable';

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
    case TRANSACTION_GAS_MANUAL: {
      const { id, suggestedGasLimit, suggestedGasPrice } = payload;
      const manualGasValues: Object = {};
      if (suggestedGasLimit) {
        manualGasValues.suggestedGasLimit = suggestedGasLimit;
      }
      if (suggestedGasPrice) {
        manualGasValues.suggestedGasPrice = suggestedGasPrice;
      }
      return state.mergeIn([id], manualGasValues);
    }
    case TRANSACTION_SENT: {
      const { id, hash } = payload;
      return state.mergeIn([id], { hash, status: 'pending' });
    }
    case TRANSACTION_RECEIPT_RECEIVED: {
      const { id } = payload;
      return state.mergeIn([id], {
        receiptReceived: true,
        status: 'succeeded',
      });
    }
    case TRANSACTION_EVENT_DATA_RECEIVED: {
      const { eventData, id } = payload;
      return state.setIn([id, 'eventData'], eventData);
    }
    case TRANSACTION_ERROR: {
      const { error, id } = payload;
      const errorState = state.updateIn([id, 'errors'], errors =>
        errors.push(error),
      );
      return errorState.setIn([id, 'status'], 'failed');
    }
    default:
      return state;
  }
};

export default transactionsReducer;

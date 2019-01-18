/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
  TRANSACTION_CREATED,
  TRANSACTION_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_GAS_SUGGESTED,
  TRANSACTION_GAS_MANUAL,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SENT,
} from '../actionTypes';

import { Transaction } from '~immutable';

import type { UniqueAction } from '~types';

import type { TransactionsState } from '../types';

const INITIAL_STATE = new ImmutableMap();

const transactionsReducer = (
  state: TransactionsState = INITIAL_STATE,
  { type, payload, meta }: UniqueAction,
): TransactionsState => {
  switch (type) {
    case TRANSACTION_CREATED: {
      const {
        context,
        createdAt,
        identifier,
        lifecycle,
        methodName,
        options,
        params,
      } = payload;
      return state.set(
        meta.id,
        Transaction({
          context,
          createdAt,
          id: meta.id,
          identifier,
          lifecycle,
          methodName,
          options,
          params,
        }),
      );
    }
    case TRANSACTION_GAS_SUGGESTED: {
      const { id } = meta;
      const { suggestedGasLimit, suggestedGasPrice } = payload;
      return state.mergeIn([id], {
        suggestedGasLimit,
        suggestedGasPrice,
      });
    }
    case TRANSACTION_GAS_MANUAL: {
      const { id } = meta;
      const { suggestedGasLimit, suggestedGasPrice } = payload;
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
      const { id } = meta;
      const { hash } = payload;
      return state.mergeIn([id], { hash, status: 'pending' });
    }
    case TRANSACTION_RECEIPT_RECEIVED: {
      const { id } = meta;
      return state.mergeIn([id], {
        receiptReceived: true,
        status: 'succeeded',
      });
    }
    case TRANSACTION_EVENT_DATA_RECEIVED: {
      const { id } = meta;
      const { eventData } = payload;
      return state.setIn([id, 'eventData'], eventData);
    }
    case TRANSACTION_ERROR: {
      const { id } = meta;
      const { error } = payload;
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

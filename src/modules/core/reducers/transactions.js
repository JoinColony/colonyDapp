/* @flow */

import type { RecordOf, RecordFactory } from 'immutable';

import { Map as ImmutableMap, Record } from 'immutable';

import type { UniqueAction } from '~types';

import type { TransactionsStateProps } from '../types';

import { Transaction } from '~immutable';

import {
  MULTISIG_TRANSACTION_CREATED,
  MULTISIG_TRANSACTION_REFRESHED,
  TRANSACTION_CREATED,
  TRANSACTION_ERROR,
  TRANSACTION_EVENT_DATA_RECEIVED,
  TRANSACTION_GAS_UPDATE,
  TRANSACTION_RECEIPT_RECEIVED,
  TRANSACTION_SENT,
  GAS_PRICES_UPDATE,
} from '../actionTypes';

export const TransactionsState: RecordFactory<TransactionsStateProps> = Record({
  list: ImmutableMap(),
  gasPrices: {},
});

const INITIAL_STATE = TransactionsState();

const transactionsReducer = (
  state: RecordOf<TransactionsStateProps> = INITIAL_STATE,
  { type, payload, meta }: UniqueAction,
): RecordOf<TransactionsStateProps> => {
  switch (type) {
    case TRANSACTION_CREATED:
    case MULTISIG_TRANSACTION_CREATED: {
      const {
        context,
        createdAt,
        identifier,
        lifecycle,
        methodName,
        multisig,
        options,
        params,
        status,
      } = payload;
      return state.setIn(
        ['list', meta.id],
        Transaction({
          context,
          createdAt,
          id: meta.id,
          identifier,
          lifecycle,
          methodName,
          multisig,
          options,
          params,
          status,
        }),
      );
    }
    case MULTISIG_TRANSACTION_REFRESHED: {
      const { id } = meta;
      const { multisig } = payload;
      return state.mergeIn(['list', id], {
        multisig,
      });
    }
    case TRANSACTION_GAS_UPDATE: {
      const { id } = meta;
      // $FlowFixMe flow doesn't like chaining of functions???
      const newState = state.mergeIn(['list', id], payload);
      const tx = state.list.get(id);
      if (tx && (!tx.gasLimit || !tx.gasPrice)) {
        return newState.setIn(['list', id, 'status'], 'ready');
      }
      return newState;
    }
    case TRANSACTION_SENT: {
      const { id } = meta;
      const { hash } = payload;
      return state.mergeIn(['list', id], { hash, status: 'pending' });
    }
    case TRANSACTION_RECEIPT_RECEIVED: {
      const { id } = meta;
      const { receipt } = payload;
      return state.mergeIn(['list', id], {
        receipt,
      });
    }
    case TRANSACTION_EVENT_DATA_RECEIVED: {
      const { id } = meta;
      const { eventData } = payload;
      return state.mergeIn(['list', id], { eventData, status: 'succeeded' });
    }
    case TRANSACTION_ERROR: {
      const { id } = meta;
      const { error } = payload;
      return state
        .updateIn(['list', id, 'errors'], errors => errors.push(error))
        .setIn(['list', id, 'status'], 'failed');
    }
    case GAS_PRICES_UPDATE: {
      const gasPrices = payload;
      return state.set('gasPrices', gasPrices);
    }
    default:
      return state;
  }
};

export default transactionsReducer;

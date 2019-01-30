/* @flow */

import { List } from 'immutable';

import {
  USER_FETCH_TOKEN_TRANSFERS,
  USER_FETCH_TOKEN_TRANSFERS_ERROR,
  USER_FETCH_TOKEN_TRANSFERS_SUCCESS,
} from '../actionTypes';

import { ContractTransactionRecord, DataRecord } from '~immutable';

import type { CurrentUserTransactions } from '~immutable';
import type { Action } from '~types';

const currentUserTransactionsReducer = (
  state: CurrentUserTransactions = DataRecord(),
  action: Action,
) => {
  switch (action.type) {
    case USER_FETCH_TOKEN_TRANSFERS: {
      return state.set('isFetching', true);
    }
    case USER_FETCH_TOKEN_TRANSFERS_ERROR: {
      const { error } = action.payload;
      return state.merge({ error, isFetching: false });
    }
    case USER_FETCH_TOKEN_TRANSFERS_SUCCESS: {
      const { transactions } = action.payload;
      const record = List(
        transactions.map(tx => ContractTransactionRecord(tx)),
      );
      return state.merge({ record, isFetching: false });
    }
    default:
      return state;
  }
};

export default currentUserTransactionsReducer;

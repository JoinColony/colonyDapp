/* @flow */

import { List } from 'immutable';

import {
  USER_FETCH_TOKEN_TRANSFERS,
  USER_FETCH_TOKEN_TRANSFERS_ERROR,
  USER_FETCH_TOKEN_TRANSFERS_SUCCESS,
} from '../actionTypes';

import { ContractTransaction, Data } from '~immutable';

import type { DataRecord } from '~immutable';
import type { Action } from '~types';

type State = DataRecord<*>;

const INITIAL_STATE: State = Data();

const currentUserTransactionsReducer = (
  state: State = INITIAL_STATE,
  action: Action,
) => {
  switch (action.type) {
    case USER_FETCH_TOKEN_TRANSFERS: {
      return state.set('isFetching', true);
    }
    case USER_FETCH_TOKEN_TRANSFERS_ERROR: {
      const { error } = action.payload;
      return state.set('error', error).set('isFetching', false);
    }
    case USER_FETCH_TOKEN_TRANSFERS_SUCCESS: {
      const { transactions } = action.payload;
      const record = List(transactions.map(tx => ContractTransaction(tx)));
      return state.set('record', record).set('isFetching', false);
    }
    default:
      return state;
  }
};

export default currentUserTransactionsReducer;

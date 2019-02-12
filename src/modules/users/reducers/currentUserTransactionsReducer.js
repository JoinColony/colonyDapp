/* @flow */

import { List } from 'immutable';

import { ContractTransactionRecord, DataRecord } from '~immutable';
import { ACTIONS } from '~redux';

import type { CurrentUserTransactions } from '~immutable';
import type { ReducerType } from '~redux';

const currentUserTransactionsReducer: ReducerType<
  CurrentUserTransactions,
  {|
    USER_FETCH_TOKEN_TRANSFERS: *,
    USER_FETCH_TOKEN_TRANSFERS_ERROR: *,
    USER_FETCH_TOKEN_TRANSFERS_SUCCESS: *,
  |},
> = (state = DataRecord(), action) => {
  switch (action.type) {
    case ACTIONS.USER_FETCH_TOKEN_TRANSFERS: {
      return state.set('isFetching', true);
    }
    case ACTIONS.USER_FETCH_TOKEN_TRANSFERS_ERROR: {
      const { error } = action.payload;
      return state.merge({ error, isFetching: false });
    }
    case ACTIONS.USER_FETCH_TOKEN_TRANSFERS_SUCCESS: {
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

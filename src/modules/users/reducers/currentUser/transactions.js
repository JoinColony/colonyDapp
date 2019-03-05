/* @flow */

import { List } from 'immutable';

import { ContractTransactionRecord, DataRecord } from '~immutable';
import { ACTIONS } from '~redux';

import type { CurrentUserTransactionsType } from '~immutable';
import type { ReducerType } from '~redux';

const currentUserTransactionsReducer: ReducerType<
  CurrentUserTransactionsType,
  {|
    USER_TOKEN_TRANSFERS_FETCH: *,
    USER_TOKEN_TRANSFERS_FETCH_ERROR: *,
    USER_TOKEN_TRANSFERS_FETCH_SUCCESS: *,
  |},
> = (state = DataRecord(), action) => {
  switch (action.type) {
    case ACTIONS.USER_TOKEN_TRANSFERS_FETCH: {
      return state.set('isFetching', true);
    }
    case ACTIONS.USER_TOKEN_TRANSFERS_FETCH_ERROR: {
      const { message: error } = action.payload;
      return state.merge({ error, isFetching: false });
    }
    case ACTIONS.USER_TOKEN_TRANSFERS_FETCH_SUCCESS: {
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

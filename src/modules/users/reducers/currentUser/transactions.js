/* @flow */

import { List } from 'immutable';

import type { CurrentUserTransactionsType } from '~immutable';
import type { ReducerType } from '~redux';

import { ContractTransactionRecord, DataRecord } from '~immutable';
import { ACTIONS } from '~redux';
import { withDataRecord } from '~utils/reducers';

type CurrentUserTransactionsActions = {
  USER_FETCH_TOKEN_TRANSFERS: *,
  USER_FETCH_TOKEN_TRANSFERS_ERROR: *,
  USER_FETCH_TOKEN_TRANSFERS_SUCCESS: *,
};

const currentUserTransactionsReducer: ReducerType<
  CurrentUserTransactionsType,
  CurrentUserTransactionsActions,
> = (state = DataRecord(), action) => {
  switch (action.type) {
    case ACTIONS.USER_FETCH_TOKEN_TRANSFERS_SUCCESS: {
      const { transactions } = action.payload;
      return state.set(
        'record',
        List(transactions.map(tx => ContractTransactionRecord(tx))),
      );
    }
    default:
      return state;
  }
};

export default withDataRecord<
  CurrentUserTransactionsType,
  CurrentUserTransactionsActions,
>(ACTIONS.USER_FETCH_TOKEN_TRANSFERS)(currentUserTransactionsReducer);

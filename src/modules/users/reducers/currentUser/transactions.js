/* @flow */

import { List } from 'immutable';

import type { CurrentUserTransactionsType } from '~immutable';
import type { ReducerType } from '~redux';

import { ContractTransactionRecord, DataRecord } from '~immutable';
import { ACTIONS } from '~redux';
import { withDataRecord } from '~utils/reducers';

type CurrentUserTransactionsActions = {
  USER_TOKEN_TRANSFERS_FETCH: *,
  USER_TOKEN_TRANSFERS_FETCH_ERROR: *,
  USER_TOKEN_TRANSFERS_FETCH_SUCCESS: *,
};

const currentUserTransactionsReducer: ReducerType<
  CurrentUserTransactionsType,
  CurrentUserTransactionsActions,
> = (state = DataRecord(), action) => {
  switch (action.type) {
    case ACTIONS.USER_TOKEN_TRANSFERS_FETCH_SUCCESS: {
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
>(ACTIONS.USER_TOKEN_TRANSFERS_FETCH)(currentUserTransactionsReducer);

/* @flow */

import type { List as ListType } from 'immutable';

import { Map as ImmutableMap, List } from 'immutable';

import {
  COLONY_FETCH_TRANSACTIONS,
  COLONY_FETCH_TRANSACTIONS_SUCCESS,
} from '../actionTypes';

import { ContractTransaction, Data } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { UniqueActionWithKeyPath } from '~types';
import type {
  AdminTransactionsState,
  ContractTransactionRecord,
} from '~immutable';

const adminTransactionsReducer = (
  state: AdminTransactionsState = ImmutableMap(),
  action: UniqueActionWithKeyPath,
) => {
  switch (action.type) {
    case COLONY_FETCH_TRANSACTIONS_SUCCESS: {
      const {
        payload: transactions,
        meta: {
          keyPath: [colonyENSName],
        },
      } = action;
      return state.mergeIn(
        [colonyENSName],
        Data<ListType<ContractTransactionRecord>>({
          record: List(transactions.map(tx => ContractTransaction(tx))),
        }),
      );
    }
    default:
      return state;
  }
};

export default withDataReducer<
  AdminTransactionsState,
  ContractTransactionRecord,
>(COLONY_FETCH_TRANSACTIONS, ImmutableMap())(adminTransactionsReducer);

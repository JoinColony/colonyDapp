/* @flow */

import type { List as ListType } from 'immutable';

import { Map as ImmutableMap, List } from 'immutable';

import {
  COLONY_FETCH_TRANSACTIONS,
  COLONY_FETCH_TRANSACTIONS_SUCCESS,
} from '../actionTypes';

import { ContractTransactionRecord, DataRecord } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { UniqueActionWithKeyPath } from '~types';
import type {
  AdminTransactionsState,
  ContractTransactionRecordType,
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
        DataRecord<ListType<ContractTransactionRecordType>>({
          record: List(transactions.map(tx => ContractTransactionRecord(tx))),
        }),
      );
    }
    default:
      return state;
  }
};

export default withDataReducer<
  AdminTransactionsState,
  ContractTransactionRecordType,
>(COLONY_FETCH_TRANSACTIONS, ImmutableMap())(adminTransactionsReducer);

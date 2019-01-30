/* @flow */

import type { List as ListType } from 'immutable';

import { Map as ImmutableMap, List } from 'immutable';

import {
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS_SUCCESS,
} from '../actionTypes';

import { ContractTransactionRecord, DataRecord } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { UniqueActionWithKeyPath } from '~types';
import type {
  AdminUnclaimedTransactionsState,
  ContractTransactionRecordType,
} from '~immutable';

const colonyUnclaimedTransactionsReducer = (
  state: AdminUnclaimedTransactionsState = ImmutableMap(),
  action: UniqueActionWithKeyPath,
): AdminUnclaimedTransactionsState => {
  switch (action.type) {
    case COLONY_FETCH_UNCLAIMED_TRANSACTIONS_SUCCESS: {
      const {
        meta: {
          keyPath: [colonyENSName],
        },
        payload: transactions,
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
  AdminUnclaimedTransactionsState,
  ContractTransactionRecordType,
>(COLONY_FETCH_UNCLAIMED_TRANSACTIONS, ImmutableMap())(
  colonyUnclaimedTransactionsReducer,
);

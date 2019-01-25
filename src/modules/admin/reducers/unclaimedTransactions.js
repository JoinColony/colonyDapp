/* @flow */

import type { List as ListType } from 'immutable';

import { Map as ImmutableMap, List } from 'immutable';

import {
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS_SUCCESS,
} from '../actionTypes';

import { ContractTransaction, Data } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { ENSName, UniqueActionWithKeyPath } from '~types';
import type {
  AdminUnclaimedTransactionsState,
  ContractTransactionRecord,
} from '~immutable';

const colonyUnclaimedTransactionsReducer = (
  state: AdminUnclaimedTransactionsState = new ImmutableMap(),
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
        Data({
          record: List(transactions.map(tx => ContractTransaction(tx))),
        }),
      );
    }
    default:
      return state;
  }
};

export default withDataReducer<ENSName, ListType<ContractTransactionRecord>>(
  COLONY_FETCH_UNCLAIMED_TRANSACTIONS,
)(colonyUnclaimedTransactionsReducer);

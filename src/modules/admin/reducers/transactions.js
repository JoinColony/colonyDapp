/* @flow */

import type { List as ListType } from 'immutable';

import { Map as ImmutableMap, List } from 'immutable';

import { ContractTransactionRecord, DataRecord } from '~immutable';
import { withDataRecordMap } from '~utils/reducers';
import { ACTIONS } from '~redux';

import type {
  AdminTransactionsState,
  ContractTransactionRecordType,
} from '~immutable';
import type { ReducerType } from '~redux';

const adminTransactionsReducer: ReducerType<
  AdminTransactionsState,
  {| COLONY_TRANSACTIONS_FETCH_SUCCESS: * |},
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.COLONY_TRANSACTIONS_FETCH_SUCCESS: {
      const {
        payload: { transactions },
        meta: { key },
      } = action;
      return state.set(
        key,
        DataRecord<ListType<ContractTransactionRecordType>>({
          record: List(transactions.map(tx => ContractTransactionRecord(tx))),
        }),
      );
    }
    default:
      return state;
  }
};

export default withDataRecordMap<
  AdminTransactionsState,
  ContractTransactionRecordType,
>(ACTIONS.COLONY_TRANSACTIONS_FETCH, ImmutableMap())(adminTransactionsReducer);

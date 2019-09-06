import { List as ListType, Map as ImmutableMap, List, fromJS } from 'immutable';

import {
  AdminUnclaimedTransactionsState,
  ContractTransaction,
  ContractTransactionRecord,
  DataRecord,
} from '~immutable/index';
import { withDataRecordMap } from '~utils/reducers';
import { ActionTypes, ReducerType } from '~redux/index';

const colonyUnclaimedTransactionsReducer: ReducerType<
  AdminUnclaimedTransactionsState
> = (state = ImmutableMap(), action): AdminUnclaimedTransactionsState => {
  switch (action.type) {
    case ActionTypes.COLONY_UNCLAIMED_TRANSACTIONS_FETCH_SUCCESS: {
      const {
        payload: { transactions },
        meta: { key },
      } = action;
      return state.set(
        key,
        DataRecord<ListType<ContractTransactionRecord>>({
          record: List(transactions.map(tx => ContractTransaction(fromJS(tx)))),
        }),
      );
    }
    default:
      return state;
  }
};

export default withDataRecordMap<
  AdminUnclaimedTransactionsState,
  ContractTransactionRecord
>(ActionTypes.COLONY_UNCLAIMED_TRANSACTIONS_FETCH, ImmutableMap())(
  colonyUnclaimedTransactionsReducer,
);

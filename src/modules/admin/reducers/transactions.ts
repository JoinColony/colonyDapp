import { List as ListType, Map as ImmutableMap, List, fromJS } from 'immutable';

import {
  ContractTransaction,
  FetchableData,
  ContractTransactionRecord,
} from '~immutable/index';
import { withFetchableDataMap } from '~utils/reducers';
import { ActionTypes, ReducerType } from '~redux/index';

import { AdminTransactionsState } from '../state/index';

const adminTransactionsReducer: ReducerType<AdminTransactionsState> = (
  state = ImmutableMap() as AdminTransactionsState,
  action,
) => {
  switch (action.type) {
    case ActionTypes.COLONY_TRANSACTIONS_FETCH_SUCCESS: {
      const {
        payload: { transactions },
        meta: { key },
      } = action;
      return state.set(
        key,
        FetchableData<ListType<ContractTransactionRecord>>({
          record: List(transactions.map(tx => ContractTransaction(fromJS(tx)))),
        }),
      );
    }
    default:
      return state;
  }
};

export default withFetchableDataMap<
  AdminTransactionsState,
  ContractTransactionRecord
>(
  ActionTypes.COLONY_TRANSACTIONS_FETCH,
  ImmutableMap() as AdminTransactionsState,
)(adminTransactionsReducer);

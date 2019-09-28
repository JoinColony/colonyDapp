import { List as ListType, Map as ImmutableMap, List, fromJS } from 'immutable';

import {
  ContractTransaction,
  ContractTransactionRecord,
  FetchableData,
} from '~immutable/index';
import { withFetchableDataMap } from '~utils/reducers';
import { ActionTypes, ReducerType } from '~redux/index';

import { AdminUnclaimedTransactionsState } from '../state/index';

const colonyUnclaimedTransactionsReducer: ReducerType<
  AdminUnclaimedTransactionsState
> = (
  state = ImmutableMap() as AdminUnclaimedTransactionsState,
  action,
): AdminUnclaimedTransactionsState => {
  switch (action.type) {
    case ActionTypes.COLONY_UNCLAIMED_TRANSACTIONS_FETCH_SUCCESS: {
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
  AdminUnclaimedTransactionsState,
  ContractTransactionRecord
>(
  ActionTypes.COLONY_UNCLAIMED_TRANSACTIONS_FETCH,
  ImmutableMap() as AdminUnclaimedTransactionsState,
)(colonyUnclaimedTransactionsReducer);

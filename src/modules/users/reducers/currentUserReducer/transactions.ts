import { List, fromJS } from 'immutable';

import {
  ContractTransaction,
  ContractTransactionRecord,
  FetchableData,
} from '~immutable/index';
import { ReducerType, ActionTypes } from '~redux/index';
import { withFetchableData } from '~utils/reducers';
import { FetchableContractTransactionList } from '../../../admin/state';

const currentUserTransactionsReducer: ReducerType<
  FetchableContractTransactionList
> = (state = FetchableData() as FetchableContractTransactionList, action) => {
  switch (action.type) {
    case ActionTypes.USER_TOKEN_TRANSFERS_FETCH_SUCCESS: {
      const { transactions } = action.payload;
      return state.set(
        'record',
        List<ContractTransactionRecord>(
          transactions.map(tx => ContractTransaction(fromJS(tx))),
        ),
      );
    }
    default:
      return state;
  }
};

export default withFetchableData<FetchableContractTransactionList>(
  ActionTypes.USER_TOKEN_TRANSFERS_FETCH,
)(currentUserTransactionsReducer);

import { List, fromJS } from 'immutable';

import {
  CurrentUserTransactionsType,
  ContractTransaction,
  ContractTransactionRecord,
  FetchableData,
} from '~immutable/index';
import { ReducerType, ActionTypes } from '~redux/index';
import { withFetchableData } from '~utils/reducers';

const currentUserTransactionsReducer: ReducerType<
  CurrentUserTransactionsType
> = (state = FetchableData(), action) => {
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

export default withFetchableData<CurrentUserTransactionsType>(
  ActionTypes.USER_TOKEN_TRANSFERS_FETCH,
)(currentUserTransactionsReducer);

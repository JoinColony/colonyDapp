import { List, fromJS } from 'immutable';

import {
  CurrentUserTransactionsType,
  ContractTransactionRecord,
  ContractTransactionRecordType,
  DataRecord,
} from '~immutable/index';
import { ReducerType, ActionTypes } from '~redux/index';
import { withDataRecord } from '~utils/reducers';

const currentUserTransactionsReducer: ReducerType<
  CurrentUserTransactionsType
> = (state = DataRecord(), action) => {
  switch (action.type) {
    case ActionTypes.USER_TOKEN_TRANSFERS_FETCH_SUCCESS: {
      const { transactions } = action.payload;
      return state.set(
        'record',
        List<ContractTransactionRecordType>(
          transactions.map(tx => ContractTransactionRecord(fromJS(tx))),
        ),
      );
    }
    default:
      return state;
  }
};

export default withDataRecord<CurrentUserTransactionsType>(
  ActionTypes.USER_TOKEN_TRANSFERS_FETCH,
)(currentUserTransactionsReducer);

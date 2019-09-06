import { List, fromJS } from 'immutable';

import {
  CurrentUserTokensType,
  FetchableData,
  TokenReferenceRecord,
  TokenReferenceRecordType,
} from '~immutable/index';
import { ReducerType, ActionTypes } from '~redux/index';

import { withFetchableData } from '~utils/reducers';

const currentUserTokensReducer: ReducerType<CurrentUserTokensType> = (
  state = FetchableData(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.USER_TOKENS_FETCH_SUCCESS: {
      const { tokens } = action.payload;
      return state.set(
        'record',
        List<TokenReferenceRecordType>(
          tokens.map(token => TokenReferenceRecord(fromJS(token))),
        ),
      );
    }
    default:
      return state;
  }
};

export default withFetchableData<CurrentUserTokensType>(
  ActionTypes.USER_TOKENS_FETCH,
)(currentUserTokensReducer);

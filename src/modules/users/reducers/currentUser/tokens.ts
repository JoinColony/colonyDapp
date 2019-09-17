import { List, fromJS } from 'immutable';

import {
  FetchableData,
  TokenReference,
  TokenReferenceRecord,
} from '~immutable/index';
import { ReducerType, ActionTypes } from '~redux/index';
import { withFetchableData } from '~utils/reducers';

import { CurrentUserTokensType } from '../../state/index';

const currentUserTokensReducer: ReducerType<CurrentUserTokensType> = (
  state = FetchableData(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.USER_TOKENS_FETCH_SUCCESS: {
      const { tokens } = action.payload;
      return state.set(
        'record',
        List<TokenReferenceRecord>(
          tokens.map(token => TokenReference(fromJS(token))),
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

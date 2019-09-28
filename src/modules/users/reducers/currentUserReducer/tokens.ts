import { List, fromJS } from 'immutable';

import {
  FetchableData,
  UserTokenReference,
  UserTokenReferenceRecord,
} from '~immutable/index';
import { ReducerType, ActionTypes } from '~redux/index';
import { withFetchableData } from '~utils/reducers';

import { CurrentUserTokensType } from '../../state/index';

const currentUserTokensReducer: ReducerType<CurrentUserTokensType> = (
  state = FetchableData() as CurrentUserTokensType,
  action,
) => {
  switch (action.type) {
    case ActionTypes.USER_TOKENS_FETCH_SUCCESS: {
      const { tokens } = action.payload;
      return state.set(
        'record',
        List<UserTokenReferenceRecord>(
          tokens.map(token => UserTokenReference(fromJS(token))),
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

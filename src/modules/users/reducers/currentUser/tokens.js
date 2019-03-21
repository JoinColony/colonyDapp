/* @flow */

import { List } from 'immutable';

import type { CurrentUserTokensType } from '~immutable';
import type { ReducerType } from '~redux';

import { DataRecord, TokenReferenceRecord } from '~immutable';
import { ACTIONS } from '~redux';
import { withDataRecord } from '~utils/reducers';

type CurrentUserTokensActions = {
  USER_TOKENS_FETCH: *,
  USER_TOKENS_FETCH_ERROR: *,
  USER_TOKENS_FETCH_SUCCESS: *,
};

const currentUserTokensReducer: ReducerType<
  CurrentUserTokensType,
  CurrentUserTokensActions,
> = (state = DataRecord(), action) => {
  switch (action.type) {
    case ACTIONS.USER_TOKENS_FETCH_SUCCESS: {
      const { tokens } = action.payload;
      return state.set(
        'record',
        List(tokens.map(token => TokenReferenceRecord(token))),
      );
    }
    default:
      return state;
  }
};

export default withDataRecord<CurrentUserTokensType, CurrentUserTokensActions>(
  ACTIONS.USER_TOKENS_FETCH,
)(currentUserTokensReducer);

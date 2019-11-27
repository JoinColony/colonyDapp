import { Map as ImmutableMap, fromJS } from 'immutable';

import { withFetchableDataMap } from '~utils/reducers';
import { User, UserProfile, UserRecord } from '~immutable/index';
import { ActionTypes, ReducerType } from '~redux/index';

import { UsersMap } from '../state/index';

const userProfilesReducer: ReducerType<UsersMap> = (
  state = ImmutableMap() as UsersMap,
  action,
) => {
  switch (action.type) {
    case ActionTypes.USER_FETCH_SUCCESS: {
      const {
        meta: { key },
        payload,
      } = action;
      const profile = UserProfile(fromJS(payload));
      const recordPath = [key, 'record'];
      return state.getIn(recordPath)
        ? state.setIn([...recordPath, 'profile'], profile)
        : state.setIn(recordPath, User({ profile }));
    }

    case ActionTypes.USER_AVATAR_UPLOAD_SUCCESS: {
      const { hash, address } = action.payload;
      return state.setIn([address, 'record', 'profile', 'avatarHash'], hash);
    }

    case ActionTypes.USER_SUB_EVENTS: {
      const {
        payload,
        payload: { walletAddress },
      } = action;
      const profile = UserProfile(payload);
      const recordPath = [walletAddress, 'record'];
      return state.getIn(recordPath)
        ? state
            .setIn([walletAddress, 'isFetching'], false)
            .setIn([...recordPath, 'profile'], profile)
        : state
            .setIn([walletAddress, 'isFetching'], false)
            .setIn(recordPath, User({ profile }));
    }

    default:
      return state;
  }
};

export default withFetchableDataMap<UsersMap, UserRecord>(
  new Set([ActionTypes.USER_FETCH, ActionTypes.USER_SUB_START]),
  ImmutableMap() as UsersMap,
)(userProfilesReducer);

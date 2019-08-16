import { Map as ImmutableMap, fromJS } from 'immutable';

import { withDataRecordMap } from '~utils/reducers';
import {
  UserRecord,
  UserProfileRecord,
  DataRecord,
  UserRecordType,
  UsersMap,
} from '~immutable/index';
import { ActionTypes, ReducerType } from '~redux/index';

const userProfilesReducer: ReducerType<UsersMap> = (
  state = ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.CURRENT_USER_CREATE: {
      const { profileData, walletAddress, balance } = action.payload;
      return state.mergeDeepIn(
        [walletAddress],
        DataRecord({
          error: undefined,
          lastFetchedAt: new Date(),
          record: UserRecord({
            profile: UserProfileRecord(
              fromJS({
                ...profileData,
                walletAddress,
                balance,
              }),
            ),
          }),
        }),
      );
    }

    case ActionTypes.USER_PROFILE_UPDATE_SUCCESS: {
      const { walletAddress, ...profile } = action.payload;
      return state.mergeDeepIn([walletAddress, 'record', 'profile'], profile);
    }

    case ActionTypes.USER_FETCH_SUCCESS: {
      const {
        meta: { key },
        payload,
      } = action;
      const profile = UserProfileRecord(fromJS(payload));
      const recordPath = [key, 'record'];
      return state.getIn(recordPath)
        ? state.setIn([...recordPath, 'profile'], profile)
        : state.setIn(recordPath, UserRecord({ profile }));
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
      const profile = UserProfileRecord(payload);
      const recordPath = [walletAddress, 'record'];
      return state.getIn(recordPath)
        ? state.setIn([...recordPath, 'profile'], profile)
        : state
            .setIn([walletAddress, 'isFetching'], false)
            .setIn(recordPath, UserRecord({ profile }));
    }

    default:
      return state;
  }
};

export default withDataRecordMap<UsersMap, UserRecordType>(
  new Set([ActionTypes.USER_FETCH, ActionTypes.USER_SUB_START]),
  ImmutableMap(),
)(userProfilesReducer);

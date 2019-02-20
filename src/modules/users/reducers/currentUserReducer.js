/* @flow */

import type { List as ListType } from 'immutable';

import { fromJS, List } from 'immutable';

import { UserRecord, UserProfileRecord, UserActivityRecord } from '~immutable';
import { ACTIONS } from '~redux';

import type { UserRecordType, UserActivityRecordType } from '~immutable';
import type { ReducerType } from '~redux';

type State = UserRecordType | null;

const INITIAL_STATE = null;

// TODO consider using `withDataReducer` here
const currentUserReducer: ReducerType<
  State,
  {|
    CURRENT_USER_CREATE: *,
    CURRENT_USER_GET_BALANCE_SUCCESS: *,
    USER_ACTIVITIES_FETCH_SUCCESS: *,
    USER_ACTIVITIES_UPDATE_SUCCESS: *,
    USER_PROFILE_UPDATE_SUCCESS: *,
    USER_REMOVE_AVATAR_SUCCESS: *,
    USER_UPLOAD_AVATAR_SUCCESS: *,
    USERNAME_CREATE_SUCCESS: *,
  |},
> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONS.CURRENT_USER_CREATE: {
      const { profileData, walletAddress, balance } = action.payload;
      return UserRecord({
        profile: UserProfileRecord({ ...profileData, walletAddress, balance }),
      });
    }
    case ACTIONS.USER_ACTIVITIES_UPDATE_SUCCESS: {
      const { activities } = action.payload;
      const activitiesList: ListType<UserActivityRecordType> = List.of(
        ...activities.map(activity => UserActivityRecord(activity)),
      );
      return state ? state.set('activities', activitiesList) : state;
    }
    case ACTIONS.USER_ACTIVITIES_FETCH_SUCCESS: {
      const { activities, walletAddress } = action.payload;
      const activitiesList: ListType<UserActivityRecordType> = List.of(
        ...activities.map(activity => UserActivityRecord(activity)),
      );
      return state &&
        state.getIn(['profile', 'walletAddress']) === walletAddress
        ? state.set('activities', activitiesList)
        : state;
    }
    case ACTIONS.USER_PROFILE_UPDATE_SUCCESS: {
      return state
        ? state.mergeDeepIn(['profile'], fromJS(action.payload))
        : state;
    }
    case ACTIONS.USERNAME_CREATE_SUCCESS: {
      const {
        params: { username },
      } = action.payload;
      return state ? state.setIn(['profile', 'username'], username) : state;
    }
    case ACTIONS.USER_UPLOAD_AVATAR_SUCCESS: {
      const { hash } = action.payload;
      return state ? state.setIn(['profile', 'avatar'], hash) : state;
    }
    case ACTIONS.USER_REMOVE_AVATAR_SUCCESS: {
      return state ? state.setIn(['profile', 'avatar'], undefined) : state;
    }
    case ACTIONS.CURRENT_USER_GET_BALANCE_SUCCESS: {
      const { balance } = action.payload;
      return state ? state.setIn(['profile', 'balance'], balance) : state;
    }
    default:
      return state;
  }
};

export default currentUserReducer;

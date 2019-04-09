/* @flow */

import { fromJS } from 'immutable';

import { UserProfileRecord } from '~immutable';
import { ACTIONS } from '~redux';

import type { UserProfileRecordType } from '~immutable';
import type { ReducerType } from '~redux';

const currentUserProfileReducer: ReducerType<
  UserProfileRecordType,
  {|
    CURRENT_USER_CREATE: *,
    CURRENT_USER_GET_BALANCE_SUCCESS: *,
    USER_PROFILE_UPDATE_SUCCESS: *,
    USER_REMOVE_AVATAR_SUCCESS: *,
    USER_UPLOAD_AVATAR_SUCCESS: *,
    USERNAME_CREATE_SUCCESS: *,
  |},
> = (state = UserProfileRecord(), action) => {
  switch (action.type) {
    case ACTIONS.CURRENT_USER_CREATE: {
      const { profileData, walletAddress, balance } = action.payload;
      return UserProfileRecord({ ...profileData, walletAddress, balance });
    }
    case ACTIONS.USER_PROFILE_UPDATE_SUCCESS: {
      return state.mergeDeep(fromJS(action.payload));
    }
    case ACTIONS.USERNAME_CREATE_SUCCESS: {
      const {
        params: { username },
      } = action.payload;
      return state.set('username', username);
    }
    case ACTIONS.USER_UPLOAD_AVATAR_SUCCESS: {
      const { hash } = action.payload;
      return state.set('avatarHash', hash);
    }
    case ACTIONS.USER_REMOVE_AVATAR_SUCCESS: {
      return state.delete('avatarHash');
    }
    case ACTIONS.CURRENT_USER_GET_BALANCE_SUCCESS: {
      const { balance } = action.payload;
      return state.set('balance', balance);
    }
    default:
      return state;
  }
};

export default currentUserProfileReducer;

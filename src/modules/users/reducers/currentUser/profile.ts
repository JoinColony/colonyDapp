import { fromJS } from 'immutable';

import { UserProfile, UserProfileRecord } from '~immutable/index';
import { ActionTypes, ReducerType } from '~redux/index';

const currentUserProfileReducer: ReducerType<UserProfileRecord> = (
  state = UserProfile({
    walletAddress: '',
  }),
  action,
) => {
  switch (action.type) {
    case ActionTypes.CURRENT_USER_CREATE: {
      const { profileData, walletAddress, balance } = action.payload;
      return UserProfile({ ...profileData, walletAddress, balance });
    }
    case ActionTypes.USER_LOGOUT: {
      /* Set values back to default */
      return state.clear();
    }
    case ActionTypes.USER_PROFILE_UPDATE_SUCCESS:
    case ActionTypes.USERNAME_CREATE_SUCCESS: {
      return state.mergeDeep(fromJS(action.payload));
    }
    case ActionTypes.USER_AVATAR_UPLOAD_SUCCESS: {
      const { hash } = action.payload;
      return state.set('avatarHash', hash);
    }
    case ActionTypes.USER_AVATAR_REMOVE_SUCCESS: {
      return state.delete('avatarHash');
    }
    case ActionTypes.CURRENT_USER_BALANCE: {
      const { balance } = action.payload;
      return state.set('balance', balance);
    }
    default:
      return state;
  }
};

export default currentUserProfileReducer;

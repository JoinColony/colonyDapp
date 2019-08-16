import { fromJS } from 'immutable';

import { UserProfileRecord, UserProfileRecordType } from '~immutable/index';
import { ActionTypes, ReducerType } from '~redux/index';

const currentUserProfileReducer: ReducerType<UserProfileRecordType> = (
  state = UserProfileRecord(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.CURRENT_USER_CREATE: {
      const { profileData, walletAddress, balance } = action.payload;
      return UserProfileRecord({ ...profileData, walletAddress, balance });
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
    case ActionTypes.CURRENT_USER_GET_BALANCE_SUCCESS: {
      const { balance } = action.payload;
      return state.set('balance', balance);
    }
    default:
      return state;
  }
};

export default currentUserProfileReducer;

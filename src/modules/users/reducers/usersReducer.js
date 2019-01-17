/* @flow */

import { combineReducers } from 'redux';

import userAvatarsReducer from './userAvatarsReducer';
import usernamesReducer from './usernamesReducer';
import userProfilesReducer from './userProfilesReducer';

export default combineReducers({
  users: userProfilesReducer,
  usernames: usernamesReducer,
  avatars: userAvatarsReducer,
});

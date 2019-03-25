/* @flow */

import { combineReducers } from 'redux-immutable';

import userAvatarsReducer from './userAvatarsReducer';
import userProfilesReducer from './userProfilesReducer';

export default combineReducers({
  users: userProfilesReducer,
  avatars: userAvatarsReducer,
});

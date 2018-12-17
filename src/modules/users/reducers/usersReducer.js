/* @flow */

import { combineReducers } from 'redux';

import userAvatarsReducer from './userAvatarsReducer';
import userProfilesReducer from './userProfilesReducer';

export default combineReducers({
  profiles: userProfilesReducer,
  avatars: userAvatarsReducer,
});

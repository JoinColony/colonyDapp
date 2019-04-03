/* @flow */

import { combineReducers } from 'redux-immutable';

import userProfilesReducer from './userProfilesReducer';

export default combineReducers({
  users: userProfilesReducer,
});

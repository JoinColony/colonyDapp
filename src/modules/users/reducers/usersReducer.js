/* @flow */

import { combineReducers } from 'redux-immutable';

import userProfilesReducer from './userProfilesReducer';
import userColoniesReducer from './userColoniesReducer';

import { USERS_COLONIES, USERS_USERS } from '../constants';

export default combineReducers({
  [USERS_USERS]: userProfilesReducer,
  [USERS_COLONIES]: userColoniesReducer,
});

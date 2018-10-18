/* @flow */

import { combineReducers } from 'redux';
import walletReducer from './wallet';
import currentUserReducer from './currentUserReducer';
import userProfilesReducer from './userProfilesReducer';

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  wallet: walletReducer,
  userProfiles: userProfilesReducer,
});

export default rootReducer;

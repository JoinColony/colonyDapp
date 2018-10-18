/* @flow */

import { combineReducers } from 'redux';
import walletReducer from './wallet';
import currentUserReducer from './currentUserReducer';
import userProfileReducer from './userProfileReducer';

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  wallet: walletReducer,
  userProfile: userProfileReducer,
});

export default rootReducer;

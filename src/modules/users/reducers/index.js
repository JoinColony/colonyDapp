/* @flow */

import { combineReducers } from 'redux';
import walletReducer from './walletReducer';
import currentUserReducer from './currentUserReducer';
import usersReducer from './usersReducer';

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  wallet: walletReducer,
  users: usersReducer,
});

export default rootReducer;

/* @flow */

import { combineReducers } from 'redux';
import walletReducer from './wallet';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  wallet: walletReducer,
  user: userReducer,
});

export default rootReducer;

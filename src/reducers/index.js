/* @flow */

import { combineReducers } from 'redux';

import walletReducer from './wallet';

const rootReducer = combineReducers({
  wallet: walletReducer,
});

export default rootReducer;

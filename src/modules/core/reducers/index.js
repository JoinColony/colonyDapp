/* @flow */

import { combineReducers } from 'redux';

import transactionsReducer from './transactions';

const coreReducer = combineReducers({
  transactions: transactionsReducer,
});

export default coreReducer;

/* @flow */

import { combineReducers } from 'redux';

import transactionsReducer from './transactions';

const adminReducer = combineReducers({
  transactions: transactionsReducer,
});

export default adminReducer;

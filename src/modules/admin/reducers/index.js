/* @flow */

import { combineReducers } from 'redux';

import transactionsReducer from './transactions';
import unclaimedTransactionsReducer from './unclaimedTransactions';

const adminReducer = combineReducers({
  transactions: transactionsReducer,
  unclaimedTransactions: unclaimedTransactionsReducer,
});

export default adminReducer;

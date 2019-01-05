/* @flow */

import { combineReducers } from 'redux';
import walletReducer from './walletReducer';
import currentUserReducer from './currentUserReducer';
import currentUserTransactionsReducer from './currentUserTransactionsReducer';
import usersReducer from './usersReducer';

const rootReducer = combineReducers({
  currentUser: currentUserReducer,
  currentUserTransactions: currentUserTransactionsReducer,
  wallet: walletReducer,
  allUsers: usersReducer,
});

export default rootReducer;

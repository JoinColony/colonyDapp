/* @flow */

import { combineReducers } from 'redux-immutable';

import currentUserReducer from './currentUserReducer';
import currentUserTransactionsReducer from './currentUserTransactionsReducer';
import usersReducer from './usersReducer';
import walletReducer from './walletReducer';

import {
  USERS_ALL_USERS,
  USERS_CURRENT_USER,
  USERS_CURRENT_USER_TRANSACTIONS,
  USERS_WALLET,
} from '../misc_constants';

const rootReducer = combineReducers({
  [USERS_ALL_USERS]: usersReducer,
  [USERS_CURRENT_USER]: currentUserReducer,
  [USERS_CURRENT_USER_TRANSACTIONS]: currentUserTransactionsReducer,
  [USERS_WALLET]: walletReducer,
});

export default rootReducer;

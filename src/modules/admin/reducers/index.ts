import { combineReducers } from 'redux-immutable';

import transactionsReducer from './transactions';
import unclaimedTransactionsReducer from './unclaimedTransactions';

import { ADMIN_TRANSACTIONS, ADMIN_UNCLAIMED_TRANSACTIONS } from '../constants';

const adminReducer = combineReducers({
  [ADMIN_TRANSACTIONS]: transactionsReducer,
  [ADMIN_UNCLAIMED_TRANSACTIONS]: unclaimedTransactionsReducer,
});

export default adminReducer;

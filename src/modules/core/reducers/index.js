/* @flow */

import { combineReducers } from 'redux';

import currentColonyReducer from './currentColony';
import transactionsReducer from './transactions';

const coreReducer = combineReducers({
  currentColony: currentColonyReducer,
  transactions: transactionsReducer,
});

export default coreReducer;

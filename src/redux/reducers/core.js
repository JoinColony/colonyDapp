/* @flow */

import { combineReducers } from 'redux-immutable';

import coreTransactionsReducer from './transactions';
import { CORE_TRANSACTIONS } from '../misc_constants';

const coreReducer = combineReducers({
  [CORE_TRANSACTIONS]: coreTransactionsReducer,
});

export default coreReducer;

/* @flow */

import { combineReducers } from 'redux-immutable';

import coreTransactionsReducer from './transactions';
import coreGasPricesReducer from './gasPrices';
import { CORE_GAS_PRICES, CORE_TRANSACTIONS } from '../constants';

const coreReducer = combineReducers({
  [CORE_TRANSACTIONS]: coreTransactionsReducer,
  [CORE_GAS_PRICES]: coreGasPricesReducer,
});

export default coreReducer;

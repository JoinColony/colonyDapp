/* @flow */

import { combineReducers } from 'redux-immutable';

import coreTransactionsReducer from './transactions';
import coreGasPricesReducer from './gasPrices';
import coreNetworkReducer from './network';

import { CORE_GAS_PRICES, CORE_TRANSACTIONS, CORE_NETWORK } from '../constants';

const coreReducer = combineReducers({
  [CORE_TRANSACTIONS]: coreTransactionsReducer,
  [CORE_GAS_PRICES]: coreGasPricesReducer,
  [CORE_NETWORK]: coreNetworkReducer,
});

export default coreReducer;

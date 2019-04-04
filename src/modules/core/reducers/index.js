/* @flow */

import { combineReducers } from 'redux-immutable';

import coreTransactionsReducer from './transactions';
import coreGasPricesReducer from './gasPrices';
import coreNetworkReducer from './network';
import ipfsDataReducer from './ipfsData';

import {
  CORE_GAS_PRICES,
  CORE_TRANSACTIONS,
  CORE_NETWORK,
  CORE_IPFS_DATA,
} from '../constants';

const coreReducer = combineReducers({
  [CORE_TRANSACTIONS]: coreTransactionsReducer,
  [CORE_GAS_PRICES]: coreGasPricesReducer,
  [CORE_NETWORK]: coreNetworkReducer,
  [CORE_IPFS_DATA]: ipfsDataReducer,
});

export default coreReducer;

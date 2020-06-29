import { combineReducers } from 'redux-immutable';

import transactionsReducer from './transactions';
import gasPricesReducer from './gasPrices';
import networkReducer from './network';
import ipfsDataReducer from './ipfsData';
import messagesReducer from './messages';
import connectionReducer from './connection';

import {
  CORE_CONNECTION,
  CORE_GAS_PRICES,
  CORE_IPFS_DATA,
  CORE_MESSAGES,
  CORE_NETWORK,
  CORE_TRANSACTIONS,
} from '../constants';

const coreReducer = combineReducers({
  [CORE_CONNECTION]: connectionReducer,
  [CORE_GAS_PRICES]: gasPricesReducer,
  [CORE_IPFS_DATA]: ipfsDataReducer,
  [CORE_MESSAGES]: messagesReducer,
  [CORE_NETWORK]: networkReducer,
  [CORE_TRANSACTIONS]: transactionsReducer,
});

export default coreReducer;

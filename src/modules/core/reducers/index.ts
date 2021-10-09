import { combineReducers } from 'redux-immutable';

import transactionsReducer from './transactions';
import gasPricesReducer from './gasPrices';
import ipfsDataReducer from './ipfsData';
import messagesReducer from './messages';

import {
  CORE_GAS_PRICES,
  CORE_IPFS_DATA,
  CORE_MESSAGES,
  CORE_TRANSACTIONS,
} from '../constants';

const coreReducer = combineReducers({
  [CORE_GAS_PRICES]: gasPricesReducer,
  [CORE_IPFS_DATA]: ipfsDataReducer,
  [CORE_MESSAGES]: messagesReducer,
  [CORE_TRANSACTIONS]: transactionsReducer,
});

export default coreReducer;

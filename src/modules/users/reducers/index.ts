import { combineReducers } from 'redux-immutable';

import walletReducer from './walletReducer';

import { USERS_WALLET } from '../constants';

const rootReducer = combineReducers({
  [USERS_WALLET]: walletReducer,
});

export default rootReducer;

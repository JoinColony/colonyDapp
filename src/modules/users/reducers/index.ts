import { combineReducers } from 'redux-immutable';

import currentUserReducer from './currentUserReducer';
import walletReducer from './walletReducer';

import { USERS_CURRENT_USER, USERS_WALLET } from '../constants';

const rootReducer = combineReducers({
  [USERS_CURRENT_USER]: currentUserReducer,
  [USERS_WALLET]: walletReducer,
});

export default rootReducer;

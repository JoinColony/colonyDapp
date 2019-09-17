import { combineReducers } from 'redux-immutable';

import currentUserReducer from './currentUserReducer';
import usersReducer from './usersReducer';
import walletReducer from './walletReducer';

import {
  USERS_ALL_USERS,
  USERS_CURRENT_USER,
  USERS_WALLET,
} from '../constants';

const rootReducer = combineReducers({
  [USERS_ALL_USERS]: usersReducer,
  [USERS_CURRENT_USER]: currentUserReducer,
  [USERS_WALLET]: walletReducer,
});

export default rootReducer;

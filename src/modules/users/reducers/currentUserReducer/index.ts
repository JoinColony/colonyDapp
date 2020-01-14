import { combineReducers } from 'redux-immutable';

import transactions from './transactions';

import { USERS_CURRENT_USER_TRANSACTIONS } from '../../constants';

export default combineReducers({
  [USERS_CURRENT_USER_TRANSACTIONS]: transactions,
});

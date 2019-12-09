import { combineReducers } from 'redux-immutable';

import inboxItems from './inboxItems';
import tokens from './tokens';
import transactions from './transactions';

import {
  USERS_INBOX_ITEMS,
  USERS_CURRENT_USER_TOKENS,
  USERS_CURRENT_USER_TRANSACTIONS,
} from '../../constants';

export default combineReducers({
  [USERS_INBOX_ITEMS]: inboxItems,
  [USERS_CURRENT_USER_TOKENS]: tokens,
  [USERS_CURRENT_USER_TRANSACTIONS]: transactions,
});

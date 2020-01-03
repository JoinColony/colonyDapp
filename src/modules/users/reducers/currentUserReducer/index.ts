import { combineReducers } from 'redux-immutable';

import inboxItems from './inboxItems';
import transactions from './transactions';

import {
  USERS_INBOX_ITEMS,
  USERS_CURRENT_USER_TRANSACTIONS,
} from '../../constants';

export default combineReducers({
  [USERS_INBOX_ITEMS]: inboxItems,
  [USERS_CURRENT_USER_TRANSACTIONS]: transactions,
});

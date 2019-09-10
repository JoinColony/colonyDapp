import { combineReducers } from 'redux-immutable';

import inboxItems from './inboxItems';
import notifications from './notifications';
import profile from './profile';
import tasks from './tasks';
import tokens from './tokens';
import transactions from './transactions';

import {
  USERS_INBOX_ITEMS,
  USERS_CURRENT_USER_NOTIFICATION_METADATA,
  USERS_CURRENT_USER_PROFILE,
  USERS_CURRENT_USER_TASKS,
  USERS_CURRENT_USER_TOKENS,
  USERS_CURRENT_USER_TRANSACTIONS,
} from '../../constants';

export default combineReducers({
  [USERS_INBOX_ITEMS]: inboxItems,
  [USERS_CURRENT_USER_NOTIFICATION_METADATA]: notifications,
  [USERS_CURRENT_USER_PROFILE]: profile,
  [USERS_CURRENT_USER_TASKS]: tasks,
  [USERS_CURRENT_USER_TOKENS]: tokens,
  [USERS_CURRENT_USER_TRANSACTIONS]: transactions,
});

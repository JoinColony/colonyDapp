/* @flow */

import { combineReducers } from 'redux-immutable';

import activities from './activities';
import colonies from './colonies';
import notifications from './notifications';
import permissions from './permissions';
import profile from './profile';
import tasks from './tasks';
import tokens from './tokens';
import transactions from './transactions';

export default combineReducers({
  activities,
  colonies,
  notifications,
  permissions,
  profile,
  tasks,
  tokens,
  transactions,
});

/* @flow */

import { combineReducers } from 'redux-immutable';

import activities from './activities';
import colonies from './colonies';
import permissions from './permissions';
import profile from './profile';
import tasks from './tasks';
import tokens from './tokens';
import transactions from './transactions';

export default combineReducers({
  activities,
  colonies,
  permissions,
  profile,
  tasks,
  tokens,
  transactions,
});

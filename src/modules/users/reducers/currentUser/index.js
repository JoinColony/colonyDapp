/* @flow */

import { combineReducers } from 'redux-immutable';

import activities from './activities';
import colonies from './colonies';
import metadata from './metadata';
import permissions from './permissions';
import tasks from './tasks';
import tokens from './tokens';
import transactions from './transactions';

export default combineReducers({
  activities,
  colonies,
  metadata,
  permissions,
  tasks,
  tokens,
  transactions,
});

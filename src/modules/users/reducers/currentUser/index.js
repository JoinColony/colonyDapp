/* @flow */

import { combineReducers } from 'redux-immutable';

import activities from './activities';
import colonies from './colonies';
import metadata from './metadata';
import permissions from './permissions';
import profile from './profile';
import tasks from './tasks';
import transactions from './transactions';

export default combineReducers({
  activities,
  colonies,
  metadata,
  permissions,
  profile,
  tasks,
  transactions,
});

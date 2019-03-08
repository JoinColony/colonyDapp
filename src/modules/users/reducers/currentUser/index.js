/* @flow */

import { combineReducers } from 'redux-immutable';

import activities from './activities';
import metadata from './metadata';
import permissions from './permissions';
import profile from './profile';
import tasks from './tasks';
import transactions from './transactions';

export default combineReducers({
  activities,
  metadata,
  permissions,
  profile,
  tasks,
  transactions,
});

/* @flow */

import { combineReducers } from 'redux-immutable';

import activities from './activities';
import permissions from './permissions';
import profile from './profile';
import tasks from './tasks';
import transactions from './transactions';

export default combineReducers({
  activities,
  permissions,
  profile,
  tasks,
  transactions,
});

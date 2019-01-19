/* @flow */

import { combineReducers } from 'redux';

import allColonies from './allColonies';
import allTasks from './allTasks';
import allAdmins from './allAdmins';
import allDomains from './allDomains';
import allDrafts from './allDrafts';

const dashboardReducer = combineReducers({
  allColonies,
  allTasks,
  allAdmins,
  allDomains,
  allDrafts,
});

export default dashboardReducer;

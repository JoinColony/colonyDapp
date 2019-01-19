/* @flow */

import { combineReducers } from 'redux';

import allColonies from './allColonies';
import allTasks from './allTasks';
import allDomains from './allDomains';
import allDrafts from './allDrafts';

const dashboardReducer = combineReducers({
  allColonies,
  allTasks,
  allDomains,
  allDrafts,
});

export default dashboardReducer;

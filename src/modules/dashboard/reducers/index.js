/* @flow */

import { combineReducers } from 'redux';

import allColonies from './allColonies';
import allTasks from './allTasks';
import allDomains from './allDomains';

const dashboardReducer = combineReducers({
  allColonies,
  allTasks,
  allDomains,
});

export default dashboardReducer;

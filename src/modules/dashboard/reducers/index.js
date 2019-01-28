/* @flow */

import { combineReducers } from 'redux';

import allColonies from './allColonies';
import allTasks from './allTasks';
import allDomains from './allDomains';
import allDrafts from './allDrafts';
import allComments from './allComments';

const dashboardReducer = combineReducers({
  allColonies,
  allTasks,
  allDomains,
  allDrafts,
  allComments,
});

export default dashboardReducer;

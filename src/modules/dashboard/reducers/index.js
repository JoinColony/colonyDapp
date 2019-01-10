/* @flow */

import { combineReducers } from 'redux';

import allColonies from './allColonies';
import allDomains from './allDomains';
import allDrafts from './allDrafts';

const dashboardReducer = combineReducers({
  allColonies,
  allDomains,
  allDrafts,
});

export default dashboardReducer;

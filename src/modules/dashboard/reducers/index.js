/* @flow */

import { combineReducers } from 'redux';

import allColonies from './allColonies';
import allDomains from './allDomains';

const dashboardReducer = combineReducers({
  allColonies,
  allDomains,
});

export default dashboardReducer;

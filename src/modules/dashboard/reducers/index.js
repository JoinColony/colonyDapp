/* @flow */

import { combineReducers } from 'redux';

import allColonies from './allColonies';

const dashboardReducer = combineReducers({
  allColonies,
});

export default dashboardReducer;

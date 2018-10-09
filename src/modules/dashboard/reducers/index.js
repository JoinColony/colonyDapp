/* @flow */

import { combineReducers } from 'redux';

import colonyReducer from './colony';

const dashboardReducer = combineReducers({
  colony: colonyReducer,
});

export default dashboardReducer;

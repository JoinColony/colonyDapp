/* @flow */

import { combineReducers } from 'redux';

import allColonies from './allColonies';
import domainsReducer from './domains';
import tasksReducer from './tasks';

const dashboardReducer = combineReducers({
  allColonies,
  domains: domainsReducer,
  tasks: tasksReducer,
});

export default dashboardReducer;

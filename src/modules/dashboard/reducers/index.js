/* @flow */

import { combineReducers } from 'redux';

import allColonies from './allColonies';
import domainsReducer from './domains';

const dashboardReducer = combineReducers({
  allColonies,
  domains: domainsReducer,
});

export default dashboardReducer;

/* @flow */

import { combineReducers } from 'redux-immutable';

import allColoniesReducer from './allColonies';
import allCommentsReducer from './allComments';
import allDomainsReducer from './allDomains';
import allTasksReducer from './allTasks';
import allTokensReducer from './allTokens';

import {
  DASHBOARD_ALL_COLONIES,
  DASHBOARD_ALL_COMMENTS,
  DASHBOARD_ALL_DOMAINS,
  DASHBOARD_ALL_TASKS,
  DASHBOARD_ALL_TOKENS,
} from '../constants';

const dashboardReducer = combineReducers({
  [DASHBOARD_ALL_COLONIES]: allColoniesReducer,
  [DASHBOARD_ALL_COMMENTS]: allCommentsReducer,
  [DASHBOARD_ALL_DOMAINS]: allDomainsReducer,
  [DASHBOARD_ALL_TASKS]: allTasksReducer,
  [DASHBOARD_ALL_TOKENS]: allTokensReducer,
});

export default dashboardReducer;

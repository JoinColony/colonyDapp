/* @flow */

import { combineReducers } from 'redux-immutable';

import allColoniesReducer from './allColonies';
import allCommentsReducer from './allComments';
import allDomainsReducer from './allDomains';
import allDraftsReducer from './allDrafts';
import allTasksReducer from './allTasks';

import {
  DASHBOARD_ALL_COLONIES,
  DASHBOARD_ALL_COMMENTS,
  DASHBOARD_ALL_DOMAINS,
  DASHBOARD_ALL_DRAFTS,
  DASHBOARD_ALL_TASKS,
} from '../constants';

const dashboardReducer = combineReducers({
  [DASHBOARD_ALL_COLONIES]: allColoniesReducer,
  [DASHBOARD_ALL_COMMENTS]: allCommentsReducer,
  [DASHBOARD_ALL_DOMAINS]: allDomainsReducer,
  [DASHBOARD_ALL_DRAFTS]: allDraftsReducer,
  [DASHBOARD_ALL_TASKS]: allTasksReducer,
});

export default dashboardReducer;

/* @flow */

import { combineReducers } from 'redux-immutable';

import coloniesReducer from './coloniesReducer';
import colonyNamesReducer from './colonyENSNamesReducer';

import { DASHBOARD_COLONIES, DASHBOARD_COLONY_NAMES } from '../constants';

export default combineReducers({
  [DASHBOARD_COLONIES]: coloniesReducer,
  [DASHBOARD_COLONY_NAMES]: colonyNamesReducer,
});

/* @flow */

import { combineReducers } from 'redux-immutable';

import coloniesReducer from './coloniesReducer';
import colonyENSNamesReducer from './colonyENSNamesReducer';

import { DASHBOARD_COLONIES, DASHBOARD_ENS_NAMES } from '../constants';

export default combineReducers({
  [DASHBOARD_COLONIES]: coloniesReducer,
  [DASHBOARD_ENS_NAMES]: colonyENSNamesReducer,
});

/* @flow */

import { combineReducers } from 'redux-immutable';

import coloniesReducer from './coloniesReducer';
import colonyAvatarsReducer from './colonyAvatarsReducer';
import colonyENSNamesReducer from './colonyENSNamesReducer';

import {
  DASHBOARD_AVATARS,
  DASHBOARD_COLONIES,
  DASHBOARD_ENS_NAMES,
} from '../constants';

export default combineReducers({
  [DASHBOARD_AVATARS]: colonyAvatarsReducer,
  [DASHBOARD_COLONIES]: coloniesReducer,
  [DASHBOARD_ENS_NAMES]: colonyENSNamesReducer,
});

/* @flow */

import { combineReducers } from 'redux';

import coloniesReducer from './coloniesReducer';
import colonyAvatarsReducer from './colonyAvatarsReducer';
import colonyENSNamesReducer from './colonyENSNamesReducer';

export default combineReducers({
  avatars: colonyAvatarsReducer,
  colonies: coloniesReducer,
  ensNames: colonyENSNamesReducer,
});

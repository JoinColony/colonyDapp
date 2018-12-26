/* @flow */

import { combineReducers } from 'redux';

import coloniesReducer from './coloniesReducer';
import colonyAvatarsReducer from './colonyAvatarsReducer';

export default combineReducers({
  avatars: colonyAvatarsReducer,
  colonies: coloniesReducer,
});

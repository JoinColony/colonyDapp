/* @flow */

import { combineReducers } from 'redux';

import coloniesReducer from './colonies';

const coreReducer = combineReducers({
  colonies: coloniesReducer,
});

export default coreReducer;

/* @flow */

import { combineReducers } from 'redux';
import currentColonyReducer from './currentColonyReducer';

const rootReducer = combineReducers({
  currentColony: currentColonyReducer,
});

export default rootReducer;

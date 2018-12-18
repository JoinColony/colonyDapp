/* @flow */

import { combineReducers } from 'redux';

import coloniesReducer from './colonies';
import domainsReducer from './domains';
import tasksReducer from './tasks';

const coreReducer = combineReducers({
  colonies: coloniesReducer,
  domains: domainsReducer,
  tasks: tasksReducer,
});

export default coreReducer;

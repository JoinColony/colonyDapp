/* @flow */

import { combineReducers } from 'redux';

import coloniesReducer from './colonies';
import domainsReducer from './domains';

const coreReducer = combineReducers({
  colonies: coloniesReducer,
  domains: domainsReducer,
});

export default coreReducer;

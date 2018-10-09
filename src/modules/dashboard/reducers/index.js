/* @flow */

import { combineReducers } from 'redux';

import colony from './colony';

const dashboardReducer = combineReducers({ colony });

export default dashboardReducer;

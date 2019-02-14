/* @flow */

import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router';

import { RootState } from '~immutable';

import adminReducer from '~redux/reducers/admin';
import coreReducer from '~redux/reducers/core';
import dashboardReducer from '~redux/reducers/dashboard';
import usersReducer from '~redux/reducers/users';
import {
  ADMIN_NAMESPACE,
  CORE_NAMESPACE,
  DASHBOARD_NAMESPACE,
  USERS_NAMESPACE,
} from '~redux/misc_constants';

const createRootReducer = (history: *) =>
  combineReducers(
    {
      [ADMIN_NAMESPACE]: adminReducer,
      [CORE_NAMESPACE]: coreReducer,
      [DASHBOARD_NAMESPACE]: dashboardReducer,
      [USERS_NAMESPACE]: usersReducer,
      router: connectRouter(history),
    },
    RootState,
  );

export default createRootReducer;

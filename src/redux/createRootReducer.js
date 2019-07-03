/* @flow */

import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router';

import { RootState } from '~immutable';

import adminReducer from '../modules/admin/reducers';
import coreReducer from '../modules/core/reducers';
import dashboardReducer from '../modules/dashboard/reducers';
import usersReducer from '../modules/users/reducers';
import { ADMIN_NAMESPACE } from '../modules/admin/constants';
import { CORE_NAMESPACE } from '../modules/core/constants';
import { DASHBOARD_NAMESPACE } from '../modules/dashboard/constants';
import { USERS_NAMESPACE } from '../modules/users/constants';

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

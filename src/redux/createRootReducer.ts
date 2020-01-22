import { combineReducers } from 'redux-immutable';

import { RootStateRecord } from '../modules/state';
import adminReducer from '../modules/admin/reducers';
import coreReducer from '../modules/core/reducers';
import dashboardReducer from '../modules/dashboard/reducers';
import usersReducer from '../modules/users/reducers';
import { ADMIN_NAMESPACE } from '../modules/admin/constants';
import { CORE_NAMESPACE } from '../modules/core/constants';
import { DASHBOARD_NAMESPACE } from '../modules/dashboard/constants';
import { USERS_NAMESPACE } from '../modules/users/constants';

const createRootReducer = () =>
  combineReducers(
    {
      [ADMIN_NAMESPACE]: adminReducer,
      [CORE_NAMESPACE]: coreReducer,
      [DASHBOARD_NAMESPACE]: dashboardReducer,
      [USERS_NAMESPACE]: usersReducer,
    },
    () => new RootStateRecord(),
  );

export default createRootReducer;

import { combineReducers } from 'redux-immutable';

import { RootStateRecord } from '../modules/state';
import coreReducer from '../modules/core/reducers';
import usersReducer from '../modules/users/reducers';
import { CORE_NAMESPACE } from '../modules/core/constants';
import { USERS_NAMESPACE } from '../modules/users/constants';

const createRootReducer = () =>
  combineReducers(
    {
      [CORE_NAMESPACE]: coreReducer,
      [USERS_NAMESPACE]: usersReducer,
    },
    () => new RootStateRecord(),
  );

export default createRootReducer;

import { combineReducers } from 'redux-immutable';

import allDomainsReducer from './allDomains';
import TEMP_allUserHasRecoverRoleReducer from './TEMP_allUserHasRecoveryRoles';

import {
  DASHBOARD_ALL_DOMAINS,
  TEMP_DASHBOARD_ALL_USER_HAS_RECOVERY_ROLES,
} from '../constants';

const dashboardReducer = combineReducers({
  [DASHBOARD_ALL_DOMAINS]: allDomainsReducer,
  // eslint-disable-next-line max-len
  [TEMP_DASHBOARD_ALL_USER_HAS_RECOVERY_ROLES]: TEMP_allUserHasRecoverRoleReducer,
});

export default dashboardReducer;

import { combineReducers } from 'redux-immutable';

import allColoniesReducer from './allColonies';
import allDomainsReducer from './allDomains';
import allTokensReducer from './allTokens';
import TEMP_allUserHasRecoverRoleReducer from './TEMP_allUserHasRecoveryRoles';

import {
  DASHBOARD_ALL_COLONIES,
  DASHBOARD_ALL_DOMAINS,
  DASHBOARD_ALL_TOKENS,
  TEMP_DASHBOARD_ALL_USER_HAS_RECOVERY_ROLES,
} from '../constants';

const dashboardReducer = combineReducers({
  [DASHBOARD_ALL_COLONIES]: allColoniesReducer,
  [DASHBOARD_ALL_DOMAINS]: allDomainsReducer,
  [DASHBOARD_ALL_TOKENS]: allTokensReducer,
  // eslint-disable-next-line max-len
  [TEMP_DASHBOARD_ALL_USER_HAS_RECOVERY_ROLES]: TEMP_allUserHasRecoverRoleReducer,
});

export default dashboardReducer;

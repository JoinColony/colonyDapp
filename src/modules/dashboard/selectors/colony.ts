import { FetchableDataRecord } from '~immutable/FetchableData';

import { Address } from '~types/index';

import { RootStateRecord } from '../../state';
import {
  DASHBOARD_NAMESPACE as ns,
  TEMP_DASHBOARD_ALL_USER_HAS_RECOVERY_ROLES,
} from '../constants';

/*
 * Input selectors
 */
export const TEMP_userHasRecoveryRoleSelector = (
  state: RootStateRecord,
  colonyAddress?: Address,
): FetchableDataRecord<Address[]> =>
  state.getIn([ns, TEMP_DASHBOARD_ALL_USER_HAS_RECOVERY_ROLES, colonyAddress]);

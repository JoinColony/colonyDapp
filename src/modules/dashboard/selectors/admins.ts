import { RootStateRecord } from '~immutable/index';
import { Address } from '~types/index';

import { DASHBOARD_NAMESPACE as ns, DASHBOARD_ALL_ROLES } from '../constants';

/*
 * Input selectors
 */
export const colonyRolesSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
) => state.getIn([ns, DASHBOARD_ALL_ROLES, colonyAddress]);

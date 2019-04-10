/* @flow */

import type { RootStateRecord } from '~immutable';

import { DASHBOARD_NAMESPACE as ns, DASHBOARD_ALL_ROLES } from '../constants';

/*
 * Input selectors
 */
// eslint-disable-next-line import/prefer-default-export
export const colonyRolesSelector = (
  state: RootStateRecord,
  colonyName: string,
) => state.getIn([ns, DASHBOARD_ALL_ROLES, colonyName]);

/* @flow */

import type { RootStateRecord } from '~immutable';

import { DASHBOARD_NAMESPACE as ns, DASHBOARD_ALL_DOMAINS } from '../constants';

/*
 * Input selectors
 */
// eslint-disable-next-line import/prefer-default-export
export const colonyDomainsSelector = (
  state: RootStateRecord,
  ensName: string,
) => state.getIn([ns, DASHBOARD_ALL_DOMAINS, ensName]);

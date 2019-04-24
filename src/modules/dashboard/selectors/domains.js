/* @flow */

import { Set as ImmutableSet } from 'immutable';

import type { DomainId, RootStateRecord } from '~immutable';
import type { Address } from '~types';

import { DASHBOARD_NAMESPACE as ns, DASHBOARD_ALL_DOMAINS } from '../constants';

/*
 * Input selectors
 */
// eslint-disable-next-line import/prefer-default-export
export const colonyDomainsSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
) => state.getIn([ns, DASHBOARD_ALL_DOMAINS, colonyAddress]);

export const domainSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
  domainId: DomainId,
) =>
  state
    .getIn([ns, DASHBOARD_ALL_DOMAINS, colonyAddress, 'record'], ImmutableSet())
    .find(({ id }) => id === domainId);

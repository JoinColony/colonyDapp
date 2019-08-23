import { Set as ImmutableSet } from 'immutable';

import { DomainId, RootStateRecord } from '~immutable/index';
import { Address } from '~types/index';

import { DASHBOARD_NAMESPACE as ns, DASHBOARD_ALL_DOMAINS } from '../constants';

/*
 * Input selectors
 */
export const colonyDomainsSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
) => state.getIn([ns, DASHBOARD_ALL_DOMAINS, colonyAddress]);

export const domainSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
  domainId: DomainId,
) =>
  (
    state.getIn([ns, DASHBOARD_ALL_DOMAINS, colonyAddress, 'record']) ||
    ImmutableSet()
  ).find(({ id }) => id === domainId);

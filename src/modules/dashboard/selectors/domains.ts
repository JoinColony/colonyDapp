import { FetchableDataRecord, DomainRecord } from '~immutable/index';
import { Address, DomainsMap } from '~types/index';

import { RootStateRecord } from '../../state';
import { DASHBOARD_NAMESPACE as ns, DASHBOARD_ALL_DOMAINS } from '../constants';

/*
 * Input selectors
 */
export const colonyDomainsSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
): FetchableDataRecord<DomainsMap> =>
  state.getIn([ns, DASHBOARD_ALL_DOMAINS, colonyAddress]);

export const domainSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
  domainId: number,
): DomainRecord | null =>
  state.getIn([
    ns,
    DASHBOARD_ALL_DOMAINS,
    colonyAddress,
    'record',
    domainId.toString(),
  ]);

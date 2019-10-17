import { Set as ImmutableSet } from 'immutable';

import { FetchableDataRecord, DomainRecord } from '~immutable/index';
import { Address, ColonyRoles } from '~types/index';

import { RootStateRecord } from '../../state';
import { DomainsMap } from '../state';
import { DASHBOARD_NAMESPACE as ns, DASHBOARD_ALL_DOMAINS } from '../constants';

const domainsPath = (colonyAddress: Address, domainId: string): string[] => [
  ns,
  DASHBOARD_ALL_DOMAINS,
  colonyAddress,
  'record',
  domainId,
];

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
  domainId: string,
): DomainRecord | null => state.getIn(domainsPath(colonyAddress, domainId));

export const parentDomainSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
  domainId: string,
): DomainRecord | null => {
  const domain = domainSelector(state, colonyAddress, domainId);

  if (!(domain && domain.parentId)) return null;

  return domainSelector(state, colonyAddress, domain.parentId);
};

// For a given colony address/domain ID, return the parent domains
// in an upwards order.
export const parentDomainsSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
  domainId: string,
): DomainRecord[] => {
  const parents: DomainRecord[] = [];

  let parent = parentDomainSelector(state, colonyAddress, domainId);
  while (parent) {
    parents.push(parent);
    parent = parentDomainSelector(state, colonyAddress, parent.id);
  }

  return parents;
};

// For a given colony address/domain ID/user address, return the
// direct roles for that domain
export const directRolesSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
  domainId: string,
  userAddress: Address,
): ImmutableSet<ColonyRoles> => {
  const domain = domainSelector(state, colonyAddress, domainId);
  const roles = domain && domain.roles && domain.roles.get(userAddress);
  return roles ? ImmutableSet(roles) : ImmutableSet<ColonyRoles>();
};

// For a given colony address/domain ID/user address, return the
// inherited roles for that domain.
export const inheritedRolesSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
  domainId: string,
  userAddress: Address,
): ImmutableSet<ColonyRoles> =>
  parentDomainsSelector(state, colonyAddress, domainId).reduce(
    (roles, domain) => {
      const domainRoles = domain.roles && domain.roles.get(userAddress);
      return domainRoles ? ImmutableSet([...roles, ...domainRoles]) : roles;
    },
    ImmutableSet<ColonyRoles>(),
  );

// For a given colony address/domain ID/user address/role, return whether
// the user has the given role in the domain (directly, not inherited)
export const userHasDirectRoleSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
  domainId: string,
  userAddress: Address,
  role: ColonyRoles,
): boolean => {
  const roles = directRolesSelector(
    state,
    colonyAddress,
    domainId,
    userAddress,
  );
  return roles.has(role);
};

// For a given colony address/domain ID/user address/role, return whether
// the user has the given role in the domain (or inherits the role from
// the domain's parents).
export const userHasRoleSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
  domainId: string,
  userAddress: Address,
  role: ColonyRoles,
): boolean =>
  inheritedRolesSelector(state, colonyAddress, domainId, userAddress).has(role);

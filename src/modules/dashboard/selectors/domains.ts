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

// export const parentDomainSelector = (
//   state: RootStateRecord,
//   colonyAddress: Address,
//   domainId: number,
// ): DomainRecord | null => {
//   const domain = domainSelector(state, colonyAddress, domainId);
//
//   if (!(domain && domain.parentId)) return null;
//
//   return domainSelector(state, colonyAddress, domain.parentId);
// };
//
// // For a given colony address/domain ID, return the parent domains
// // in an upwards order.
// export const parentDomainsSelector = (
//   state: RootStateRecord,
//   colonyAddress: Address,
//   domainId: number,
// ): DomainRecord[] => {
//   const parents: DomainRecord[] = [];
//
//   let parent = parentDomainSelector(state, colonyAddress, domainId);
//   while (parent) {
//     parents.push(parent);
//     parent = parentDomainSelector(state, colonyAddress, parent.id);
//   }
//
//   return parents;
// };
//
// // For a given colony address/domain ID/user address, return the
// // direct roles for that domain
// export const directRolesSelector = (
//   state: RootStateRecord,
//   colonyAddress: Address,
//   domainId: number,
//   userAddress: Address,
// ): ImmutableSet<ROLES> => {
//   const domain = domainSelector(state, colonyAddress, domainId);
//   const roles = domain && domain.roles && domain.roles.get(userAddress);
//   return roles ? ImmutableSet(roles) : ImmutableSet<ROLES>();
// };
//
// // For a given colony address/domain ID/user address, return the
// // inherited roles for that domain.
// export const allRolesSelector = (
//   state: RootStateRecord,
//   colonyAddress: Address,
//   domainId: number,
//   userAddress: Address,
// ): ImmutableSet<ROLES> => {
//   const inheritedRoles = parentDomainsSelector(
//     state,
//     colonyAddress,
//     domainId,
//   ).reduce((roles, domain) => {
//     const domainRoles = domain.roles && domain.roles.get(userAddress);
//     return domainRoles ? ImmutableSet([...roles, ...domainRoles]) : roles;
//   }, ImmutableSet<ROLES>());
//   const directRoles = directRolesSelector(
//     state,
//     colonyAddress,
//     domainId,
//     userAddress,
//   );
//   // FIXME these are both empty, why?
//   return directRoles.merge(inheritedRoles);
// };
//
// // For a given colony address/domain ID/user address/role, return whether
// // the user has the given role in the domain (directly, not inherited)
// // FIXME remove this selector (USE CHECKS!!!)
// export const userHasDirectRoleSelector = (
//   state: RootStateRecord,
//   colonyAddress: Address,
//   domainId: number,
//   userAddress: Address,
//   role: ROLES,
// ): boolean => {
//   const roles = directRolesSelector(
//     state,
//     colonyAddress,
//     domainId,
//     userAddress,
//   );
//   return roles.has(role);
// };
//
// // For a given colony address/domain ID/user address/role, return whether
// // the user has the given role in the domain (or inherits the role from
// // the domain's parents).
// // FIXME Remove this selector (USE checks!!!)
// export const userHasRoleSelector = (
//   state: RootStateRecord,
//   colonyAddress: Address,
//   domainId: number,
//   userAddress: Address,
//   role: ROLES,
// ): boolean =>
//   allRolesSelector(state, colonyAddress, domainId, userAddress).has(role);

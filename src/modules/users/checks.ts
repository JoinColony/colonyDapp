import { ROLES } from '~constants';
import { DomainType, UserType } from '~immutable/index';
import { Address, DomainsMapType } from '~types/index';

export const getDirectRoles = (
  domains: DomainsMapType | null,
  domainId: number,
  userAddress: Address,
) => {
  const roles = [] as ROLES[];

  if (!domains) return roles;
  const domain = domains[domainId.toString()];

  if (!domain) return roles;
  return domain.roles[userAddress] || roles;
};

export const getInheritedRoles = (
  domains: DomainsMapType | null,
  domainId: number,
  userAddress: Address,
) => {
  const roles = [] as ROLES[];
  if (!domains) return roles;
  const domain = domains[domainId.toString()];

  if (!domain) return roles;
  if (!domain.parentId) return domain.roles[userAddress] || roles;

  let parent = domains[domain.parentId] as DomainType | null;
  const roleSet = new Set<ROLES>(roles);
  while (parent) {
    if (parent.roles[userAddress]) {
      parent.roles[userAddress].forEach(role => roleSet.add(role));
    }
    parent = parent.parentId ? domains[parent.parentId] : null;
  }
  return Array.from(roleSet) as ROLES[];
};

export const userHasRole = (
  domains: DomainsMapType,
  domainId: number,
  userAddress: Address,
  role: ROLES,
) => getInheritedRoles(domains, domainId, userAddress).includes(role);

export const canEnterRecoveryMode = (
  domains: DomainsMapType,
  domainId: number,
  userAddress: Address,
) => userHasRole(domains, domainId, userAddress, ROLES.RECOVERY);

export const canAdminister = (
  domains: DomainsMapType,
  domainId: number,
  userAddress: Address,
) => userHasRole(domains, domainId, userAddress, ROLES.ADMINISTRATION);

export const isFounder = (
  domains: DomainsMapType,
  domainId: number,
  userAddress: Address,
) => userHasRole(domains, domainId, userAddress, ROLES.ROOT);

export const userDidClaimProfile = ({ profile: { username } }: UserType) =>
  !!username;

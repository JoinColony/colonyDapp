import { ROLES, ROOT_DOMAIN } from '~constants';
import { DomainRolesType, DomainType } from '~immutable/index';
import { Address, DomainsMapType } from '~types/index';
import { ZERO_ADDRESS } from '~utils/web3/constants';

export const getDomainRoles = (
  domains: DomainsMapType | null,
  domainId: number,
  excludeInherited = false,
): DomainRolesType => {
  const domainRoles = {} as DomainRolesType;
  if (!domains) return domainRoles;

  const domain = domains[domainId.toString()];
  if (!domain) return domainRoles;

  if (!domain.parentId || excludeInherited) {
    return domain.roles;
  }

  let parent = domains[domain.parentId] as DomainType | null;
  const roleSets = {};
  while (parent) {
    Object.entries(parent.roles).forEach(([userAddress, roles]) => {
      if (!roleSets[userAddress]) {
        roleSets[userAddress] = new Set(roles);
      } else {
        roles.forEach(role => roleSets[userAddress].add(role));
      }
    });
    parent = parent.parentId ? domains[parent.parentId] : null;
  }
  return Object.entries(roleSets).reduce(
    (acc, [userAddress, roles]: [string, Set<ROLES>]) => {
      acc[userAddress] = Array.from(roles);
      return acc;
    },
    domainRoles,
  );
};

export const getUserRoles = (
  domains: DomainsMapType | null,
  domainId: number | null,
  userAddress: Address | null,
  excludeInherited = false,
): ROLES[] => {
  if (!domainId || !userAddress) return [];

  const roles = getDomainRoles(domains, domainId, excludeInherited);
  if (!roles || !roles[userAddress]) return [];

  return roles[userAddress];
};

export const TEMP_getUserRolesWithRecovery = (
  domains: DomainsMapType | null,
  recoveryRoles: Address[],
  domainId: number | null,
  userAddress: Address | null,
  excludeInherited = false,
): ROLES[] => {
  if (!domainId || !userAddress) return [];

  const roles = getDomainRoles(domains, domainId, excludeInherited);
  if (!roles || !roles[userAddress]) return [];

  if (domainId === ROOT_DOMAIN && recoveryRoles.includes(userAddress)) {
    return roles[userAddress].concat(ROLES.RECOVERY);
  }

  return roles[userAddress];
};

/*
 * Eventually we'll switch all of the dApp to using new roles, but until then
 * we still need to be able to get the old roles `admins` and `founder`. This
 * util can be removed once the DLP project is completed.
 */
export const getLegacyRoles = (
  domains,
): { founder: Address; admins: Address[] } | void => {
  const rootDomainRoles = getDomainRoles(domains, ROOT_DOMAIN);
  const founder =
    Object.keys(rootDomainRoles).find(address => {
      const roles = rootDomainRoles[address];
      return (
        roles.includes(ROLES.ROOT) &&
        roles.includes(ROLES.ADMINISTRATION) &&
        roles.includes(ROLES.ARCHITECTURE) &&
        roles.includes(ROLES.FUNDING)
      );
    }) || ZERO_ADDRESS;

  const admins = Object.keys(rootDomainRoles).reduce(
    (acc, address) =>
      rootDomainRoles[address].includes(ROLES.ADMINISTRATION) &&
      address !== founder
        ? acc.add(address)
        : acc,
    new Set(),
  );

  return {
    founder,
    admins: Array.from(admins) as string[],
  };
};

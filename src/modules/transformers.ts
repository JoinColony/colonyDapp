import {
  ColonyRole,
  ColonyRoles,
  DomainRoles,
  ROOT_DOMAIN_ID,
} from '@colony/colony-js';

import { Address, UserRolesForDomain } from '~types/index';

export const getRolesForUserAndDomain = (
  roles: ColonyRoles,
  userAddress: Address,
  domainId: number,
): ColonyRole[] => {
  const userRoles = roles.find(({ address }) => address === userAddress);
  if (!userRoles) return [];
  const domainRoles = userRoles.domains.find(
    ({ domainId: ethDomainId }) => ethDomainId === domainId,
  );
  return domainRoles ? (domainRoles.roles as ColonyRole[]) : [];
};

const getRolesForUserAndParentDomains = (
  colony,
  userAddress: Address,
  domainId: number,
  roleSet = new Set<ColonyRole>(),
): ColonyRole[] => {
  const domain = colony?.domains?.find(
    ({ ethDomainId }) => ethDomainId === domainId,
  );
  if (!domain) return Array.from(roleSet);
  const roles = getRolesForUserAndDomain(colony.roles, userAddress, domainId);
  roles.forEach((role) => roleSet.add(role));
  if (domain.ethParentDomainId) {
    getRolesForUserAndParentDomains(
      colony,
      userAddress,
      domain.ethParentDomainId,
      roleSet,
    );
  }
  return Array.from(roleSet);
};

const getCombinedRolesForDomains = (
  domainIds: number[],
  domainRoles: DomainRoles[],
) => {
  return Array.from(
    domainRoles
      .filter(({ domainId }) => domainIds.includes(domainId))
      .reduce((roleSet, domainRole) => {
        domainRole.roles.forEach((role) => roleSet.add(role));
        return roleSet;
      }, new Set<ColonyRole>()),
  );
};

export const getAllUserRolesForDomain = (
  colony,
  domainId: number,
  excludeInherited = false,
): UserRolesForDomain[] => {
  if (!colony) return [];
  const { domains, roles } = colony;
  let domain = domains.find(({ ethDomainId }) => ethDomainId === domainId);
  if (!domain) return [];
  if (excludeInherited) {
    return roles.map(({ domains: domainRoles, address }) => {
      const foundDomain = domainRoles.find(
        ({ domainId: ethDomainId }) => ethDomainId === domainId,
      );
      return {
        address,
        domainId,
        roles: foundDomain ? foundDomain.roles : [],
      };
    });
  }
  const allDomainIds = [domainId];
  while (domain) {
    const parentId = domain.ethParentDomainId;
    domain = domains.find(({ ethDomainId }) => ethDomainId === parentId);
    if (domain) allDomainIds.push(domain.ethDomainId);
  }
  return roles.map(({ domains: domainRoles, address }) => ({
    address,
    domainId,
    roles: getCombinedRolesForDomains(allDomainIds, domainRoles),
  }));
};

export const getUserRolesForDomain = (
  colony,
  userAddress: Address | undefined,
  domainId: number | undefined,
  excludeInherited = false,
): ColonyRole[] => {
  if (!colony || !domainId || !userAddress) return [];
  if (excludeInherited) {
    return getRolesForUserAndDomain(colony.roles, userAddress, domainId);
  }
  return getRolesForUserAndParentDomains(colony, userAddress, domainId);
};

/* Gets all account addresses that have the ROOT role in the ROOT_DOMAIN */
export const getAllRootAccounts = (colony): Address[] => {
  if (!colony) return [];

  return colony.roles
    .filter(
      ({ domains }) =>
        !!domains.find(
          ({ domainId, roles }) =>
            domainId === ROOT_DOMAIN_ID && roles.includes(ColonyRole.Root),
        ),
    )
    .map(({ address }) => address);
};

export const getAllUserRoles = (colony, userAddress: Address): ColonyRole[] => {
  if (!colony) return [] as ColonyRole[];
  const userRoles = colony.roles.find(({ address }) => address === userAddress);
  if (!userRoles) return [] as ColonyRole[];
  return Array.from(
    userRoles.domains.reduce((allUserRoles, domain) => {
      domain.roles.forEach((role) => allUserRoles.add(role));
      return allUserRoles;
    }, new Set<ColonyRole>()),
  );
};

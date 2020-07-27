import { bigNumberify } from 'ethers/utils';
import { AddressZero } from 'ethers/constants';
import {
  ColonyRole,
  ColonyRoles,
  DomainRoles,
  ROOT_DOMAIN_ID,
} from '@colony/colony-js';

import { PersistentTasks, Colony } from '~data/index';
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
  colony: Colony,
  userAddress: Address,
  domainId: number,
  roleSet = new Set<ColonyRole>(),
): ColonyRole[] => {
  const domain = colony.domains.find(
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
  { domains, roles }: Colony,
  domainId: number,
  excludeInherited = false,
): UserRolesForDomain[] => {
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
  colony: Colony | undefined,
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
export const getAllRootAccounts = (colony: Colony | undefined): Address[] => {
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

export const getAllUserRoles = (
  colony: Colony | undefined,
  userAddress: Address,
): ColonyRole[] => {
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

/*
 * @NOTE Internal use only
 */
const getLegacyFounder = (colony: Colony): Address => {
  const rootDomainRoles = getAllUserRolesForDomain(colony, ROOT_DOMAIN_ID);
  const found = rootDomainRoles.find(({ roles }) => {
    return (
      roles.includes(ColonyRole.Root) &&
      roles.includes(ColonyRole.Administration) &&
      roles.includes(ColonyRole.Architecture) &&
      roles.includes(ColonyRole.Funding)
    );
  });
  return found ? found.address : AddressZero;
};

/*
 * @NOTE Internal use only
 */
const getLegacyAdmins = (
  colony: Colony,
  domainId: number = ROOT_DOMAIN_ID,
  founderAddress: Address,
): Address[] => {
  const rootDomainRoles = getAllUserRolesForDomain(colony, domainId);
  return rootDomainRoles
    .filter(
      ({ address, roles }) =>
        address !== founderAddress && roles.includes(ColonyRole.Administration),
    )
    .map(({ address }) => address);
};

/*
 * @NOTE This differs from the above transformer as it considers roles in any domain (root + subdomains)
 * to be an admin role
 */
export const getCommunityRoles = (
  colony: Colony,
): { founder: Address; admins: Address[] } => {
  const founder = getLegacyFounder(colony);
  const admins = colony.domains.reduce((adminSet, { ethDomainId }) => {
    const currentDomainAdmins = getLegacyAdmins(colony, ethDomainId, founder);
    currentDomainAdmins.forEach((address) => admins.add(address));
    return adminSet;
  }, new Set<string>());
  return {
    founder,
    admins: Array.from(admins),
  };
};

export const getLevelTotalPayouts = (
  levelSteps: PersistentTasks,
): {
  address: Address;
  amount: string;
  symbol: string;
}[] => {
  const levelTotalPayouts = levelSteps.reduce((prev, { payouts }) => {
    const current = prev;
    payouts.forEach(({ amount, token: { address, symbol } }) => {
      if (!current[address]) {
        const currentPayout = {
          amount,
          address,
          symbol,
        };
        current[address] = currentPayout;
      } else {
        const prevAmountBn = bigNumberify(current[address].amount);
        const summedAmountBn = bigNumberify(amount).add(prevAmountBn);
        current[address].amount = summedAmountBn.toString();
      }
    });
    return current;
  }, {});
  return Object.values(levelTotalPayouts);
};

import { bigNumberify } from 'ethers/utils';
import {
  ColonyRole,
  ColonyRoles,
  DomainRoles,
  ROOT_DOMAIN_ID,
} from '@colony/colony-js';
import { nanoid } from 'nanoid';

import { PersistentTasks, Colony } from '~data/index';
import { Address, UserRolesForDomain, ActionsPageFeedItem } from '~types/index';

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
  colony: Colony | undefined,
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

/*
 * @NOTE On typechecking the arguments
 * Although we have types for them, TS is being too whiny about creating this
 * union type, so in the interest of time I've removed them for now
 */
export const getActionsPageFeedItems = (
  networkEvents: any[] = [],
  transactionMessages: any[] = [],
): ActionsPageFeedItem[] =>
  [...networkEvents, ...transactionMessages]
    .map((unformattedItem) => {
      const {
        name,
        sourceType,
        context = { message: '' },
        values = {},
        from,
        initiatorAddress,
        sourceId,
        createdAt,
      } = unformattedItem;
      return {
        id: sourceId || nanoid(),
        name,
        type: sourceType === 'db' ? 'message' : 'event',
        values,
        message: context?.message,
        from: from || initiatorAddress,
        createdAt: new Date(createdAt),
      };
    })
    .sort(
      ({ createdAt: createdAtFirst }, { createdAt: createdAtSecond }) =>
        createdAtFirst.getTime() - createdAtSecond.getTime(),
    );

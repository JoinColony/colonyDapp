import BigNumber from 'bn.js';

import { ROLES, ROOT_DOMAIN } from '~constants';
import { PersistentTasks } from '~data/index';
import { DomainRolesType, DomainType } from '~immutable/index';
import { Address, RoleSetType, DomainsMapType } from '~types/index';
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

  // Start with the current domain to accumulate roles
  let parent = domains[domainId] as DomainType | null;
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
      // Ignore empty role sets
      if (!roles.size) return acc;
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

/* Gets all account addresses that have the ROOT role in the ROOT_DOMAIN */
export const getAllRootAccounts = (
  domains: DomainsMapType | null,
): Address[] => {
  if (!domains) return [];

  const rootDomain = domains[ROOT_DOMAIN];
  if (!rootDomain) return [];

  const rootAccountSet = new Set<Address>();

  Object.entries(rootDomain.roles).forEach(
    ([userAddress, roles]: [Address, ROLES[]]) => {
      if (roles.includes(ROLES.ROOT)) {
        rootAccountSet.add(userAddress);
      }
    },
  );

  return Array.from(rootAccountSet);
};

export const TEMP_getUserRolesWithRecovery = (
  domains: DomainsMapType | null,
  recoveryRoles: Address[],
  domainId: number | null,
  userAddress: Address | undefined,
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

export const getAllUserRoles = (
  domains: DomainsMapType | null,
  userAddress: Address | null,
): ROLES[] => {
  if (!domains) return [] as ROLES[];
  return Array.from(
    Object.values(domains).reduce(
      (allUserRoles: Set<ROLES>, domain: DomainType) => {
        if (!userAddress) return allUserRoles;
        if (domain.roles[userAddress]) {
          domain.roles[userAddress].forEach(role => allUserRoles.add(role));
        }
        return allUserRoles;
      },
      new Set(),
    ),
  );
};

/*
 * @NOTE Internal use only
 */
const getLegacyFounder = (
  rootDomainRoles: Record<string, RoleSetType>,
): Address =>
  Object.keys(rootDomainRoles).find(address => {
    const roles = rootDomainRoles[address];
    return (
      roles.includes(ROLES.ROOT) &&
      roles.includes(ROLES.ADMINISTRATION) &&
      roles.includes(ROLES.ARCHITECTURE) &&
      roles.includes(ROLES.FUNDING)
    );
  }) || ZERO_ADDRESS;

/*
 * @NOTE Internal use only
 */
const getLegacyAdmins = (
  domains: Record<string, DomainType>,
  domainId: number = ROOT_DOMAIN,
  founderAddress: Address,
): Address[] => {
  const domainRoles = getDomainRoles(domains, domainId);
  return Array.from(
    Object.keys(domainRoles).reduce(
      (acc, address) =>
        domainRoles[address].includes(ROLES.ADMINISTRATION) &&
        address !== founderAddress
          ? acc.add(address)
          : acc,
      new Set(),
    ),
  ) as string[];
};

/*
 * Eventually we'll switch all of the dApp to using new roles, but until then
 * we still need to be able to get the old roles `admins` and `founder`. This
 * util can be removed once the DLP project is completed.
 */
export const getLegacyRoles = (
  domains: Record<string, DomainType>,
): { founder: Address; admins: Address[] } | void => {
  const rootDomainRoles = getDomainRoles(domains, ROOT_DOMAIN);
  const founder = getLegacyFounder(rootDomainRoles);
  const admins = getLegacyAdmins(domains, ROOT_DOMAIN, founder);
  return {
    founder,
    admins: Array.from(admins) as string[],
  };
};

/*
 * @NOTE This differs from the above transformer as it considers roles in any domain (root + subdomains)
 * to be an admin role
 */
export const getCommunityRoles = (
  domains: Record<string, DomainType>,
): { founder: Address; admins: Address[] } => {
  const rootDomainRoles = getDomainRoles(domains, ROOT_DOMAIN);
  const founder = getLegacyFounder(rootDomainRoles);
  const admins = new Set();
  Object.keys(domains).map(domainId => {
    const currentDomainAdmins = getLegacyAdmins(
      domains,
      parseInt(domainId, 10),
      founder,
    );
    return currentDomainAdmins.map(adminAddress => admins.add(adminAddress));
  });
  return {
    founder,
    admins: Array.from(admins) as string[],
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
        const prevAmountBn = new BigNumber(current[address].amount);
        const summedAmountBn = new BigNumber(amount).add(prevAmountBn);
        current[address].amount = summedAmountBn.toString();
      }
    });
    return current;
  }, {});
  return Object.values(levelTotalPayouts);
};

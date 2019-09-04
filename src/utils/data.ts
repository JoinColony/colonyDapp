import generate from 'nanoid/generate';
import urlDictionary from 'nanoid/url';
import {
  COLONY_ROLE_ADMINISTRATION,
  COLONY_ROLE_ARCHITECTURE,
  COLONY_ROLE_FUNDING,
  COLONY_ROLE_ROOT,
} from '@colony/colony-js-client';

import {
  DomainType,
  RolesType,
  ColonyRolesObject,
  UserRolesObject,
} from '~immutable/index';
import { Address } from '~types/strings';
import { ZERO_ADDRESS } from '~utils/web3/constants';

// This should be opaque
export type RandomId = string;

export const generateUrlFriendlyId = (): RandomId =>
  generate(urlDictionary, 21);

/*
 * Eventually we'll switch all of the dApp to using new roles, but until then
 * we still need to be able to get the old roles `admins` and `founder`. This
 * util can be removed once the DLP project is completed.
 */
export const proxyOldRoles = (domainRoles: any): RolesType | void => {
  if (!domainRoles) {
    return undefined;
  }

  const rootDomainRoles = domainRoles[1] || {};

  const founder =
    Object.keys(rootDomainRoles).find(address => {
      const roles = rootDomainRoles[address];
      return (
        roles[COLONY_ROLE_ADMINISTRATION] &&
        roles[COLONY_ROLE_ARCHITECTURE] &&
        roles[COLONY_ROLE_FUNDING] &&
        roles[COLONY_ROLE_ROOT]
      );
    }) || ZERO_ADDRESS;
  const admins = Object.keys(rootDomainRoles).reduce(
    (acc, address) =>
      rootDomainRoles[address][COLONY_ROLE_ADMINISTRATION] &&
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

// Return parent of a domain or undefined
const getParentDomainId = (domains, domainId) =>
  (domains.find(({ id }) => id === domainId) || {}).parentId;

// Combine user roles object with user roles from another domain
const combineUserDomainRoles = (
  userDomainRoles: UserRolesObject,
  roles: ColonyRolesObject,
  domainId: number,
  userAddress: Address,
): UserRolesObject =>
  roles[domainId] && roles[domainId][userAddress]
    ? Object.keys(roles[domainId][userAddress]).reduce(
        (acc, role) => ({
          ...acc,
          [role]: acc[role] || roles[domainId][userAddress][role],
        }),
        { ...userDomainRoles },
      )
    : userDomainRoles;

export const includeParentRoles = (
  roles: ColonyRolesObject,
  domains: DomainType[],
) =>
  domains.reduce(
    (rolesObject, { id: domainId }) => ({
      ...rolesObject,
      [domainId]: Object.keys(roles[domainId] || {}).reduce(
        (domainObject, userAddress) => {
          let userDomainRoles = roles[domainId][userAddress];
          let parentDomainId = getParentDomainId(domains, domainId);

          /*
           * Traverse up the domains tree until there are no more parents, or we
           * have all permissions.
           */
          while (
            parentDomainId &&
            Object.values(userDomainRoles).find(hasRole => !hasRole) !==
              undefined
          ) {
            // Combine permissions we already found with those of the parent
            userDomainRoles = combineUserDomainRoles(
              userDomainRoles,
              roles,
              parentDomainId,
              userAddress,
            );

            // Get parent of the current domain
            parentDomainId = getParentDomainId(domains, parentDomainId);
          }
          return { ...domainObject, [userAddress]: userDomainRoles };
        },
        {},
      ),
    }),
    {},
  );

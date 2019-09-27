import generate from 'nanoid/generate';
import urlDictionary from 'nanoid/url';

import { Address, ColonyRoles, DomainRolesObject } from '~types/index';
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
export const proxyOldRoles = (
  rootDomainRoles: DomainRolesObject,
): { founder: Address; admins: Address[] } | void => {
  const founder =
    Object.keys(rootDomainRoles).find(address => {
      const roles = rootDomainRoles[address];
      return (
        roles.has(ColonyRoles.ROOT) &&
        roles.has(ColonyRoles.ADMINISTRATION) &&
        roles.has(ColonyRoles.ARCHITECTURE) &&
        roles.has(ColonyRoles.FUNDING)
      );
    }) || ZERO_ADDRESS;

  const admins = Object.keys(rootDomainRoles).reduce(
    (acc, address) =>
      rootDomainRoles[address].has(ColonyRoles.ADMINISTRATION) &&
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

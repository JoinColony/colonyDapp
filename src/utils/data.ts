import generate from 'nanoid/generate';
import urlDictionary from 'nanoid/url';

import { ROLES } from '~constants';
import { Address } from '~types/index';
import { DomainRolesType } from '~immutable/index';
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
  rootDomainRoles: DomainRolesType,
): { founder: Address; admins: Address[] } | void => {
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

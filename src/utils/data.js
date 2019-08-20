/* @flow */

import generate from 'nanoid/generate';
import urlDictionary from 'nanoid/url';
import {
  COLONY_ROLE_ADMINISTRATION,
  COLONY_ROLE_ARCHITECTURE,
  COLONY_ROLE_FUNDING,
  COLONY_ROLE_ROOT,
} from '@colony/colony-js-client';

import type { RolesType } from '~immutable';

import { ZERO_ADDRESS } from '~utils/web3/constants';

export opaque type RandomId: string = string;

// eslint-disable-next-line import/prefer-default-export
export const generateUrlFriendlyId = (): RandomId =>
  generate(urlDictionary, 21);

/*
 * Eventually we'll switch all of the dApp to using new roles, but until then
 * we still need to be able to get the old roles `admins` and `founder`. This
 * util can be removed once the DLP project is completed.
 */
export const proxyOldRoles = (domainRoles: *): ?RolesType => {
  if (!domainRoles) {
    return null;
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
    admins: Array.from(admins),
  };
};

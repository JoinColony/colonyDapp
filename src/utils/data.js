/* @flow */

import generate from 'nanoid/generate';
import urlDictionary from 'nanoid/url';
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import {
  COLONY_ROLE_ADMINISTRATION,
  COLONY_ROLE_ARCHITECTURE,
  COLONY_ROLE_FUNDING,
  COLONY_ROLE_ROOT,
} from '@colony/colony-js-client';

import type { ColonyRolesMap, RolesRecordType } from '~immutable';

import { RolesRecord } from '~immutable';
import { ZERO_ADDRESS } from '~utils/web3/constants';

export opaque type RandomId: string = string;

// eslint-disable-next-line import/prefer-default-export
export const generateUrlFriendlyId = (): RandomId =>
  generate(urlDictionary, 21);

export const proxyOldRoles = (domainRoles: ColonyRolesMap): RolesRecordType => {
  const rootDomainRoles = domainRoles.get(1, ImmutableMap());
  const founder =
    rootDomainRoles.findKey(
      roles =>
        roles.get(COLONY_ROLE_ADMINISTRATION) &&
        roles.get(COLONY_ROLE_ARCHITECTURE) &&
        roles.get(COLONY_ROLE_FUNDING) &&
        roles.get(COLONY_ROLE_ROOT),
    ) || ZERO_ADDRESS;
  const admins = rootDomainRoles.reduce(
    (acc, roles, address) =>
      roles.get(COLONY_ROLE_ADMINISTRATION) && address !== founder
        ? acc.add(address)
        : acc,
    ImmutableSet(),
  );

  return RolesRecord({
    founder,
    admins,
  });
};

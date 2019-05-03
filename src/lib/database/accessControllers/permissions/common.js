/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';

import {
  COLONY_ROLE_ADMINISTRATION,
  COLONY_ROLE_ROOT,
  COLONY_ROLES,
} from '@colony/colony-js-client';

import type { PermissionsManifest } from './types';

type ColonyRole = $Keys<typeof COLONY_ROLES>;

const isAny = (...promises): Promise<boolean> =>
  Promise.all(promises).then(values => values.some(value => !!value));

const makeUserHasRoleFn = (
  colonyClient: ColonyClientType,
  role: ColonyRole,
) => async (address: string): Promise<boolean> => {
  // do they have the role in the colony root domain
  const { hasRole } = await colonyClient.hasColonyRole.call({
    address,
    role,
    domainId: 1,
  });
  return hasRole;
};

export default function loadModule(
  colonyClient: ColonyClientType,
): PermissionsManifest {
  const isColonyAdmin = makeUserHasRoleFn(
    colonyClient,
    COLONY_ROLE_ADMINISTRATION,
  );
  const isColonyFounder = makeUserHasRoleFn(colonyClient, COLONY_ROLE_ROOT);

  return {
    'is-colony-admin': isColonyAdmin,
    'is-colony-founder': isColonyFounder,
    'is-colony-founder-or-admin': user =>
      isAny(isColonyAdmin(user), isColonyFounder(user)),
  };
}

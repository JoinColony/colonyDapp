/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';

import {
  ADMIN_ROLE,
  AUTHORITY_ROLES,
  FOUNDER_ROLE,
} from '@colony/colony-js-client';

import type { PermissionsManifest } from '~types';

type AuthorityRole = $Keys<typeof AUTHORITY_ROLES>;

const isAny = (...promises): Promise<boolean> =>
  Promise.all(promises).then(values => values.some(value => !!value));

const makeUserHasRoleFn = (
  colonyClient: ColonyClientType,
  role: AuthorityRole,
) => async (user: string): Promise<boolean> => {
  const { hasRole } = await colonyClient.hasUserRole.call({ user, role });
  return hasRole;
};

export default function loadModule(
  colonyClient: ColonyClientType,
): PermissionsManifest {
  const isColonyAdmin = makeUserHasRoleFn(colonyClient, ADMIN_ROLE);
  const isColonyFounder = makeUserHasRoleFn(colonyClient, FOUNDER_ROLE);

  return {
    'is-colony-admin': isColonyAdmin,
    'is-colony-founder': isColonyFounder,
    'is-colony-founder-or-admin': user =>
      isAny(isColonyAdmin(user), isColonyFounder(user)),
  };
}

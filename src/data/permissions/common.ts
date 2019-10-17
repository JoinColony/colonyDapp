import {
  ColonyClient,
  COLONY_ROLE_ROOT,
  COLONY_ROLE_ADMINISTRATION,
} from '@colony/colony-js-client';

import { ROOT_DOMAIN } from '~constants';
import { Address } from '~types/strings';
import { PermissionsManifest } from '../types';
import { makeUserHasRoleFn } from './utils';

export default function loadModule(
  colonyClient: ColonyClient,
): PermissionsManifest<any> {
  const isFounder = makeUserHasRoleFn(colonyClient, COLONY_ROLE_ROOT);
  const isAdmin = makeUserHasRoleFn(colonyClient, COLONY_ROLE_ADMINISTRATION);

  return {
    'is-founder': async (address: Address) => isFounder(address, ROOT_DOMAIN),
    'is-founder-or-admin': async (
      address: Address,
      { domainId = ROOT_DOMAIN }: { domainId: number },
    ) => {
      const hasAdminRole = await isAdmin(address, domainId);
      if (hasAdminRole) return hasAdminRole;

      return isFounder(address, ROOT_DOMAIN);
    },
  };
}

import { ColonyClient } from '@colony/colony-js-client';

import { ROLES, ROOT_DOMAIN } from '~constants';
import { Address } from '~types/strings';
import { PermissionsManifest } from '../types';
import { makeUserHasRoleFn } from './utils';

export default function loadModule(
  colonyClient: ColonyClient,
): PermissionsManifest<any> {
  const isRoot = makeUserHasRoleFn(colonyClient, ROLES.ROOT);
  const isAdmin = makeUserHasRoleFn(colonyClient, ROLES.ADMINISTRATION);
  const hasArchitecture = makeUserHasRoleFn(colonyClient, ROLES.ARCHITECTURE);

  return {
    'is-admin': async (
      address: Address,
      { domainId = ROOT_DOMAIN }: { domainId: number },
    ) => isAdmin(address, domainId),
    'is-root': async (address: Address) => isRoot(address, ROOT_DOMAIN),
    'has-root-architecture': async (address: Address) =>
      hasArchitecture(address, ROOT_DOMAIN),
  };
}

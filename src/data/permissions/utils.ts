import { ColonyClient } from '@colony/colony-js-client';

import { ROOT_DOMAIN, ROLES } from '~constants';
import { Address } from '~types/index';

import { PermissionModuleLoader } from '../types';

export const buildManifest = (
  colonyClient: ColonyClient,
  permissionModuleLoaders: PermissionModuleLoader<any>[] = [],
) =>
  permissionModuleLoaders.reduce(
    (manifest, loadModule) => ({ ...manifest, ...loadModule(colonyClient) }),
    {},
  );

export const makeUserHasRoleFn = (
  colonyClient: ColonyClient,
  role: ROLES,
) => async (address: Address, domainId: number): Promise<boolean> => {
  // This won't work anymore once we have a domain depth of > 1. This should probably go into ColonyJS then
  // But everything we built in the dapp (and even in ColonyJS) is making that assumption so I guess we're ok for now
  const { hasRole } = await colonyClient.hasColonyRole.call({
    address,
    role,
    domainId,
  });
  if (hasRole) return hasRole;
  const { hasRole: hasRoleInRoot } = await colonyClient.hasColonyRole.call({
    address,
    role,
    ROOT_DOMAIN,
  });
  return hasRoleInRoot;
};

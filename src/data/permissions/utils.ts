import { ColonyClient, COLONY_ROLES } from '@colony/colony-js-client';
import { Address } from '~types/strings';

import { PermissionModuleLoader } from '../types';

type ColonyRole = keyof [typeof COLONY_ROLES];

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
  role: ColonyRole,
) => async (address: Address, domainId: number): Promise<boolean> => {
  const { hasRole } = await colonyClient.hasColonyRole.call({
    address,
    role,
    domainId,
  });
  return hasRole;
};

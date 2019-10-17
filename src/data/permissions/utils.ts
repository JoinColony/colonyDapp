import { ColonyClient } from '@colony/colony-js-client';
import { Address, ColonyRoles } from '~types/index';

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
  role: ColonyRoles,
) => async (address: Address, domainId: string): Promise<boolean> => {
  const { hasRole } = await colonyClient.hasColonyRole.call({
    address,
    role,
    domainId: parseInt(domainId, 10),
  });
  return hasRole;
};

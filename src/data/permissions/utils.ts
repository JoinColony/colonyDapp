import { ColonyClient } from '@colony/colony-js-client';

import { ROLES } from '~constants';
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
  const { hasRole } = await colonyClient.hasColonyRole.call({
    address,
    role,
    domainId,
  });
  return hasRole;
};

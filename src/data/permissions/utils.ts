import ColonyNetworkClient from '@colony/colony-js-client';
import {
  PermissionsManifest,
  Permission,
  PermissionModuleLoader,
} from '~types/index';

export const buildManifest = (
  colonyClient: ColonyNetworkClient.ColonyClient,
  permissionModuleLoaders: PermissionModuleLoader[] = [],
) =>
  permissionModuleLoaders.reduce(
    (manifest, loadModule) => ({ ...manifest, ...loadModule(colonyClient) }),
    {},
  );

export const createPermission = (
  actionId: string,
  permission: Permission,
): PermissionsManifest => ({ [actionId]: permission });

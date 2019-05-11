/* @flow */

import ColonyNetworkClient from '@colony/colony-js-client';
import type {
  PermissionsManifest,
  Permission,
  PermissionModuleLoader,
} from '~types';

export const buildManifest = (
  colonyClient: ColonyNetworkClient.ColonyClient,
  permissionModuleLoaders: PermissionModuleLoader[] = [],
) =>
  permissionModuleLoaders.reduce(
    (manifest, loadModule) =>
      Object.assign({}, manifest, loadModule(colonyClient)),
    {},
  );

export const createPermission = (
  actionId: string,
  permission: Permission,
): PermissionsManifest => ({ [actionId]: permission });

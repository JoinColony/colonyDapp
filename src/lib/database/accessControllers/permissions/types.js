/* @flow */

export type ActionId = string;

export type PermissionVerifyFunction = (
  user: string,
  context: *,
) => Promise<boolean>;

export type Permission = PermissionVerifyFunction | { inherits: ActionId };

export type PermissionsManifest = {
  [actionId: ActionId]: Permission,
};

export type PermissionModuleLoader = (context: *) => PermissionsManifest;

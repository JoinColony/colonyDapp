export type ActionId = string;

export type PermissionVerifyFunction = (
  user: string,
  context: any,
) => Promise<boolean>;

export type Permission = PermissionVerifyFunction | { inherits: ActionId };

export type PermissionsManifest = {
  [actionId: string]: Permission;
};

export type PermissionModuleLoader = (context: any) => PermissionsManifest;

import { Address } from '~types/strings';

export type ActionId = string;

export type PermissionVerifyFunction<C extends object> = (
  userAddress: Address,
  context: C,
) => Promise<boolean>;

export type Permission<C extends object> =
  | PermissionVerifyFunction<C>
  | { inherits: ActionId };

export interface PermissionsManifest<C extends object> {
  [actionId: string]: Permission<C>;
}

export type PermissionModuleLoader<C extends object> = (
  context: C,
) => PermissionsManifest<C>;

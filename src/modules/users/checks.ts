import { UserPermissionsType, UserType } from '~immutable/index';

export const canEnterRecoveryMode = (permissions: UserPermissionsType | void) =>
  !!(permissions && permissions.canEnterRecoveryMode);

export const canCreateTask = (permissions: UserPermissionsType | void) =>
  !!(permissions && permissions.isAdmin);

export const canAdminister = (permissions: UserPermissionsType | void) =>
  !!(permissions && permissions.isAdmin);

export const isFounder = (permissions: UserPermissionsType | void) =>
  !!(permissions && permissions.isFounder);

export const userDidClaimProfile = ({ profile: { username } }: UserType) =>
  !!username;

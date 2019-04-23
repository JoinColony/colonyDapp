/* @flow */

import type { UserPermissionsType, UserType } from '~immutable';

/*
 * User permissions
 */
export const canEnterRecoveryMode = (permissions: ?UserPermissionsType) =>
  !!(permissions && permissions.canEnterRecoveryMode);

export const canCreateTask = (permissions: ?UserPermissionsType) =>
  !!(permissions && permissions.isAdmin);

export const canAdminister = (permissions: ?UserPermissionsType) =>
  !!(permissions && permissions.isAdmin);

export const userDidClaimProfile = (user: ?UserType) =>
  !!(user && user.profile && user.profile.username);

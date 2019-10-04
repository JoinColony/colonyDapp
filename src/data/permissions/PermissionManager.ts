import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';

import { ActionId, Permission, PermissionsManifest } from '../types/index';
import { log } from '~utils/debug';

// NOTE: I know this is a terrible name, we need to refactor it to favour composition over inheritance at some point
export default class PermissionManager {
  private readonly permissions: PermissionsManifest<any>;

  constructor(permissions: PermissionsManifest<any>) {
    if (!(permissions && Object.keys(permissions).length)) {
      throw new Error('Invalid configuration');
    }

    this.permissions = permissions;
  }

  static inheritsFromAnotherPermission(permission: Permission<any>) {
    return (
      isPlainObject(permission) &&
      isString((permission as any).inherits) &&
      (permission as any).inherits
    );
  }

  private async verify<C extends object>(
    permission: Permission<C>,
    user: string,
    context: C,
  ) {
    if (typeof permission === 'function') {
      return permission(user, context);
    }

    if (PermissionManager.inheritsFromAnotherPermission(permission)) {
      return this.verify(this.permissions[permission.inherits], user, context);
    }

    return false;
  }

  async can<C extends object>(actionId: ActionId, user: string, context: C) {
    if (!(this.permissions && Object.keys(this.permissions).length)) {
      throw new Error('Could not verify permission');
    }

    if (!user) {
      throw new Error('User is invalid or was not found');
    }

    const permission = this.permissions[actionId];
    if (!permission) {
      throw new Error(`Permission for action "${actionId}" not found`);
    }

    try {
      return this.verify<C>(permission, user, context);
    } catch (caughtError) {
      log.error(
        // eslint-disable-next-line max-len
        'An unexpected error occurred while verifying if user is allowed to perform an activity',
        caughtError,
      );
    }

    return false;
  }
}

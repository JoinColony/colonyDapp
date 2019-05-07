/* @flow */

import isPlainObject from 'lodash/isPlainObject';
import isString from 'lodash/isString';

import type {
  ActionId,
  Permission,
  PermissionsManifest,
} from './permissions/types';

import { log } from '../../../utils/debug';

// NOTE: I know this is a terrible name, we need to refactor it to favour composition over inheritance at some point
export default class PermissionManager {
  _permissions: PermissionsManifest;

  constructor(permissions: PermissionsManifest) {
    if (!(permissions && Object.keys(permissions).length)) {
      throw new Error('Invalid configuration');
    }

    this._permissions = permissions;
  }

  static inheritsFromAnotherPermission(permission: Permission) {
    return (
      isPlainObject(permission) &&
      isString(permission.inherits) &&
      permission.inherits
    );
  }

  async _verify<Context: Object>(
    permission: Permission,
    user: string,
    context?: Context,
  ) {
    if (typeof permission == 'function') {
      return permission(user, context);
    }

    if (this.constructor.inheritsFromAnotherPermission(permission)) {
      return this._verify(
        this._permissions[permission.inherits],
        user,
        context,
      );
    }

    return false;
  }

  async can<Context: Object>(
    actionId: ActionId,
    user: string,
    context?: Context,
  ) {
    if (!(this._permissions && Object.keys(this._permissions).length)) {
      throw new Error('Could not verify permission');
    }

    if (!user) {
      throw new Error('User is invalid or was not found');
    }

    const permission = this._permissions[actionId];
    if (!permission) {
      throw new Error(`Permission for action "${actionId}" not found`);
    }

    try {
      return this._verify<Context>(permission, user, context);
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

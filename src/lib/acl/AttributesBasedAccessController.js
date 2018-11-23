/* @flow */

import _ from 'lodash';

type ActionId = string;

type PermissionVerifyFunction = (user: string, context: *) => Promise<boolean>;

type Permission = PermissionVerifyFunction | { inherits: ActionId };

export type PermissionsManifest = {
  [actionId: ActionId]: Permission,
};

export default class AttributesBasedAccessController {
  _permissions: PermissionsManifest;

  constructor(permissions: PermissionsManifest) {
    if (!(permissions && Object.keys(permissions).length))
      throw new Error('Invalid configuration');

    this._permissions = permissions;
  }

  static inheritsFromAnotherPermission(permission: Permission) {
    return (
      _.isPlainObject(permission) &&
      _.isString(permission.inherits) &&
      permission.inherits
    );
  }

  async _verify<Context: Object>(
    permission: Permission,
    user: string,
    context?: Context,
  ) {
    if (typeof permission === 'function') return permission(user, context);

    if (this.constructor.inheritsFromAnotherPermission(permission))
      return this._verify(
        this._permissions[permission.inherits],
        user,
        context,
      );

    return false;
  }

  async can<Context: Object>(
    user: string,
    actionId: ActionId,
    context?: Context,
  ) {
    if (!(this._permissions && Object.keys(this._permissions).length))
      throw new Error('Could not verify permission');

    if (!user) throw new Error('User is invalid or was not found');

    const permission = this._permissions[actionId];
    if (!permission)
      throw new Error(`Permission for action "${actionId}" not found`);

    try {
      return this._verify<Context>(permission, user, context);
    } catch (exception) {
      console.error(
        // eslint-disable-next-line max-len
        `An unexpected error occurred while verifying if user is allowed to perform an activity. Details: ${
          exception.message
        }`,
      );
    }

    return false;
  }
}

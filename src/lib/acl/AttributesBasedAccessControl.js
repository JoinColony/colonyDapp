/* @flow */

export default class AttributesBasedAccessControl {
  constructor(permissions) {
    if (!(permissions && Object.keys(permissions).length)) {
      throw new Error('Invalid configuration');
    }

    this._permissions = permissions;
  }

  static isFunction(permission) {
    return typeof permission === 'function';
  }

  static isObject(permission) {
    return (
      typeof permission === 'object' && typeof permission.verify === 'function'
    );
  }

  static inheritsFromAnotherPermission(permission) {
    return (
      typeof permission === 'object' &&
      typeof permission.inherits === 'string' &&
      permission.inherits
    );
  }

  _verify(permission, user, context) {
    if (AttributesBasedAccessControl.isFunction(permission)) {
      return permission(user, context);
    }

    if (AttributesBasedAccessControl.isObject(permission)) {
      return permission.verify(user, context);
    }

    if (
      AttributesBasedAccessControl.inheritsFromAnotherPermission(permission)
    ) {
      return this.can(user, permission.inherits, context);
    }

    return false;
  }

  static getActions(actions) {
    if (!(actions && actions.length)) {
      const args = Array.isArray(actions)
        ? actions.map(action => typeof action).join(', ')
        : actions;

      throw new Error(
        // eslint-disable-next-line max-len
        `[invalid-actions] Expected a String or an Array of Strings but received [${args}] instead`,
      );
    }

    return !Array.isArray(actions) ? actions : [actions];
  }

  can(user, actions, context) {
    if (!user) {
      throw new Error('user-not-found', 'User is invalid or was not found');
    }

    const sanitizedActions = AttributesBasedAccessControl.getActions(actions);
    const permission = sanitizedActions.reduce(
      (parent, action) => parent[action],
      this._permissions,
    );
    if (!permission) {
      throw new Error(
        'action-not-found',
        `Action(s) [${sanitizedActions}] were not found`,
      );
    }

    try {
      return this._verify(permission, user, context);
    } catch (exception) {
      // eslint-disable-next-line no-console
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

/* @flow */
/* eslint-disable class-methods-use-this */

export default class PermissiveAccessController {
  async setup() {
    return null;
  }

  async grant() {
    return null;
  }

  async revoke() {
    return null;
  }

  async save() {
    return 'PERMISSIVE';
  }

  async canAppend() {
    return true;
  }
}

/* eslint-emable class-methods-use-this */

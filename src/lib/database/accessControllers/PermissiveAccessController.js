/* @flow */
/* eslint-disable class-methods-use-this, no-empty-function */

export default class PermissiveAccessController {
  async setup() {}

  async grant() {
    return true;
  }

  async revoke() {
    return true;
  }

  async save() {
    return 'PERMISSIVE';
  }

  async canAppend() {
    return true;
  }
}

/* eslint-emable class-methods-use-this */

/* @flow */

/* eslint-disable class-methods-use-this, no-empty-function */
export default class PermissiveAccessController {
  static get type() {
    return 'PERMISSIVE';
  }

  get type() {
    return this.constructor.type;
  }

  async load() {}

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
/* eslint-enable class-methods-use-this */

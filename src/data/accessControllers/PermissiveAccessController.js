/* @flow */

import AbstractAccessController from './AbstractAccessController';
import PurserIdentity from '../PurserIdentity';
import PurserIdentityProvider from '../PurserIdentityProvider';

/* eslint-disable class-methods-use-this, no-empty-function */
const type = 'permissive';
export default class PermissiveAccessController extends AbstractAccessController<
  PurserIdentity,
  PurserIdentityProvider<PurserIdentity>,
> {
  static get type() {
    return type;
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
    return type;
  }

  async canAppend() {
    return true;
  }
}
/* eslint-emable class-methods-use-this */

/* @flow */
/* eslint-disable flowtype/generic-spacing */

import type { UserRecord, UsersRecord } from '~immutable';

import ns from './namespace';

export type UsersState = {|
  [typeof ns]: {|
    allUsers: UsersRecord,
    currentUser: UserRecord,
  |},
|};

export type WalletMethod =
  | 'metamask'
  | 'trezor'
  | 'ledger'
  | 'mnemonic'
  | 'json'
  | 'trufflepig';

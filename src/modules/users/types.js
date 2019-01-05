/* @flow */
/* eslint-disable flowtype/generic-spacing */

import type { List as ListType } from 'immutable';
import type {
  UserRecord,
  UsersRecord,
  DataRecord,
  ContractTransactionRecord,
} from '~immutable';

import ns from './namespace';

export type UsersState = {|
  [typeof ns]: {|
    allUsers: UsersRecord,
    currentUser: UserRecord,
    currentUserTransactions: DataRecord<ListType<ContractTransactionRecord>>,
  |},
|};

export type WalletMethod =
  | 'metamask'
  | 'trezor'
  | 'ledger'
  | 'mnemonic'
  | 'json'
  | 'trufflepig';

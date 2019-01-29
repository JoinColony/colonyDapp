/* @flow */

import type {
  Collection as CollectionType,
  List as ListType,
  RecordOf,
} from 'immutable';

import type { AllUsersRecord } from './AllUsers';
import type { ContractTransactionRecord } from '../../ContractTransaction';
import type { DataRecord } from '../../Data';
import type { UserRecord } from '../../User';
import type { WalletRecord } from '../../Wallet';

export * from './AllUsers';

export type CurrentUserTransactions = DataRecord<
  ListType<ContractTransactionRecord>,
>;

export type CurrentUser = UserRecord;

export type UsersStateProps = {|
  allUsers: AllUsersRecord,
  currentUser: CurrentUser,
  currentUserTransactions: CurrentUserTransactions,
  wallet: WalletRecord,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type UsersStateRecord = CollectionType<*, *> & RecordOf<UsersStateProps>;

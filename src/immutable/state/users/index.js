/* @flow */

import type {
  Collection as CollectionType,
  List as ListType,
  RecordOf,
} from 'immutable';

import type { AllUsersRecord } from './AllUsers';
import type { ContractTransactionRecordType } from '../../ContractTransaction';
import type { DataRecordType } from '../../Data';
import type { UserRecordType } from '../../User';
import type { WalletRecordType } from '../../Wallet';

export * from './AllUsers';

export type CurrentUserTransactions = DataRecordType<
  ListType<ContractTransactionRecordType>,
>;

export type CurrentUser = UserRecordType;

export type UsersStateProps = {|
  allUsers: AllUsersRecord,
  currentUser: CurrentUser,
  currentUserTransactions: CurrentUserTransactions,
  wallet: WalletRecordType,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type UsersStateRecord = CollectionType<*, *> & RecordOf<UsersStateProps>;

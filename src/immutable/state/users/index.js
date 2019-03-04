/* @flow */

import type {
  Collection as CollectionType,
  List as ListType,
  RecordOf,
} from 'immutable';

import type { AllUsersRecord } from './AllUsers';
import type { ContractTransactionRecordType } from '../../ContractTransaction';
import type { DataRecordType } from '../../Data';
import type { WalletRecordType } from '../../Wallet';
import type { UserActivityRecordType } from '../../UserActivity';
import type { UserProfileRecordType } from '../../UserProfile';

export type CurrentUserTransactionsType = DataRecordType<
  ListType<ContractTransactionRecordType>,
>;

export * from './AllUsers';

export type CurrentUser = {|
  activities: ListType<UserActivityRecordType>,
  permissions: void, // TODO in #911
  profile: UserProfileRecordType,
  transactions: CurrentUserTransactionsType,
|};

export type UsersStateProps = {|
  allUsers: AllUsersRecord,
  currentUser: CurrentUser,
  wallet: WalletRecordType,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type UsersStateRecord = CollectionType<*, *> & RecordOf<UsersStateProps>;

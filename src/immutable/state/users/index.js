/* @flow */

import type {
  Collection as CollectionType,
  List as ListType,
  RecordOf,
} from 'immutable';

import type { AllUsersRecord } from './AllUsers';
import type { ContractTransactionRecordType } from '../../ContractTransaction';
import type { CurrentUserTasksRecordType } from './CurrentUserTasks';
import type { DataRecordType } from '../../Data';
import type { UserRecordType } from '../../User';
import type { WalletRecordType } from '../../Wallet';

export { default as CurrentUserTasksRecord } from './CurrentUserTasks';

export * from './AllUsers';
export * from './CurrentUserTasks';

export type CurrentUserTasks = DataRecordType<CurrentUserTasksRecordType>;

export type CurrentUserTransactions = DataRecordType<
  ListType<ContractTransactionRecordType>,
>;

export type CurrentUser = UserRecordType;

export type UsersStateProps = {|
  allUsers: AllUsersRecord,
  currentUser: CurrentUser,
  currentUserTasks: CurrentUserTasks,
  currentUserTransactions: CurrentUserTransactions,
  wallet: WalletRecordType,
|};

/*
 * NOTE: we do not need to define an actual Record factory (only the types),
 * because `combineReducers` from `redux-immutable` creates the Record.
 */
export type UsersStateRecord = CollectionType<*, *> & RecordOf<UsersStateProps>;

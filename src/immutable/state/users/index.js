/* @flow */

import type {
  Collection as CollectionType,
  List as ListType,
  Map as MapType,
  RecordOf,
} from 'immutable';

import type { ENSName } from '~types';

import type { AllUsersRecord } from './AllUsers';
import type { ContractTransactionRecordType } from '../../ContractTransaction';
import type { CurrentUserTasksRecordType } from './CurrentUserTasks';
import type { DataRecordType } from '../../Data';
import type { WalletRecordType } from '../../Wallet';
import type { UserActivityRecordType } from '../../UserActivity';
import type { UserProfileRecordType } from '../../UserProfile';
import type { UserPermissionsRecordType } from '../../UserPermissions';

export { default as CurrentUserTasksRecord } from './CurrentUserTasks';

export * from './AllUsers';
export * from './CurrentUserTasks';

// export type CurrentUserTasksType = DataRecordType<CurrentUserTasksRecordType>;

export type CurrentUserTransactionsType = DataRecordType<
  ListType<ContractTransactionRecordType>,
>;

export type CurrentUserPermissionsType = MapType<
  ENSName,
  DataRecordType<MapType<UserPermissionsRecordType>>,
>;

export type CurrentUser = {|
  activities: ListType<UserActivityRecordType>,
  permissions: CurrentUserPermissionsType,
  profile: UserProfileRecordType,
  tasks: DataRecordType<CurrentUserTasksRecordType>,
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

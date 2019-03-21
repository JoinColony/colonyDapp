/* @flow */

import type {
  Collection as CollectionType,
  List as ListType,
  Map as ImmutableMapType,
  Set as ImmutableSetType,
  RecordOf,
} from 'immutable';

import type { ENSName } from '~types';

import type { AllUsersRecord } from './AllUsers';
import type { ContractTransactionRecordType } from '../../ContractTransaction';
import type { DataRecordType } from '../../Data';
import type { TokenReferenceRecordType } from '../../TokenReference';
import type { UserActivityRecordType } from '../../UserActivity';
import type { UserMetadataRecordType } from '../../UserMetadata';
import type { UserPermissionsRecordType } from '../../UserPermissions';
import type { UserProfileRecordType } from '../../UserProfile';
import type { WalletRecordType } from '../../Wallet';

export * from './AllUsers';

export type CurrentUserTransactionsType = DataRecordType<
  ListType<ContractTransactionRecordType>,
>;

export type CurrentUserPermissionsType = ImmutableMapType<
  ENSName,
  DataRecordType<ImmutableMapType<UserPermissionsRecordType>>,
>;

export type CurrentUserColoniesType = ImmutableSetType<string>;

export type CurrentUserTasksType = ImmutableSetType<string>;

export type CurrentUserTokensType = DataRecordType<
  ListType<TokenReferenceRecordType>,
>;

export type CurrentUser = {|
  activities: ListType<UserActivityRecordType>,
  colonies: DataRecordType<CurrentUserColoniesType>,
  metadata: UserMetadataRecordType,
  permissions: CurrentUserPermissionsType,
  profile: UserProfileRecordType,
  tasks: DataRecordType<CurrentUserTasksType>,
  tokens: CurrentUserTokensType,
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

import {
  Collection,
  List,
  Map as ImmutableMap,
  Set as ImmutableSet,
  RecordOf,
} from 'immutable';

import { Address, ENSName } from '~types/index';
import { AllUsersRecord } from './AllUsers';
import { ContractTransactionRecord } from '../../ContractTransaction';
import { FetchableDataRecord } from '../../FetchableData';
import { TokenReferenceRecordType } from '../../TokenReference';
import { InboxItemRecordType } from '../../InboxItem';
import { UserPermissionsRecordType } from '../../UserPermissions';
import { UserProfileRecordType } from '../../UserProfile';
import { WalletRecordType } from '../../Wallet';
import { TaskDraftId } from '~immutable/Task';

export * from './AllUsers';

export type CurrentUserTransactionsType = FetchableDataRecord<
  List<ContractTransactionRecord>
>;

export type CurrentUserPermissionsType = ImmutableMap<
  ENSName,
  FetchableDataRecord<ImmutableMap<Address, UserPermissionsRecordType>>
>;

export type CurrentUserColoniesType = ImmutableSet<Address>;

export type CurrentUserTasksType = ImmutableSet<[Address, TaskDraftId]>;

export type CurrentUserTokensType = FetchableDataRecord<
  List<TokenReferenceRecordType>
>;

export interface CurrentUser {
  activities: List<InboxItemRecordType>;
  colonies: FetchableDataRecord<CurrentUserColoniesType>;
  permissions: CurrentUserPermissionsType;
  profile: UserProfileRecordType;
  tasks: FetchableDataRecord<CurrentUserTasksType>;
  tokens: CurrentUserTokensType;
  transactions: CurrentUserTransactionsType;
}

export interface UsersStateProps {
  allUsers: AllUsersRecord;
  currentUser: CurrentUser;
  wallet: WalletRecordType;
}

export type UsersStateRecord = Collection<any, any> & RecordOf<UsersStateProps>;

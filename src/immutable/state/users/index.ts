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
import { TokenReferenceRecord } from '../../TokenReference';
import { InboxItemRecord } from '../../InboxItem';
import { UserPermissionsRecord } from '../../UserPermissions';
import { UserProfileRecord } from '../../UserProfile';
import { WalletRecord } from '../../Wallet';
import { TaskDraftId } from '~immutable/Task';

export * from './AllUsers';

export type CurrentUserTransactionsType = FetchableDataRecord<
  List<ContractTransactionRecord>
>;

export type CurrentUserPermissionsType = ImmutableMap<
  ENSName,
  FetchableDataRecord<ImmutableMap<Address, UserPermissionsRecord>>
>;

export type CurrentUserColoniesType = ImmutableSet<Address>;

export type CurrentUserTasksType = ImmutableSet<[Address, TaskDraftId]>;

export type CurrentUserTokensType = FetchableDataRecord<
  List<TokenReferenceRecord>
>;

export interface CurrentUser {
  activities: List<InboxItemRecord>;
  colonies: FetchableDataRecord<CurrentUserColoniesType>;
  permissions: CurrentUserPermissionsType;
  profile: UserProfileRecord;
  tasks: FetchableDataRecord<CurrentUserTasksType>;
  tokens: CurrentUserTokensType;
  transactions: CurrentUserTransactionsType;
}

export interface UsersStateProps {
  allUsers: AllUsersRecord;
  currentUser: CurrentUser;
  wallet: WalletRecord;
}

export type UsersStateRecord = Collection<any, any> & RecordOf<UsersStateProps>;

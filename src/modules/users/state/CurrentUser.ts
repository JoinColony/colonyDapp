import {
  List,
  Map as ImmutableMap,
  Set as ImmutableSet,
  Record,
} from 'immutable';

import { Address, ENSName } from '~types/index';
import {
  ContractTransactionRecord,
  FetchableData,
  FetchableDataRecord,
  TokenReferenceRecord,
  InboxItemRecord,
  UserNotificationMetadata,
  UserNotificationMetadataRecord,
  UserPermissionsRecord,
  UserProfile,
  UserProfileRecord,
  TaskDraftId,
} from '~immutable/index';

import {
  USERS_INBOX_ITEMS,
  USERS_CURRENT_USER_NOTIFICATION_METADATA,
  USERS_CURRENT_USER_PERMISSIONS,
  USERS_CURRENT_USER_PROFILE,
  USERS_CURRENT_USER_TASKS,
  USERS_CURRENT_USER_TOKENS,
  USERS_CURRENT_USER_TRANSACTIONS,
} from '../constants';

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

interface CurrentUserProps {
  [USERS_INBOX_ITEMS]: List<InboxItemRecord>;
  [USERS_CURRENT_USER_NOTIFICATION_METADATA]: UserNotificationMetadataRecord;
  [USERS_CURRENT_USER_PERMISSIONS]: CurrentUserPermissionsType;
  [USERS_CURRENT_USER_PROFILE]: UserProfileRecord;
  [USERS_CURRENT_USER_TASKS]: FetchableDataRecord<CurrentUserTasksType>;
  [USERS_CURRENT_USER_TOKENS]: CurrentUserTokensType;
  [USERS_CURRENT_USER_TRANSACTIONS]: CurrentUserTransactionsType;
}

export class CurrentUserRecord extends Record<CurrentUserProps>({
  [USERS_INBOX_ITEMS]: List(),
  [USERS_CURRENT_USER_NOTIFICATION_METADATA]: UserNotificationMetadata(),
  [USERS_CURRENT_USER_PERMISSIONS]: ImmutableMap(),
  [USERS_CURRENT_USER_PROFILE]: UserProfile({
    walletAddress: '',
  }),
  [USERS_CURRENT_USER_TASKS]: FetchableData({
    record: ImmutableSet(),
  }),
  [USERS_CURRENT_USER_TOKENS]: FetchableData({
    record: List(),
  }),
  [USERS_CURRENT_USER_TRANSACTIONS]: FetchableData({
    record: List(),
  }),
}) {}

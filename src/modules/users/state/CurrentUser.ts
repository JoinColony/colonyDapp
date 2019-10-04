import { List, Set as ImmutableSet, Record } from 'immutable';

import { Address } from '~types/index';
import {
  ContractTransactionRecord,
  FetchableData,
  FetchableDataRecord,
  InboxItemRecord,
  UserNotificationMetadata,
  UserNotificationMetadataRecord,
  UserProfile,
  UserProfileRecord,
  UserTokenReferenceRecord,
  TaskDraftId,
} from '~immutable/index';

import {
  USERS_INBOX_ITEMS,
  USERS_CURRENT_USER_NOTIFICATION_METADATA,
  USERS_CURRENT_USER_PROFILE,
  USERS_CURRENT_USER_TASKS,
  USERS_CURRENT_USER_TOKENS,
  USERS_CURRENT_USER_TRANSACTIONS,
} from '../constants';

export type CurrentUserTransactionsType = FetchableDataRecord<
  List<ContractTransactionRecord>
>;

export type CurrentUserColoniesType = ImmutableSet<Address>;

export type CurrentUserTasksType = ImmutableSet<[Address, TaskDraftId]>;

export type CurrentUserTokensType = FetchableDataRecord<
  List<UserTokenReferenceRecord>
>;

interface CurrentUserProps {
  [USERS_INBOX_ITEMS]: FetchableDataRecord<List<InboxItemRecord>>;
  [USERS_CURRENT_USER_NOTIFICATION_METADATA]: UserNotificationMetadataRecord;
  [USERS_CURRENT_USER_PROFILE]: UserProfileRecord;
  [USERS_CURRENT_USER_TASKS]: FetchableDataRecord<CurrentUserTasksType>;
  [USERS_CURRENT_USER_TOKENS]: CurrentUserTokensType;
  [USERS_CURRENT_USER_TRANSACTIONS]: CurrentUserTransactionsType;
}

export class CurrentUserRecord extends Record<CurrentUserProps>({
  [USERS_INBOX_ITEMS]: FetchableData(),
  [USERS_CURRENT_USER_NOTIFICATION_METADATA]: UserNotificationMetadata(),
  [USERS_CURRENT_USER_PROFILE]: UserProfile({
    walletAddress: '',
  }),
  [USERS_CURRENT_USER_TASKS]: FetchableData(),
  [USERS_CURRENT_USER_TOKENS]: FetchableData(),
  [USERS_CURRENT_USER_TRANSACTIONS]: FetchableData(),
}) {}

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
  UserPermissionsRecord,
  UserProfile,
  UserProfileRecord,
  TaskDraftId,
} from '~immutable/index';

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
  activities: List<InboxItemRecord>;
  colonies: FetchableDataRecord<CurrentUserColoniesType>;
  permissions: CurrentUserPermissionsType;
  profile: UserProfileRecord;
  tasks: FetchableDataRecord<CurrentUserTasksType>;
  tokens: CurrentUserTokensType;
  transactions: CurrentUserTransactionsType;
}

export class CurrentUserRecord extends Record<CurrentUserProps>({
  activities: List(),
  colonies: FetchableData({
    record: ImmutableSet(),
  }),
  permissions: ImmutableMap(),
  profile: UserProfile({
    walletAddress: '',
  }),
  tasks: FetchableData({
    record: ImmutableSet(),
  }),
  tokens: FetchableData({
    record: List(),
  }),
  transactions: FetchableData({
    record: List(),
  }),
}) {}

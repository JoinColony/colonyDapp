import { List, Set as ImmutableSet, Record } from 'immutable';

import { Address } from '~types/index';
import {
  FetchableData,
  FetchableDataRecord,
  InboxItemRecord,
  UserTokenReferenceRecord,
  InboxItemType,
  UserTokenReferenceType,
} from '~immutable/index';
import { FetchableContractTransactionList } from '../../admin/state/index';

import {
  USERS_INBOX_ITEMS,
  USERS_CURRENT_USER_TOKENS,
  USERS_CURRENT_USER_TRANSACTIONS,
} from '../constants';

export type CurrentUserColoniesType = ImmutableSet<Address>;

type CurrentUserTokensList = List<UserTokenReferenceRecord> & {
  toJS(): UserTokenReferenceType[];
};

export type CurrentUserTokensType = FetchableDataRecord<CurrentUserTokensList>;

type CurrentUserInboxItemsList = List<InboxItemRecord> & {
  toJS(): InboxItemType[];
};

export type CurrentUserInboxItemsType = FetchableDataRecord<
  CurrentUserInboxItemsList
>;

interface CurrentUserProps {
  [USERS_INBOX_ITEMS]: CurrentUserInboxItemsType;
  [USERS_CURRENT_USER_TOKENS]: CurrentUserTokensType;
  [USERS_CURRENT_USER_TRANSACTIONS]: FetchableContractTransactionList;
}

export class CurrentUserRecord extends Record<CurrentUserProps>({
  [USERS_INBOX_ITEMS]: FetchableData() as CurrentUserInboxItemsType,
  [USERS_CURRENT_USER_TOKENS]: FetchableData() as CurrentUserTokensType,
  // eslint-disable-next-line max-len
  [USERS_CURRENT_USER_TRANSACTIONS]: FetchableData() as FetchableContractTransactionList,
}) {}

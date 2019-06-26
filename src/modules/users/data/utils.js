/* @flow */

import type { DDB } from '~lib/database';
import type { Address } from '~types';
import type { UserMetadataStore } from '~data/types';
import { USER_EVENT_TYPES } from '~data/constants';
import { getUserProfileStore, getUserInboxStore } from '~data/stores';
import { getUserProfileReducer, getUserTokensReducer } from './reducers';
import {
  NOTIFICATION_EVENT_ADMIN_ADDED,
  NOTIFICATION_EVENT_ASSIGNED,
  NOTIFICATION_EVENT_COLONY_ENS_CREATED,
  NOTIFICATION_EVENT_DOMAIN_ADDED,
  NOTIFICATION_EVENT_REQUEST_WORK,
  NOTIFICATION_EVENT_TASK_FINALIZED,
  NOTIFICATION_EVENT_TOKENS_MINTED,
  NOTIFICATION_EVENT_USER_MENTIONED,
  NOTIFICATION_EVENT_USER_TRANSFER,
} from '~users/Inbox/events';

const {
  ASSIGNED_TO_TASK,
  COMMENT_MENTION,
  TASK_FINALIZED_NOTIFICATION,
  TOKEN_ADDED,
  TOKEN_REMOVED,
  WORK_REQUEST,
} = USER_EVENT_TYPES;

export const getUserTokenAddresses = (metadataStore: UserMetadataStore) =>
  metadataStore
    .all()
    .filter(({ type }) => type === TOKEN_ADDED || type === TOKEN_REMOVED)
    .reduce(getUserTokensReducer, []);

const notificationsToEventsMapping = {
  [ASSIGNED_TO_TASK]: NOTIFICATION_EVENT_ASSIGNED,
  [COMMENT_MENTION]: NOTIFICATION_EVENT_USER_MENTIONED,
  [TASK_FINALIZED_NOTIFICATION]: NOTIFICATION_EVENT_TASK_FINALIZED,
  [WORK_REQUEST]: NOTIFICATION_EVENT_REQUEST_WORK,
  ColonyRoleSet: NOTIFICATION_EVENT_ADMIN_ADDED,
  ColonyLabelRegistered: NOTIFICATION_EVENT_COLONY_ENS_CREATED,
  DomainAdded: NOTIFICATION_EVENT_DOMAIN_ADDED,
  Mint: NOTIFICATION_EVENT_TOKENS_MINTED,
  Transfer: NOTIFICATION_EVENT_USER_TRANSFER,
};

export const transformNotificationEventNames = (eventName: string): string =>
  notificationsToEventsMapping[eventName];

export const getUserInboxStoreByProfileAddress = (ddb: DDB) => async ({
  walletAddress,
}: {
  walletAddress: Address,
}) => {
  const profileStore = await getUserProfileStore(ddb)({ walletAddress });
  const { inboxStoreAddress } = profileStore
    .all()
    .reduce(getUserProfileReducer, {});
  return getUserInboxStore(ddb)({
    inboxStoreAddress,
    walletAddress,
  });
};

/* @flow */

import type { ColonyNetworkClient } from '@colony/colony-js-client';

import type { DDB } from '~lib/database';
import type { Address, ColonyClient, ENSCache } from '~types';
import type { UserMetadataStore } from '~data/types';

import { USER_EVENT_TYPES } from '~data/constants';
import { getUserProfileStore, getUserInboxStore } from '~data/stores';
import { getUserProfileReducer, getUserTokensReducer } from './reducers';
import {
  NOTIFICATION_EVENT_COLONY_ROLE_SET,
  NOTIFICATION_EVENT_ASSIGNED,
  NOTIFICATION_EVENT_UNASSIGNED,
  NOTIFICATION_EVENT_COLONY_ENS_CREATED,
  NOTIFICATION_EVENT_DOMAIN_ADDED,
  NOTIFICATION_EVENT_REQUEST_WORK,
  NOTIFICATION_EVENT_TASK_FINALIZED,
  NOTIFICATION_EVENT_TOKENS_MINTED,
  NOTIFICATION_EVENT_USER_MENTIONED,
  NOTIFICATION_EVENT_USER_TRANSFER,
} from '~users/Inbox/events';
import { log } from '~utils/debug';
import { createAddress } from '~types';

const {
  ASSIGNED_TO_TASK,
  UNASSIGNED_FROM_TASK,
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
  [UNASSIGNED_FROM_TASK]: NOTIFICATION_EVENT_UNASSIGNED,
  [COMMENT_MENTION]: NOTIFICATION_EVENT_USER_MENTIONED,
  [TASK_FINALIZED_NOTIFICATION]: NOTIFICATION_EVENT_TASK_FINALIZED,
  [WORK_REQUEST]: NOTIFICATION_EVENT_REQUEST_WORK,
  ColonyRoleSet: NOTIFICATION_EVENT_COLONY_ROLE_SET,
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

export const getUserAddressByUsername = (
  ens: ENSCache,
  networkClient: ColonyNetworkClient,
) => async (username: string): Promise<?Address> => {
  try {
    return ens.getAddress(
      ens.constructor.getFullDomain('user', username),
      networkClient,
    );
  } catch (caughtError) {
    log.warn(caughtError);
    return null;
  }
};

export const getExtensionAddresses = async (
  colonyClient: ColonyClient,
): Promise<[Address, Address]> => {
  const {
    address: oldRolesAddress,
  } = await colonyClient.getExtensionAddress.call({
    contractName: 'OldRoles',
  });
  const { address: oneTxAddress } = await colonyClient.getExtensionAddress.call(
    {
      contractName: 'OneTxPayment',
    },
  );

  return [createAddress(oldRolesAddress), createAddress(oneTxAddress)];
};

export const decorateColonyEventPayload = ({ payload, ...event }: *) => ({
  ...event,
  payload: {
    ...payload,
    ...(() => {
      switch (event.type) {
        case 'ColonyRoleSet':
          return {
            colonyAddress: payload.sourceId,
            targetUserAddress: payload.address,
          };
        case 'DomainAdded':
          return {
            colonyAddress: payload.sourceId,
          };
        case 'Mint':
          return {
            colonyAddress: payload.address,
            tokenAddress: payload.sourceId,
          };
        case 'ColonyLabelRegistered':
          return {
            colonyAddress: payload.colony,
          };
        default:
          return {};
      }
    })(),
  },
});

/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { Address, ENSName, OrbitDBAddress } from '~types';
import type { DDB } from '../lib/database';
import type {
  EventStore,
  FeedStore,
  ValidatedKVStore,
} from '../lib/database/stores';

import { getENSDomainString } from '~utils/web3/ens';
import { set } from '../lib/database/commands';

import {
  colony as colonyStoreBlueprint,
  comments as commentsStoreBlueprint,
  task as taskStoreBlueprint,
  userActivities as userActivitiesStoreBlueprint,
  userInbox as userInboxStoreBlueprint,
  userMetadata as userMetadataStoreBlueprint,
  userProfile as userProfileStoreBlueprint,
} from './blueprints';

export const getColonyStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({
  colonyAddress,
  colonyENSName,
}: {
  colonyAddress: string,
  colonyENSName: ENSName,
}): Promise<EventStore> => {
  const colonyStoreAddress = await getENSDomainString('colony', colonyENSName);
  const colonyStore: EventStore = (await ddb.getStore(
    colonyStoreBlueprint,
    colonyStoreAddress,
    {
      wallet,
      colonyAddress,
      colonyClient,
    },
  ): any);
  return colonyStore;
};

export const createColonyStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({
  colonyAddress,
}: {
  colonyAddress: Address,
}): Promise<EventStore> => {
  const colonyStore: EventStore = (await ddb.createStore(colonyStoreBlueprint, {
    wallet,
    colonyAddress,
    colonyClient,
  }): any);
  return colonyStore;
};

export const getTaskStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({
  colonyAddress,
  taskStoreAddress,
  colonyENSName,
}: {
  colonyAddress: Address,
  taskStoreAddress: string | OrbitDBAddress,
  colonyENSName: ENSName,
}): Promise<EventStore> => {
  const taskStore: EventStore = (await ddb.getStore(
    taskStoreBlueprint,
    taskStoreAddress,
    {
      wallet,
      colonyAddress,
      colonyClient,
      meta: {
        colonyENSName,
      },
    },
  ): any);
  return taskStore;
};

export const getCommentsStore = (ddb: DDB) => async ({
  commentStoreAddress,
}: {
  commentStoreAddress: string | OrbitDBAddress,
}): Promise<FeedStore> => {
  const commentStore: FeedStore = (await ddb.getStore(
    commentsStoreBlueprint,
    commentStoreAddress,
  ): any);
  return commentStore;
};

export const createTaskStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({
  colonyAddress,
  colonyENSName,
}: {
  colonyAddress: Address,
  colonyENSName: ENSName,
}): Promise<{ taskStore: EventStore, commentsStore: FeedStore }> => {
  const taskStore: EventStore = (await ddb.createStore(taskStoreBlueprint, {
    wallet,
    colonyAddress,
    colonyClient,
    meta: {
      colonyENSName,
    },
  }): any);

  const commentsStore: FeedStore = (await ddb.createStore(
    commentsStoreBlueprint,
  ): any);
  return { taskStore, commentsStore };
};

export const getUserProfileStoreIdentifier = (id: string) => `user.${id}`;
export const getUserProfileStore = (ddb: DDB) => async (
  walletAddress: string,
  username?: string,
): Promise<ValidatedKVStore> => {
  const profileStore: ValidatedKVStore = (await ddb.getStore(
    userProfileStoreBlueprint,
    getUserProfileStoreIdentifier(username || walletAddress),
    {
      walletAddress,
    },
  ): any);
  return profileStore;
};

export const getUserProfileStoreByUsername = (ddb: DDB) => async (
  walletAddress: string,
  username: string,
): Promise<ValidatedKVStore> => {
  const profileStore: ValidatedKVStore = (await ddb.getStore(
    userProfileStoreBlueprint,
    getUserProfileStoreIdentifier(username),
    {
      walletAddress,
    },
  ): any);
  return profileStore;
};

export const getUserInboxStore = (ddb: DDB) => async (
  inboxStoreAddress: string | string | OrbitDBAddress,
  walletAddress: string,
): Promise<FeedStore> => {
  const inboxStore: FeedStore = (await ddb.getStore(
    userInboxStoreBlueprint,
    inboxStoreAddress,
    {
      walletAddress,
    },
  ): any);
  return inboxStore;
};

export const getUserActivityStore = (ddb: DDB) => async (
  userActivityStoreAddress: string | OrbitDBAddress,
  walletAddress: string,
): Promise<FeedStore> => {
  const activityStore: FeedStore = (await ddb.getStore(
    userActivitiesStoreBlueprint,
    userActivityStoreAddress,
    {
      walletAddress,
    },
  ): any);
  return activityStore;
};

export const getUserMetadataStore = (ddb: DDB) => async (
  userMetadataStoreAddress: string | OrbitDBAddress,
  walletAddress: string,
): Promise<EventStore> => {
  const metadataStore: EventStore = (await ddb.getStore(
    userMetadataStoreBlueprint,
    userMetadataStoreAddress,
    {
      walletAddress,
    },
  ): any);
  return metadataStore;
};

export const createUserProfileStore = (ddb: DDB) => async (
  walletAddress: string,
): Promise<{
  profileStore: ValidatedKVStore,
  inboxStore: FeedStore,
  activityStore: FeedStore,
  metadataStore: EventStore,
}> => {
  const profileStore: ValidatedKVStore = (await ddb.createStore(
    userProfileStoreBlueprint,
    {
      walletAddress,
    },
  ): any);
  const activityStore: FeedStore = (await ddb.createStore(
    userActivitiesStoreBlueprint,
    {
      walletAddress,
    },
  ): any);
  const inboxStore: FeedStore = (await ddb.createStore(
    userInboxStoreBlueprint,
    {
      walletAddress,
    },
  ): any);
  const metadataStore: EventStore = (await ddb.createStore(
    userMetadataStoreBlueprint,
    {
      walletAddress,
    },
  ): any);

  await set(profileStore, {
    activitiesStoreAddress: activityStore.address.toString(),
    inboxStoreAddress: inboxStore.address.toString(),
    metadataStoreAddress: metadataStore.address.toString(),
  });
  await profileStore.load();

  return { profileStore, activityStore, inboxStore, metadataStore };
};

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

// @TODO: Use an object instead of sequential arguments
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
}) => {
  const colonyStoreAddress = await getENSDomainString('colony', colonyENSName);
  return ddb.getStore<EventStore>(colonyStoreBlueprint, colonyStoreAddress, {
    wallet,
    colonyAddress,
    colonyClient,
  });
};

export const createColonyStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({ colonyAddress }: { colonyAddress: Address }) =>
  ddb.createStore<EventStore>(colonyStoreBlueprint, {
    wallet,
    colonyAddress,
    colonyClient,
  });

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
}) =>
  ddb.getStore<EventStore>(taskStoreBlueprint, taskStoreAddress, {
    wallet,
    colonyAddress,
    colonyClient,
    meta: {
      colonyENSName,
    },
  });

export const getCommentsStore = (ddb: DDB) => async ({
  commentStoreAddress,
}: {
  commentStoreAddress: string | OrbitDBAddress,
}) => ddb.getStore<FeedStore>(commentsStoreBlueprint, commentStoreAddress);

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
}) => {
  const [taskStore, commentsStore] = await Promise.all([
    ddb.createStore<EventStore>(taskStoreBlueprint, {
      wallet,
      colonyAddress,
      colonyClient,
      meta: {
        colonyENSName,
      },
    }),
    ddb.createStore<FeedStore>(commentsStoreBlueprint),
  ]);
  return { taskStore, commentsStore };
};

export const getUserProfileStoreIdentifier = (id: string) => `user.${id}`;
export const getUserProfileStore = (ddb: DDB) => async (
  walletAddress: string,
  username?: string,
) =>
  ddb.getStore<ValidatedKVStore>(
    userProfileStoreBlueprint,
    getUserProfileStoreIdentifier(username || walletAddress),
    {
      walletAddress,
    },
  );

export const getUserProfileStoreByUsername = (ddb: DDB) => async (
  walletAddress: string,
  username: string,
) =>
  ddb.getStore<ValidatedKVStore>(
    userProfileStoreBlueprint,
    getUserProfileStoreIdentifier(username),
    {
      walletAddress,
    },
  );

export const getUserInboxStore = (ddb: DDB) => async (
  inboxStoreAddress: string | string | OrbitDBAddress,
  walletAddress: string,
) =>
  ddb.getStore<FeedStore>(userInboxStoreBlueprint, inboxStoreAddress, {
    walletAddress,
  });

export const getUserActivityStore = (ddb: DDB) => async (
  userActivityStoreAddress: string | OrbitDBAddress,
  walletAddress: string,
) =>
  ddb.getStore<FeedStore>(
    userActivitiesStoreBlueprint,
    userActivityStoreAddress,
    {
      walletAddress,
    },
  );

export const getUserMetadataStore = (ddb: DDB) => async (
  userMetadataStoreAddress: string | OrbitDBAddress,
  walletAddress: string,
) =>
  ddb.getStore<EventStore>(
    userMetadataStoreBlueprint,
    userMetadataStoreAddress,
    {
      walletAddress,
    },
  );

export const createUserProfileStore = (ddb: DDB) => async (
  walletAddress: string,
) => {
  const [
    profileStore,
    activityStore,
    inboxStore,
    metadataStore,
  ] = await Promise.all([
    ddb.createStore<ValidatedKVStore>(userProfileStoreBlueprint, {
      walletAddress,
    }),
    ddb.createStore<FeedStore>(userActivitiesStoreBlueprint, {
      walletAddress,
    }),
    ddb.createStore<FeedStore>(userInboxStoreBlueprint, {
      walletAddress,
    }),
    ddb.createStore<EventStore>(userMetadataStoreBlueprint, {
      walletAddress,
    }),
  ]);

  await set(profileStore, {
    activitiesStoreAddress: activityStore.address.toString(),
    inboxStoreAddress: inboxStore.address.toString(),
    metadataStoreAddress: metadataStore.address.toString(),
  });
  await profileStore.load();

  return { profileStore, activityStore, inboxStore, metadataStore };
};

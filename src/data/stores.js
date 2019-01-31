/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { Address, ENSName } from '~types';

import { getENSDomainString } from '~utils/web3/ens';
import { DDB } from '../lib/database';
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

import { createCommentStoreCreatedEvent } from './events';

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
}): Promise<*> => {
  const colonyStoreAddress = await getENSDomainString('colony', colonyENSName);
  return ddb.getStore(colonyStoreBlueprint, colonyStoreAddress, {
    wallet,
    colonyAddress,
    colonyClient,
  });
};

export const createColonyStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({ colonyAddress }: { colonyAddress: Address }): Promise<*> =>
  ddb.createStore(colonyStoreBlueprint, {
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
  taskStoreAddress: string,
  colonyENSName: ENSName,
}): Promise<*> =>
  ddb.getStore(taskStoreBlueprint, taskStoreAddress, {
    wallet,
    colonyAddress,
    colonyClient,
    meta: {
      colonyENSName,
    },
  });

export const getCommentsStore = (ddb: DDB) => async (
  commentsStoreAddress: string,
): Promise<*> => ddb.getStore(commentsStoreBlueprint, commentsStoreAddress);

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
}): Promise<*> => {
  const taskStore = await ddb.createStore(taskStoreBlueprint, {
    wallet,
    colonyAddress,
    colonyClient,
    meta: {
      colonyENSName,
    },
  });

  const commentsStore = await ddb.createStore(commentsStoreBlueprint);

  if (!(taskStore && taskStore.init && typeof taskStore.init === 'function'))
    throw new Error('Invalid store type');

  // @TODO: Make sure we can use types properly with DDB
  // $FlowFixMe: This is going to be an EventStore
  await taskStore.init(
    createCommentStoreCreatedEvent({
      commentsStoreAddress: commentsStore.address.toString(),
    }),
  );
  await Promise.all([taskStore.load(), commentsStore.load()]);

  return { taskStore, commentsStore };
};

export const getUserProfileStoreIdentifier = (id: string) => `user.${id}`;
export const getUserProfileStore = (ddb: DDB) => async (
  walletAddress: string,
  username?: string,
): Promise<*> =>
  ddb.getStore(
    userProfileStoreBlueprint,
    getUserProfileStoreIdentifier(username || walletAddress),
    {
      walletAddress,
    },
  );

export const getUserProfileStoreByUsername = (ddb: DDB) => async (
  walletAddress: string,
  username: string,
): Promise<*> =>
  ddb.getStore(
    userProfileStoreBlueprint,
    getUserProfileStoreIdentifier(username),
    {
      walletAddress,
    },
  );

export const getUserInboxStore = (ddb: DDB) => async (
  inboxStoreAddress: string,
  walletAddress: string,
): Promise<*> =>
  ddb.getStore(userInboxStoreBlueprint, inboxStoreAddress, {
    walletAddress,
  });

export const getUserActivityStore = (ddb: DDB) => async (
  userActivityStoreAddress: string,
  walletAddress: string,
): Promise<*> =>
  ddb.getStore(userActivitiesStoreBlueprint, userActivityStoreAddress, {
    walletAddress,
  });

export const getUserMetadataStore = (ddb: DDB) => async (
  userMetadataStoreAddress: string,
  walletAddress: string,
): Promise<*> =>
  ddb.getStore(userMetadataStoreBlueprint, userMetadataStoreAddress, {
    walletAddress,
  });

export const createUserProfileStore = (ddb: DDB) => async (
  walletAddress: string,
): Promise<*> => {
  const profileStore = await ddb.createStore(userProfileStoreBlueprint, {
    walletAddress,
  });
  const activityStore = await ddb.createStore(userActivitiesStoreBlueprint, {
    walletAddress,
  });
  const inboxStore = await ddb.createStore(userInboxStoreBlueprint, {
    walletAddress,
  });
  const metadataStore = await ddb.createStore(userMetadataStoreBlueprint, {
    walletAddress,
  });

  await set(profileStore, {
    activitiesStoreAddress: activityStore.address.toString(),
    inboxStoreAddress: inboxStore.address.toString(),
    metadataStoreAddress: metadataStore.address.toString(),
  });
  await profileStore.load();

  return { profileStore, activityStore, inboxStore };
};

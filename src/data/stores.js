/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';

import type { Address, OrbitDBAddress } from '~types';
import type { TaskDraftId } from '~immutable';

import type { DDB } from '../lib/database';
import type {
  ColonyStore,
  CommentsStore,
  TaskStore,
  UserMetadataStore,
  UserProfileStore,
  UserInboxStore,
} from '~data/types';

import {
  colony as colonyStoreBlueprint,
  comments as commentsStoreBlueprint,
  task as taskStoreBlueprint,
  userInbox as userInboxStoreBlueprint,
  userMetadata as userMetadataStoreBlueprint,
  userProfile as userProfileStoreBlueprint,
} from './blueprints';

export const getColonyStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({ colonyAddress }: { colonyAddress: Address }) =>
  ddb.getStore<ColonyStore>(colonyStoreBlueprint, colonyAddress, {
    wallet,
    colonyAddress,
    colonyClient,
  });

export const createColonyStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({ colonyAddress }: { colonyAddress: Address }) =>
  ddb.createStore<ColonyStore>(colonyStoreBlueprint, {
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
  draftId,
  taskStoreAddress,
}: {
  colonyAddress: Address,
  draftId: TaskDraftId,
  taskStoreAddress: string | OrbitDBAddress,
}) =>
  ddb.getStore<TaskStore>(taskStoreBlueprint, taskStoreAddress, {
    colonyAddress,
    colonyClient,
    draftId,
    wallet,
  });

export const getCommentsStore = (ddb: DDB) => async ({
  commentsStoreAddress,
}: {
  commentsStoreAddress: string | OrbitDBAddress,
}) => ddb.getStore<CommentsStore>(commentsStoreBlueprint, commentsStoreAddress);

export const createTaskStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({
  draftId,
  colonyAddress,
}: {
  draftId: TaskDraftId,
  colonyAddress: Address,
}) => {
  const [taskStore, commentsStore] = await Promise.all([
    ddb.createStore<TaskStore>(taskStoreBlueprint, {
      colonyAddress,
      colonyClient,
      draftId,
      wallet,
    }),
    ddb.createStore<CommentsStore>(commentsStoreBlueprint, {
      colonyAddress,
      draftId,
    }),
  ]);
  return { taskStore, commentsStore };
};

export const getUserProfileStore = (ddb: DDB) => async ({
  walletAddress,
}: {
  walletAddress: Address,
}) =>
  ddb.getStore<UserProfileStore>(userProfileStoreBlueprint, walletAddress, {
    walletAddress,
  });

export const getUserInboxStore = (ddb: DDB) => async ({
  inboxStoreAddress,
  walletAddress,
}: {
  inboxStoreAddress: string | OrbitDBAddress,
  walletAddress: Address,
}) =>
  ddb.getStore<UserInboxStore>(userInboxStoreBlueprint, inboxStoreAddress, {
    walletAddress,
  });

export const getUserMetadataStore = (ddb: DDB) => async ({
  metadataStoreAddress,
  walletAddress,
}: {
  metadataStoreAddress: string | OrbitDBAddress,
  walletAddress: Address,
}) =>
  ddb.getStore<UserMetadataStore>(
    userMetadataStoreBlueprint,
    metadataStoreAddress,
    {
      walletAddress,
    },
  );

export const createUserProfileStore = (ddb: DDB) => async ({
  walletAddress,
}: {
  walletAddress: Address,
}) => {
  const [profileStore, inboxStore, metadataStore] = await Promise.all([
    ddb.createStore<UserProfileStore>(userProfileStoreBlueprint, {
      walletAddress,
    }),
    ddb.createStore<UserInboxStore>(userInboxStoreBlueprint, {
      walletAddress,
    }),
    ddb.createStore<UserMetadataStore>(userMetadataStoreBlueprint, {
      walletAddress,
    }),
  ]);

  await profileStore.set({
    inboxStoreAddress: inboxStore.address.toString(),
    metadataStoreAddress: metadataStore.address.toString(),
  });
  await profileStore.load();

  return { profileStore, inboxStore, metadataStore };
};

export const getTaskStoreAddress = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({
  draftId,
  colonyAddress,
}: {
  draftId: TaskDraftId,
  colonyAddress: Address,
}) =>
  ddb.generateStoreAddress(taskStoreBlueprint, {
    colonyAddress,
    colonyClient,
    draftId,
    wallet,
  });
export const getCommentsStoreAddress = (ddb: DDB) => async ({
  draftId,
  colonyAddress,
}: {
  draftId: TaskDraftId,
  colonyAddress: Address,
}) =>
  ddb.generateStoreAddress(commentsStoreBlueprint, {
    colonyAddress,
    draftId,
  });

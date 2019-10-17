import { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
// import { WalletObjectType } from '@colony/purser-core/flowtypes';

import { Address, ColonyClient, Wallet, DDB } from '~types/index';
import { TaskDraftId } from '~immutable/index';
import {
  ColonyStore,
  ColonyTaskIndexStore,
  CommentsStore,
  TaskStore,
  UserMetadataStore,
  UserProfileStore,
  UserInboxStore,
} from './types';

import {
  colony as colonyStoreBlueprint,
  colonyTaskIndex as colonyTaskIndexStoreBlueprint,
  comments as commentsStoreBlueprint,
  task as taskStoreBlueprint,
  userInbox as userInboxStoreBlueprint,
  userMetadata as userMetadataStoreBlueprint,
  userProfile as userProfileStoreBlueprint,
} from './blueprints';

// This should be more specific
type WalletObjectType = any;

/*
 * @NOTE:
 * 5 is the chainId for goerli: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md#list-of-chain-ids
 *
 * This shouldn't be used anywhere else. This is just about adding chainIds to
 * store addresses. DO NOT USE IT.
 *
 * If you use it somewhere else, I'll give you this look:
 * https://media.tenor.com/images/fbd6b74410e14c0ac96517eba36d44d0/tenor.gif
 *
 */
const CHAIN_ID = process.env.CHAIN_ID || '5';

export const getColonyTaskIndexStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({
  colonyAddress,
  colonyTaskIndexStoreAddress,
}: {
  colonyAddress: Address;
  colonyTaskIndexStoreAddress: string;
}) =>
  ddb.getStore<ColonyTaskIndexStore>(
    colonyTaskIndexStoreBlueprint,
    colonyTaskIndexStoreAddress,
    {
      chainId: CHAIN_ID,
      colonyAddress,
      colonyClient,
      wallet,
    },
  );

export const getColonyStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({ colonyAddress }: { colonyAddress: Address }) =>
  ddb.getStore<ColonyStore>(colonyStoreBlueprint, colonyAddress, {
    chainId: CHAIN_ID,
    colonyAddress,
    colonyClient,
    wallet,
  });

export const createColonyStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({ colonyAddress }: { colonyAddress: Address }) => {
  const chainId = CHAIN_ID;
  const colonyStore = await ddb.createStore<ColonyStore>(colonyStoreBlueprint, {
    chainId,
    colonyAddress,
    colonyClient,
    wallet,
  });

  const colonyTaskIndexStore = await ddb.createStore<ColonyTaskIndexStore>(
    colonyTaskIndexStoreBlueprint,
    {
      chainId,
      colonyAddress,
      colonyClient,
      wallet,
    },
  );

  return { colonyStore, colonyTaskIndexStore };
};

export const getTaskStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({
  colonyAddress,
  draftId,
  taskStoreAddress,
}: {
  colonyAddress: Address;
  draftId: TaskDraftId;
  taskStoreAddress: string;
}) =>
  ddb.getStore<TaskStore>(taskStoreBlueprint, taskStoreAddress, {
    chainId: CHAIN_ID,
    colonyAddress,
    colonyClient,
    draftId,
    domainId: null,
    wallet,
  });

export const getCommentsStore = (ddb: DDB) => async ({
  colonyAddress,
  commentsStoreAddress,
  draftId,
}: {
  colonyAddress: Address;
  commentsStoreAddress: string;
  draftId: TaskDraftId;
}) =>
  ddb.getStore<CommentsStore>(commentsStoreBlueprint, commentsStoreAddress, {
    chainId: CHAIN_ID,
    colonyAddress,
    draftId,
  });

export const createTaskStore = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({
  draftId,
  domainId,
  colonyAddress,
}: {
  draftId: TaskDraftId;
  domainId: number;
  colonyAddress: Address;
}) => {
  const chainId = CHAIN_ID;
  const [taskStore, commentsStore] = await Promise.all([
    ddb.createStore<TaskStore>(taskStoreBlueprint, {
      chainId,
      colonyAddress,
      colonyClient,
      draftId,
      domainId,
      wallet,
    }),
    ddb.createStore<CommentsStore>(commentsStoreBlueprint, {
      chainId,
      colonyAddress,
      draftId,
    }),
  ]);
  return { taskStore, commentsStore };
};

export const getUserProfileStore = (ddb: DDB) => async ({
  walletAddress,
}: {
  walletAddress: Address;
}) =>
  ddb.getStore<UserProfileStore>(userProfileStoreBlueprint, walletAddress, {
    chainId: CHAIN_ID,
    walletAddress,
  });

export const getUserInboxStore = (ddb: DDB) => async ({
  inboxStoreAddress,
  walletAddress,
}: {
  inboxStoreAddress: string;
  walletAddress: Address;
}) =>
  ddb.getStore<UserInboxStore>(userInboxStoreBlueprint, inboxStoreAddress, {
    chainId: CHAIN_ID,
    walletAddress,
  });

export const getUserMetadataStore = (ddb: DDB) => async ({
  metadataStoreAddress,
  walletAddress,
}: {
  metadataStoreAddress: string;
  walletAddress: Address;
}) =>
  ddb.getStore<UserMetadataStore>(
    userMetadataStoreBlueprint,
    metadataStoreAddress,
    {
      chainId: CHAIN_ID,
      walletAddress,
    },
  );

export const createUserProfileStore = (ddb: DDB) => async ({
  walletAddress,
}: {
  walletAddress: Address;
}) => {
  const chainId = CHAIN_ID;
  const [profileStore, inboxStore, metadataStore] = await Promise.all([
    ddb.createStore<UserProfileStore>(userProfileStoreBlueprint, {
      chainId,
      walletAddress,
    }),
    ddb.createStore<UserInboxStore>(userInboxStoreBlueprint, {
      chainId,
      walletAddress,
    }),
    ddb.createStore<UserMetadataStore>(userMetadataStoreBlueprint, {
      chainId,
      walletAddress,
    }),
  ]);

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
  draftId: TaskDraftId;
  colonyAddress: Address;
}) =>
  ddb.generateStoreAddress(taskStoreBlueprint, {
    chainId: CHAIN_ID,
    colonyAddress,
    colonyClient,
    draftId,
    wallet,
  });

export const getCommentsStoreAddress = (ddb: DDB) => async ({
  draftId,
  colonyAddress,
}: {
  draftId: TaskDraftId;
  colonyAddress: Address;
}) =>
  ddb.generateStoreAddress(commentsStoreBlueprint, {
    chainId: CHAIN_ID,
    colonyAddress,
    draftId,
  });

export const getUserProfileStoreAddress = (ddb: DDB) => async ({
  walletAddress,
}: {
  walletAddress: Address;
}) =>
  ddb.generateStoreAddress(userProfileStoreBlueprint, {
    chainId: CHAIN_ID,
    walletAddress,
  });

export const getUserInboxStoreAddress = (ddb: DDB) => async ({
  walletAddress,
}: {
  walletAddress: Address;
}) =>
  ddb.generateStoreAddress(userInboxStoreBlueprint, {
    chainId: CHAIN_ID,
    walletAddress,
  });

export const getUserMetadataStoreAddress = (ddb: DDB) => async ({
  walletAddress,
}: {
  walletAddress: Address;
}) =>
  ddb.generateStoreAddress(userMetadataStoreBlueprint, {
    chainId: CHAIN_ID,
    walletAddress,
  });

export const getColonyTaskIndexStoreAddress = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({ colonyAddress }: { colonyAddress: Address }) =>
  ddb.generateStoreAddress(colonyTaskIndexStoreBlueprint, {
    chainId: CHAIN_ID,
    colonyAddress,
    colonyClient,
    wallet,
  });

export const getColonyTaskStores = async (
  {
    colonyClient,
    ddb,
    wallet,
  }: {
    colonyClient: ColonyClient;
    ddb: DDB;
    wallet: Wallet;
  },
  metadata: { colonyAddress: Address },
) => {
  const { colonyAddress } = metadata;
  const colonyTaskIndexStoreAddress = await getColonyTaskIndexStoreAddress(
    colonyClient,
    ddb,
    wallet,
  )(metadata);
  const colonyTaskIndexStore = await getColonyTaskIndexStore(
    colonyClient,
    ddb,
    wallet,
  )({ colonyAddress, colonyTaskIndexStoreAddress });

  // backwards-compatibility Colony task index store
  let colonyStore;
  if (!colonyTaskIndexStore) {
    colonyStore = await getColonyStore(colonyClient, ddb, wallet)(metadata);
  }

  if (!(colonyStore || colonyTaskIndexStore)) {
    throw new Error('Could not load colony task index or colony store either');
  }

  return { colonyStore, colonyTaskIndexStore };
};

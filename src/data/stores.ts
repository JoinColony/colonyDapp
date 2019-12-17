import { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
// import { WalletObjectType } from '@colony/purser-core/flowtypes';

import { AnyTask } from '~data/index';
import { Address, ColonyClient, Wallet, DDB } from '~types/index';
import {
  ColonyStore,
  ColonyTaskIndexStore,
  CommentsStore,
  TaskStore,
} from './types';

import {
  colony as colonyStoreBlueprint,
  colonyTaskIndex as colonyTaskIndexStoreBlueprint,
  comments as commentsStoreBlueprint,
  task as taskStoreBlueprint,
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
  draftId: AnyTask['id'];
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
  draftId: AnyTask['id'];
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
  draftId:  AnyTask['id'];
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

export const getTaskStoreAddress = (
  colonyClient: ColonyClientType,
  ddb: DDB,
  wallet: WalletObjectType,
) => async ({
  draftId,
  colonyAddress,
}: {
  draftId: AnyTask['id'];
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
  draftId:  AnyTask['id'];
  colonyAddress: Address;
}) =>
  ddb.generateStoreAddress(commentsStoreBlueprint, {
    chainId: CHAIN_ID,
    colonyAddress,
    draftId,
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

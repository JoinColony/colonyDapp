import {
  COLONY_ROLE_ADMINISTRATION,
  COLONY_ROLE_ARBITRATION,
  COLONY_ROLE_ARCHITECTURE,
  COLONY_ROLE_ARCHITECTURE_SUBDOMAIN,
  COLONY_ROLE_FUNDING,
  COLONY_ROLE_RECOVERY,
  COLONY_ROLE_ROOT,
} from '@colony/colony-js-client';
import BigNumber from 'bn.js';

import { Address, createAddress, ENSCache } from '~types/index';
import {
  ColonyClient,
  ColonyManager,
  ColonyStore,
  ColonyTaskIndexStore,
  DDB,
  NetworkClient,
  Query,
  Subscription,
  Wallet,
} from '~data/types';
import { ColonyType, DomainType } from '~immutable/index';
import { Context } from '~context/index';
import { EventTypes } from '~data/constants';
import EventStore from '~lib/database/stores/EventStore';
import {
  getColonyStore,
  getColonyTaskIndexStore,
  getColonyTaskIndexStoreAddress,
} from '~data/stores';
import { getEvents } from '~utils/web3/eventLogs';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import { colonyReducer, colonyTasksReducer } from '../reducers';

interface ColonyStoreMetadata {
  colonyAddress: Address;
}

interface ColonyTaskIndexStoreMetadata {
  colonyAddress: Address;
}

type ContractEventQuery<A, R> = Query<ColonyClient, ColonyStoreMetadata, A, R>;

const context = [Context.COLONY_MANAGER];
const colonyContext = [
  Context.COLONY_MANAGER,
  Context.DDB_INSTANCE,
  Context.WALLET,
];

export const prepareColonyClientQuery = async (
  {
    colonyManager,
  }: {
    colonyManager: ColonyManager;
  },
  { colonyAddress }: ColonyStoreMetadata,
) => {
  if (!colonyAddress)
    throw new Error('Cannot prepare query. Metadata is invalid');
  return colonyManager.getColonyClient(colonyAddress);
};

const prepareColonyStoreQuery = async (
  {
    colonyManager,
    ddb,
    wallet,
  }: {
    colonyManager: ColonyManager;
    ddb: DDB;
    wallet: Wallet;
  },
  metadata: ColonyStoreMetadata,
) => {
  const { colonyAddress } = metadata;
  const colonyClient = await colonyManager.getColonyClient(colonyAddress);
  return getColonyStore(colonyClient, ddb, wallet)(metadata);
};

export const getColonyRoles: ContractEventQuery<
  void,
  {
    [domainId: number]: {
      [address: string]: { [role: string]: boolean };
    };
  }
> = {
  name: 'getColonyRoles',
  context,
  prepare: prepareColonyClientQuery,
  async execute(colonyClient) {
    const {
      events: { ColonyRoleSet },
      contract: { address: colonyAddress },
    } = colonyClient;
    const events = await getEvents(
      colonyClient,
      {
        address: colonyAddress,
      },
      {
        blocksBack: 400000,
        events: [ColonyRoleSet],
      },
    );

    // get extension addresses for the colony
    const {
      address: oneTxAddress,
    } = await colonyClient.getExtensionAddress.call({
      contractName: 'OneTxPayment',
    });
    const extensionAddresses = [createAddress(oneTxAddress)];

    // reduce events to { [domainId]: { [address]: { [role]: boolean } } }
    return events.reduce((acc, { address, setTo, role, domainId }) => {
      const normalizedAddress = createAddress(address);

      // don't include roles of extensions
      if (extensionAddresses.includes(normalizedAddress)) {
        return acc;
      }

      return {
        ...acc,
        [domainId]: {
          ...acc[domainId],
          [normalizedAddress as string]: {
            ...(acc[domainId] || {})[normalizedAddress],
            [role]: setTo,
          },
        },
      };
    }, {});
  },
};

export const getColonyDomainUserRoles: ContractEventQuery<
  { userAddress: Address; domainId: number },
  { [role: string]: boolean }
> = {
  name: 'getColonyDomainUserRoles',
  context,
  prepare: prepareColonyClientQuery,
  async execute(colonyClient, { userAddress: address, domainId }) {
    const [
      ADMINISTRATION,
      ARBITRATION,
      ARCHITECTURE,
      ARCHITECTURE_SUBDOMAIN,
      FUNDING,
      RECOVERY,
      ROOT,
    ] = await Promise.all([
      colonyClient.hasColonyRole.call({
        address,
        domainId,
        role: COLONY_ROLE_ADMINISTRATION,
      }),
      colonyClient.hasColonyRole.call({
        address,
        domainId,
        role: COLONY_ROLE_ARBITRATION,
      }),
      colonyClient.hasColonyRole.call({
        address,
        domainId,
        role: COLONY_ROLE_ARCHITECTURE,
      }),
      colonyClient.hasColonyRole.call({
        address,
        domainId,
        role: COLONY_ROLE_ARCHITECTURE_SUBDOMAIN,
      }),
      colonyClient.hasColonyRole.call({
        address,
        domainId,
        role: COLONY_ROLE_FUNDING,
      }),
      colonyClient.hasColonyRole.call({
        address,
        domainId,
        role: COLONY_ROLE_RECOVERY,
      }),
      colonyClient.hasColonyRole.call({
        address,
        domainId,
        role: COLONY_ROLE_ROOT,
      }),
    ]).then(results => results.map(({ hasRole }) => hasRole));

    return {
      ADMINISTRATION,
      ARBITRATION,
      ARCHITECTURE,
      ARCHITECTURE_SUBDOMAIN,
      FUNDING,
      RECOVERY,
      ROOT,
    };
  },
};

export const subscribeToColony: Subscription<
  {
    colonyClient: ColonyClient;
    colonyStore: ColonyStore;
    colonyAddress: Address;
  },
  ColonyStoreMetadata,
  any,
  ColonyType
> = {
  name: 'subscribeToColony',
  context: colonyContext,
  async prepare(
    {
      colonyManager,
      ddb,
      wallet,
    }: {
      colonyManager: ColonyManager;
      ddb: DDB;
      wallet: Wallet;
    },
    metadata: ColonyStoreMetadata,
  ) {
    const { colonyAddress } = metadata;
    const colonyClient = await colonyManager.getColonyClient(colonyAddress);
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    return {
      colonyClient,
      colonyStore,
      colonyAddress,
    };
  },
  async execute({ colonyStore, colonyClient, colonyAddress }) {
    const { inRecoveryMode } = await colonyClient.isInRecoveryMode.call();
    const { version } = await colonyClient.getVersion.call();

    // wrap this in a try/catch since it will fail if token doesn't support locking
    let isNativeTokenLocked;
    try {
      ({
        locked: isNativeTokenLocked,
      } = await colonyClient.tokenClient.isLocked.call());
    } catch (error) {
      isNativeTokenLocked = false;
    }

    // wrap this in a try/catch since it will fail if token can't be unlocked
    let canUnlockNativeToken;
    try {
      await colonyClient.tokenClient.unlock.call({});
      canUnlockNativeToken = isNativeTokenLocked;
    } catch (error) {
      canUnlockNativeToken = false;
    }

    // @TODO Normalize colony subscription events
    return emitter => [
      colonyStore.subscribe(events =>
        emitter(
          events &&
            events.reduce(colonyReducer, {
              avatarHash: undefined,
              colonyAddress,
              colonyName: '',
              displayName: '',
              inRecoveryMode,
              isNativeTokenLocked,
              canUnlockNativeToken,
              tokens: {
                // also include Ether
                [ZERO_ADDRESS.toString()]: {
                  address: ZERO_ADDRESS,
                },
              },
              version,
            }),
        ),
      ),
    ];
  },
};

/**
 * @todo Get the right defaults for data reducers based on the redux data.
 */
export const getColony: Query<
  { colonyClient: ColonyClient; colonyStore: ColonyStore },
  ColonyStoreMetadata,
  { colonyAddress: Address },
  ColonyType
> = {
  name: 'getColony',
  context: colonyContext,
  async prepare(
    {
      colonyManager,
      ddb,
      wallet,
    }: {
      colonyManager: ColonyManager;
      ddb: DDB;
      wallet: Wallet;
    },
    metadata: ColonyStoreMetadata,
  ) {
    const { colonyAddress } = metadata;
    const colonyClient = await colonyManager.getColonyClient(colonyAddress);
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    return {
      colonyClient,
      colonyStore,
    };
  },
  async execute({ colonyStore, colonyClient }, { colonyAddress }) {
    const { inRecoveryMode } = await colonyClient.isInRecoveryMode.call();
    const { version } = await colonyClient.getVersion.call();

    // wrap this in a try/catch since it will fail if token doesn't support locking
    let isNativeTokenLocked;
    try {
      ({
        locked: isNativeTokenLocked,
      } = await colonyClient.tokenClient.isLocked.call());
    } catch (error) {
      isNativeTokenLocked = false;
    }

    // wrap this in a try/catch since it will fail if token can't be unlocked
    let canUnlockNativeToken;
    try {
      await colonyClient.tokenClient.unlock.call({});
      canUnlockNativeToken = isNativeTokenLocked;
    } catch (error) {
      canUnlockNativeToken = false;
    }

    return colonyStore.all().reduce(colonyReducer, {
      avatarHash: undefined,
      colonyAddress,
      colonyName: '',
      displayName: '',
      inRecoveryMode,
      isNativeTokenLocked,
      canUnlockNativeToken,
      tokens: {
        // also include Ether
        [ZERO_ADDRESS.toString()]: {
          address: ZERO_ADDRESS,
        },
      },
      version,
    });
  },
};

// @NOTE: This is a separate query so we can, later on, cache the query result
export const getColonyTasks: Query<
  {
    colonyStore: ColonyStore | null;
    colonyTaskIndexStore: ColonyTaskIndexStore | null;
  },
  ColonyTaskIndexStoreMetadata,
  void,
  {
    [draftId: string]: {
      commentsStoreAddress: string;
      taskStoreAddress: string;
    };
  }
> = {
  name: 'getColonyTasks',
  context: colonyContext,
  async prepare(
    {
      colonyManager,
      ddb,
      wallet,
    }: {
      colonyManager: ColonyManager;
      ddb: DDB;
      wallet: Wallet;
    },
    metadata: ColonyStoreMetadata,
  ) {
    const { colonyAddress } = metadata;
    const colonyClient = await colonyManager.getColonyClient(colonyAddress);
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
      throw new Error(
        'Could not load colony task index or colony store either',
      );
    }

    return {
      colonyStore,
      colonyTaskIndexStore,
    };
  },
  async execute({ colonyStore, colonyTaskIndexStore }) {
    if (!(colonyStore || colonyTaskIndexStore)) {
      throw new Error(
        'Could not load colony task index or colony store either',
      );
    }
    // backwards-compatibility Colony task index store
    const store = colonyTaskIndexStore || colonyStore;
    return store
      .all()
      .filter(
        ({ type }) =>
          type === EventTypes.TASK_STORE_REGISTERED ||
          type === EventTypes.TASK_STORE_UNREGISTERED,
      )
      .reduce(colonyTasksReducer, {});
  },
};

export const getColonyDomains: Query<
  ColonyStore,
  ColonyStoreMetadata,
  void,
  DomainType[]
> = {
  name: 'getColonyDomains',
  context: colonyContext,
  prepare: prepareColonyStoreQuery,
  async execute(colonyStore) {
    return colonyStore
      .all()
      .filter(
        ({ type }) =>
          type === EventTypes.DOMAIN_CREATED ||
          type === EventTypes.DOMAIN_EDITED,
      )
      .sort((a, b) => a.meta.timestamp - b.meta.timestamp)
      .reduce((domains, event) => {
        const {
          payload: { domainId: currentDomainId },
        } = event;
        const difference = domains.filter(
          ({ payload: { domainId } }) => currentDomainId !== domainId,
        );

        return [...difference, event];
      }, [])
      .map(({ payload: { domainId, name } }) => ({
        id: domainId,
        name,
        // All will have parent of root for now
        parentId: 1,
      }));
  },
};

export const getColonyTokenBalance: Query<
  ColonyClient,
  { colonyAddress: Address },
  { tokenAddress: Address },
  BigNumber
> = {
  name: 'getColonyTokenBalance',
  context: colonyContext,
  prepare: async (
    { colonyManager }: { colonyManager: ColonyManager },
    { colonyAddress },
  ) => colonyManager.getColonyClient(colonyAddress),
  async execute(colonyClient, { tokenAddress: token }) {
    const {
      total: nonRewardsPotsTotal,
    } = await colonyClient.getNonRewardPotsTotal.call({ token });
    const {
      balance: rewardsPotTotal,
    } = await colonyClient.getFundingPotBalance.call({ potId: 0, token });
    return new BigNumber(nonRewardsPotsTotal.add(rewardsPotTotal).toString(10));
  },
};

export const getColonyCanMintNativeToken: Query<
  ColonyClient,
  { colonyAddress: Address },
  void,
  boolean
> = {
  name: 'getColonyCanMintNativeToken',
  context: colonyContext,
  async prepare(
    {
      colonyManager,
    }: {
      colonyManager: ColonyManager;
    },
    metadata: ColonyStoreMetadata,
  ) {
    const { colonyAddress } = metadata;
    return colonyManager.getColonyClient(colonyAddress);
  },
  async execute(colonyClient) {
    // wrap this in a try/catch since it will fail if tokens can't be minted
    try {
      await colonyClient.mintTokens.estimate({ amount: new BigNumber(1) });
    } catch (error) {
      return false;
    }
    return true;
  },
};

export const checkColonyNameIsAvailable: Query<
  { ens: ENSCache; networkClient: NetworkClient },
  void,
  { colonyName: string },
  boolean
> = {
  name: 'checkColonyNameIsAvailable',
  context: [Context.COLONY_MANAGER, Context.ENS_INSTANCE],
  async prepare({
    colonyManager: { networkClient },
    ens,
  }: {
    colonyManager: ColonyManager;
    ens: ENSCache;
  }) {
    return { ens, networkClient };
  },
  async execute({ ens, networkClient }, { colonyName }) {
    return ens.isENSNameAvailable('colony', colonyName, networkClient);
  },
};

export const subscribeToColonyTasks: Subscription<
  {
    colonyStore: ColonyStore | void;
    colonyTaskIndexStore: ColonyTaskIndexStore | void;
  },
  ColonyTaskIndexStoreMetadata,
  void,
  {
    [draftId: string]: {
      commentsStoreAddress: string;
      taskStoreAddress: string;
    };
  }
> = {
  name: 'subscribeToColonyTasks',
  context: colonyContext,
  async prepare(
    {
      colonyManager,
      ddb,
      wallet,
    }: {
      colonyManager: ColonyManager;
      ddb: DDB;
      wallet: Wallet;
    },
    metadata: ColonyStoreMetadata,
  ) {
    const { colonyAddress } = metadata;
    const colonyClient = await colonyManager.getColonyClient(colonyAddress);
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
      throw new Error(
        'Could not load colony task index or colony store either',
      );
    }

    return {
      colonyStore,
      colonyTaskIndexStore,
    };
  },
  async execute({ colonyStore, colonyTaskIndexStore }) {
    if (!(colonyStore || colonyTaskIndexStore)) {
      throw new Error(
        'Could not load colony task index or colony store either',
      );
    }
    // backwards-compatibility Colony task index store
    const store = (colonyTaskIndexStore || colonyStore) as EventStore;
    return emitter => [
      store.subscribe(events =>
        emitter(
          events &&
            events
              .filter(
                ({ type }) =>
                  type === EventTypes.TASK_STORE_REGISTERED ||
                  type === EventTypes.TASK_STORE_UNREGISTERED,
              )
              .reduce(colonyTasksReducer, {}),
        ),
      ),
    ];
  },
};

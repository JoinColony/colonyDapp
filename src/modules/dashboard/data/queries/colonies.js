/* @flow */

import {
  COLONY_ROLE_ADMINISTRATION,
  COLONY_ROLE_ARCHITECTURE,
  COLONY_ROLE_FUNDING,
  COLONY_ROLE_ROOT,
} from '@colony/colony-js-client';

import type { Address, ENSCache } from '~types';

import type {
  ColonyManager,
  ColonyClient,
  ColonyStore,
  ColonyTaskIndexStore,
  DDB,
  Event,
  NetworkClient,
  Query,
  Subscription,
  Wallet,
} from '~data/types';
import type { ColonyType, DomainType } from '~immutable';

import BigNumber from 'bn.js';
import { CONTEXT } from '~context';
import { COLONY_EVENT_TYPES } from '~data/constants';

import {
  getColonyStore,
  getColonyTaskIndexStore,
  getColonyTaskIndexStoreAddress,
} from '~data/stores';
import { getEvents } from '~utils/web3/eventLogs';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import { createAddress } from '~types';

import { colonyReducer, colonyTasksReducer } from '../reducers';

const {
  DOMAIN_CREATED,
  TASK_STORE_REGISTERED,
  TASK_STORE_UNREGISTERED,
} = COLONY_EVENT_TYPES;

type ColonyStoreMetadata = {|
  colonyAddress: Address,
|};

type ColonyTaskIndexStoreMetadata = {|
  colonyAddress: Address,
|};

type ContractEventQuery<A, R> = Query<ColonyClient, ColonyStoreMetadata, A, R>;

const context = [CONTEXT.COLONY_MANAGER];
const colonyContext = [
  CONTEXT.COLONY_MANAGER,
  CONTEXT.DDB_INSTANCE,
  CONTEXT.WALLET,
];

export const prepareColonyClientQuery = async (
  {
    colonyManager,
  }: {|
    colonyManager: ColonyManager,
  |},
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
  }: {|
    colonyManager: ColonyManager,
    ddb: DDB,
    wallet: Wallet,
  |},
  metadata: ColonyStoreMetadata,
) => {
  const { colonyAddress } = metadata;
  const colonyClient = await colonyManager.getColonyClient(colonyAddress);
  return getColonyStore(colonyClient, ddb, wallet)(metadata);
};

export const getColonyRoles: ContractEventQuery<
  void,
  { admins: Address[], founder: Address },
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
      address: oldRolesAddress,
    } = await colonyClient.getExtensionAddress.call({
      contractName: 'OldRoles',
    });
    const {
      address: oneTxAddress,
    } = await colonyClient.getExtensionAddress.call({
      contractName: 'OneTxPayment',
    });
    const extensionAddresses = [
      createAddress(oldRolesAddress),
      createAddress(oneTxAddress),
    ];

    // reduce events to { [address]: { [role]: boolean } }
    const addressRoles = events.reduce((acc, { address, setTo, role }) => {
      const normalizedAddress = createAddress(address);

      // don't include roles of extensions
      if (extensionAddresses.includes(normalizedAddress)) {
        return acc;
      }

      return {
        ...acc,
        [(normalizedAddress: string)]: {
          ...acc[(normalizedAddress: string)],
          [role]: setTo,
        },
      };
    }, {});

    // find user with all the roles OldRoles sets for founder
    const founder = createAddress(
      Object.keys(addressRoles).find(
        address =>
          addressRoles[address][COLONY_ROLE_ADMINISTRATION] &&
          addressRoles[address][COLONY_ROLE_ARCHITECTURE] &&
          addressRoles[address][COLONY_ROLE_FUNDING] &&
          addressRoles[address][COLONY_ROLE_ROOT],
      ) || ZERO_ADDRESS,
    );

    // find users with administration role
    const admins = Object.keys(addressRoles)
      .filter(
        address =>
          addressRoles[address][COLONY_ROLE_ADMINISTRATION] &&
          address !== founder,
      )
      .map(createAddress);

    return {
      admins,
      founder,
    };
  },
};

export const subscribeToColony: Subscription<
  {|
    colonyClient: ColonyClient,
    colonyStore: ColonyStore,
    colonyAddress: Address,
  |},
  ColonyStoreMetadata,
  *,
  ColonyType,
> = {
  name: 'subscribeToColony',
  context: colonyContext,
  async prepare(
    {
      colonyManager,
      ddb,
      wallet,
    }: {|
      colonyManager: ColonyManager,
      ddb: DDB,
      wallet: Wallet,
    |},
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

    // estimate will throw if we're unable to unlock
    let canUnlockNativeToken;
    try {
      await colonyClient.tokenClient.unlock.estimate({});
      canUnlockNativeToken = isNativeTokenLocked;
    } catch (error) {
      canUnlockNativeToken = false;
    }

    // @TODO Normalize colony subscription events
    return emitter => [
      colonyStore.subscribe(events =>
        emitter(
          events &&
            events
              .filter(({ type }) => COLONY_EVENT_TYPES[type])
              .reduce(colonyReducer, {
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
  {| colonyClient: ColonyClient, colonyStore: ColonyStore |},
  ColonyStoreMetadata,
  {| colonyAddress: Address |},
  ColonyType,
> = {
  name: 'getColony',
  context: colonyContext,
  async prepare(
    {
      colonyManager,
      ddb,
      wallet,
    }: {|
      colonyManager: ColonyManager,
      ddb: DDB,
      wallet: Wallet,
    |},
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

    // estimate will throw if we're unable to unlock
    let canUnlockNativeToken;
    try {
      await colonyClient.tokenClient.unlock.estimate({});
      canUnlockNativeToken = isNativeTokenLocked;
    } catch (error) {
      canUnlockNativeToken = false;
    }

    return colonyStore
      .all()
      .filter(({ type: eventType }) => COLONY_EVENT_TYPES[eventType])
      .reduce(colonyReducer, {
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
  {| colonyStore: ?ColonyStore, colonyTaskIndexStore: ?ColonyTaskIndexStore |},
  ColonyTaskIndexStoreMetadata,
  void,
  {
    [draftId: string]: {|
      commentsStoreAddress: string,
      taskStoreAddress: string,
    |},
  },
> = {
  name: 'getColonyTasks',
  context: colonyContext,
  async prepare(
    {
      colonyManager,
      ddb,
      wallet,
    }: {|
      colonyManager: ColonyManager,
      ddb: DDB,
      wallet: Wallet,
    |},
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
    return (
      store
        // $FlowFixMe seriously...?
        .all()
        .filter(
          ({ type }) =>
            type === TASK_STORE_REGISTERED || type === TASK_STORE_UNREGISTERED,
        )
        .reduce(colonyTasksReducer, {})
    );
  },
};

export const getColonyDomains: Query<
  ColonyStore,
  ColonyStoreMetadata,
  void,
  DomainType[],
> = {
  name: 'getColonyDomains',
  context: colonyContext,
  prepare: prepareColonyStoreQuery,
  async execute(colonyStore) {
    return colonyStore
      .all()
      .filter(({ type }) => type === DOMAIN_CREATED)
      .map(({ payload: { domainId, name } }: Event<typeof DOMAIN_CREATED>) => ({
        id: domainId,
        name,
      }));
  },
};

export const getColonyTokenBalance: Query<
  ColonyManager,
  void,
  {| colonyAddress: Address, tokenAddress: Address |},
  BigNumber,
> = {
  name: 'getColonyTokenBalance',
  context: colonyContext,
  prepare: async ({ colonyManager }: {| colonyManager: ColonyManager |}) =>
    colonyManager,
  async execute(colonyManager, { colonyAddress, tokenAddress }) {
    const {
      networkClient: {
        adapter: { provider },
      },
    } = colonyManager;
    // if ether, handle differently
    if (tokenAddress === ZERO_ADDRESS) {
      const etherBalance = await provider.getBalance(colonyAddress);

      // convert from Ethers BN
      return new BigNumber(etherBalance.toString());
    }

    // otherwise handle as ERC 20
    const tokenClient = await colonyManager.getTokenClient(tokenAddress);
    const { amount } = await tokenClient.getBalanceOf.call({
      sourceAddress: colonyAddress,
    });

    // convert from Ethers BN
    return new BigNumber(amount.toString());
  },
};

export const getColonyCanMintNativeToken: Query<
  ColonyClient,
  {| colonyAddress: Address |},
  void,
  boolean,
> = {
  name: 'getColonyCanMintNativeToken',
  context: colonyContext,
  async prepare(
    {
      colonyManager,
    }: {|
      colonyManager: ColonyManager,
    |},
    metadata: ColonyStoreMetadata,
  ) {
    const { colonyAddress } = metadata;
    return colonyManager.getColonyClient(colonyAddress);
  },
  async execute(colonyClient) {
    try {
      await colonyClient.mintTokens.estimate({ amount: new BigNumber(1) });
    } catch (error) {
      return false;
    }
    return true;
  },
};

export const checkColonyNameIsAvailable: Query<
  {| ens: ENSCache, networkClient: NetworkClient |},
  void,
  { colonyName: string },
  boolean,
> = {
  name: 'checkColonyNameIsAvailable',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.ENS_INSTANCE],
  async prepare({
    colonyManager: { networkClient },
    ens,
  }: {|
    colonyManager: ColonyManager,
    ens: ENSCache,
  |}) {
    return { ens, networkClient };
  },
  async execute({ ens, networkClient }, { colonyName }) {
    return ens.isENSNameAvailable('colony', colonyName, networkClient);
  },
};

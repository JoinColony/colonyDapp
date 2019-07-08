/* @flow */

import type { Address } from '~types';
import type {
  ColonyClient,
  ColonyManager,
  DDB,
  ENSCache,
  NetworkClient,
  Query,
  UserProfileStore,
  UserInboxStore,
  UserMetadataStore,
} from '~data/types';

import type {
  ContractTransactionType,
  UserProfileType,
  UserPermissionsType,
} from '~immutable';

import {
  normalizeDDBStoreEvent,
  normalizeTransactionLog,
} from '~data/normalizers';

import {
  COLONY_ROLE_ADMINISTRATION,
  COLONY_ROLE_ROOT,
  COLONY_ROLE_RECOVERY,
  COLONY_ROLES,
} from '@colony/colony-js-client';
import flatten from 'lodash/flatten';
import BigNumber from 'bn.js';
import { formatEther } from 'ethers/utils';

import { CONTEXT } from '~context';
import { USER_EVENT_TYPES } from '~data/constants';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import { reduceToLastState } from '~utils/reducers';
import {
  getDecoratedEvents,
  getEventLogs,
  parseUserTransferEvent,
  padTopicAddress,
  getFilterFormatted,
} from '~utils/web3/eventLogs';
import {
  getUserProfileStore,
  getUserInboxStore,
  getUserMetadataStore,
  getUserProfileStoreAddress,
} from '~data/stores';
import { getUserTasksReducer, getUserProfileReducer } from './reducers';
import { getUserAddressByUsername, getUserTokenAddresses } from './utils';

const {
  READ_UNTIL,
  SUBSCRIBED_TO_COLONY,
  SUBSCRIBED_TO_TASK,
  UNSUBSCRIBED_FROM_COLONY,
  UNSUBSCRIBED_FROM_TASK,
} = USER_EVENT_TYPES;

type UserProfileStoreMetadata = {|
  walletAddress: Address,
|};

type UserMetadataStoreMetadata = {|
  metadataStoreAddress: string,
  walletAddress: Address,
|};

const prepareColonyClientQuery = async (
  {
    colonyManager,
  }: {|
    colonyManager: ColonyManager,
  |},
  { colonyAddress }: {| colonyAddress: Address |},
) => colonyManager.getColonyClient(colonyAddress);

const prepareMetaColonyClientQuery = async ({
  colonyManager,
}: {|
  colonyManager: ColonyManager,
|}) => colonyManager.getMetaColonyClient();

const prepareProfileStoreQuery = async (
  { ddb }: {| ddb: DDB |},
  metadata: UserProfileStoreMetadata,
) => getUserProfileStore(ddb)(metadata);

const prepareMetadataStoreQuery = async (
  { ddb }: { ddb: DDB },
  metadata: UserMetadataStoreMetadata,
) =>
  metadata.metadataStoreAddress ? getUserMetadataStore(ddb)(metadata) : null;

export const getUserProfile: Query<
  UserProfileStore,
  UserProfileStoreMetadata,
  void,
  UserProfileType,
> = {
  name: 'getUserProfile',
  context: [CONTEXT.DDB_INSTANCE],
  prepare: prepareProfileStoreQuery,
  async execute(profileStore) {
    return profileStore.all().reduce(getUserProfileReducer, {
      /*
       * We can be pretty sure that `walletAddress` will be in the first
       * event for this store, but flow doesn't know that.
       */
      walletAddress: '',
      inboxStoreAddress: '',
      metadataStoreAddress: '',
    });
  },
};

export const getUserTasks: Query<
  ?UserMetadataStore,
  UserMetadataStoreMetadata,
  void,
  *,
> = {
  name: 'getUserTasks',
  context: [CONTEXT.DDB_INSTANCE],
  prepare: prepareMetadataStoreQuery,
  async execute(metadataStore) {
    /*
     * If the user has no metadata store set, we will assume that the
     * user is newly-created (and we can't get their subscribed tasks yet).
     */
    return metadataStore
      ? metadataStore
          .all()
          .filter(
            ({ type }) =>
              type === SUBSCRIBED_TO_TASK || type === UNSUBSCRIBED_FROM_TASK,
          )
          .reduce(getUserTasksReducer, [])
      : [];
  },
};

export const getUserColonies: Query<
  ?UserMetadataStore,
  UserMetadataStoreMetadata,
  void,
  *,
> = {
  name: 'getUserColonies',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareMetadataStoreQuery,
  async execute(metadataStore) {
    /*
     * If the user has no metadata store set, we will assume that the
     * user is newly-created (and we can't get their subscribed tasks yet).
     */
    return metadataStore
      ? reduceToLastState(
          metadataStore
            .all()
            .filter(
              ({ type }) =>
                type === SUBSCRIBED_TO_COLONY ||
                type === UNSUBSCRIBED_FROM_COLONY,
            ),
          ({ payload: { colonyAddress } }) => colonyAddress,
          ({ type }) => type,
        )
          .filter(([, type]) => type === SUBSCRIBED_TO_COLONY)
          .map(([colonyAddress]) => colonyAddress)
      : [];
  },
};

export const getUserTokens: Query<
  {|
    metadataStore: ?UserMetadataStore,
    colonyManager: ColonyManager,
  |},
  {| walletAddress: Address, metadataStoreAddress: string |},
  {| walletAddress: Address |},
  *,
> = {
  name: 'getUserTokens',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  async prepare(
    {
      colonyManager,
      ddb,
    }: {|
      colonyManager: ColonyManager,
      ddb: DDB,
    |},
    metadata: UserMetadataStoreMetadata,
  ) {
    const { metadataStoreAddress } = metadata;
    let metadataStore = null;
    if (metadataStoreAddress)
      metadataStore = await getUserMetadataStore(ddb)(metadata);
    return { metadataStore, colonyManager };
  },
  async execute({ metadataStore, colonyManager }, { walletAddress }) {
    const {
      networkClient: {
        adapter: { provider },
      },
    } = colonyManager;

    // for each address, get balance
    let tokens = [];
    if (metadataStore) {
      tokens = await Promise.all(
        getUserTokenAddresses(metadataStore).map(async address => {
          const tokenClient = await colonyManager.getTokenClient(address);
          const { amount } = await tokenClient.getBalanceOf.call({
            sourceAddress: walletAddress,
          });
          // convert from Ethers BN
          const balance = new BigNumber(amount.toString());
          return { address, balance };
        }),
      );
    }

    // also get balance for ether and return in same format
    const etherBalance = await provider.getBalance(walletAddress);
    const etherToken = {
      address: ZERO_ADDRESS,
      // convert from Ethers BN
      balance: new BigNumber(etherBalance.toString()),
    };

    // return combined array
    return [etherToken, ...tokens];
  },
};

export const getUserBalance: Query<
  NetworkClient,
  void,
  {| walletAddress: string |},
  string,
> = {
  name: 'getUserBalance',
  context: [CONTEXT.COLONY_MANAGER],
  prepare: async ({
    colonyManager: { networkClient },
  }: {|
    colonyManager: ColonyManager,
  |}) => networkClient,
  async execute(networkClient, { walletAddress }) {
    const {
      adapter: { provider },
    } = networkClient;
    const balance = await provider.getBalance(walletAddress);
    return formatEther(balance);
  },
};

export const getUserAddress: Query<
  {| ens: ENSCache, networkClient: NetworkClient |},
  void,
  {| username: string |},
  string,
> = {
  name: 'getUserAddress',
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
  async execute({ ens, networkClient }, { username }) {
    const userAddress = await getUserAddressByUsername(ens, networkClient)(
      username,
    );

    if (!userAddress) {
      throw new Error(`Address not found for username "${username}"`);
    }

    return userAddress;
  },
};

export const getUserPermissions: Query<
  ColonyClient,
  {| colonyAddress: Address |},
  {| walletAddress: string |},
  UserPermissionsType,
> = {
  name: 'getUserPermissions',
  context: [CONTEXT.COLONY_MANAGER],
  prepare: prepareColonyClientQuery,
  async execute(colonyClient, { walletAddress }) {
    const {
      hasRole: canEnterRecoveryMode,
    } = await colonyClient.hasColonyRole.call({
      address: walletAddress,
      role: COLONY_ROLE_RECOVERY,
      domainId: 1,
    });
    const { hasRole: isAdmin } = await colonyClient.hasColonyRole.call({
      address: walletAddress,
      role: COLONY_ROLE_ADMINISTRATION,
      domainId: 1,
    });
    const { hasRole: isFounder } = await colonyClient.hasColonyRole.call({
      address: walletAddress,
      role: COLONY_ROLE_ROOT,
      domainId: 1,
    });
    return { canEnterRecoveryMode, isAdmin, isFounder };
  },
};

/**
 * This query gets all tokens sent from or received to this wallet since a certain block time
 * @todo Use a meaningful value for `blocksBack` when getting past transactions.
 */
export const getUserColonyTransactions: Query<
  ColonyClient,
  void,
  {|
    userColonyAddresses: Address[],
    walletAddress: string,
  |},
  ContractTransactionType[],
> = {
  name: 'getUserColonyTransactions',
  context: [CONTEXT.COLONY_MANAGER],
  prepare: prepareMetaColonyClientQuery,
  async execute(metaColonyClient, { walletAddress, userColonyAddresses }) {
    const { tokenClient } = metaColonyClient;
    const {
      events: { Transfer },
    } = tokenClient;
    const logFilterOptions = {
      blocksBack: 400000,
      events: [Transfer],
    };

    const transferToEventLogs = await getEventLogs(
      tokenClient,
      {},
      {
        ...logFilterOptions,
        to: walletAddress,
      },
    );

    const transferFromEventLogs = await getEventLogs(
      tokenClient,
      {},
      {
        ...logFilterOptions,
        from: walletAddress,
      },
    );

    // Combine and sort logs by blockNumber, then parse events from thihs
    const logs = [...transferToEventLogs, ...transferFromEventLogs].sort(
      // $FlowFixMe colonyJS Log should contain blockNumber
      (a, b) => a.blockNumber - b.blockNumber,
    );
    const transferEvents = await tokenClient.parseLogs(logs);

    return Promise.all(
      transferEvents.map((event, i) =>
        parseUserTransferEvent({
          event,
          log: logs[i],
          tokenClient,
          userColonyAddresses,
          walletAddress,
        }),
      ),
    );
  },
};

export const checkUsernameIsAvailable: Query<
  {| ens: ENSCache, networkClient: NetworkClient |},
  void,
  { username: string },
  boolean,
> = {
  name: 'checkUsernameIsAvailable',
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
  async execute({ ens, networkClient }, { username }) {
    return ens.isENSNameAvailable('user', username, networkClient);
  },
};

export const getUserInboxActivity: Query<
  {|
    userInboxStore: UserInboxStore,
    colonyClients: ColonyClient[],
    colonyNetworkClient: NetworkClient,
    walletAddress: Address,
  |},
  {|
    userColonies: Address[],
    inboxStoreAddress: string,
    walletAddress: Address,
  |},
  void,
  *,
> = {
  name: 'getUserInboxActivity',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE],
  async prepare(
    {
      colonyManager,
      ddb,
    }: {|
      colonyManager: ColonyManager,
      ddb: DDB,
    |},
    {
      userColonies,
      inboxStoreAddress,
      walletAddress,
    }: {|
      userColonies: Address[],
      inboxStoreAddress: string,
      walletAddress: Address,
    |},
  ) {
    const userInboxStore = await getUserInboxStore(ddb)({
      inboxStoreAddress,
      walletAddress,
    });
    const colonyClients = await Promise.all(
      userColonies.map(address => colonyManager.getColonyClient(address)),
    );
    return {
      colonyClients,
      colonyNetworkClient: colonyManager.networkClient,
      userInboxStore,
      walletAddress,
    };
  },
  async execute({
    userInboxStore,
    colonyClients,
    colonyNetworkClient,
    walletAddress,
  }) {
    const {
      contract: { address: colonyNetworkAddress },
      events: { ColonyLabelRegistered },
    } = colonyNetworkClient;

    const getLogTopicsFilter = (...args: *) => ({ topics: args });
    const getColonyLabelRegisteredTopicsFilter = (colonyAddress: Address) =>
      getLogTopicsFilter(
        ColonyLabelRegistered.interface.topics[0],
        padTopicAddress(colonyAddress),
      );

    // @TODO: Have a proper way to deal with "query fragments"
    const aggregatedContractEvents = await Promise.all(
      colonyClients.map(async colonyClient => {
        const {
          contract: { address: colonyAddress },
          events: { DomainAdded, ColonyRoleSet },
          tokenClient,
          tokenClient: {
            events: { Mint, Transfer },
            contract: { address: tokenAddress },
          },
        } = colonyClient;

        // @TODO: Have a proper way to deal with query filters
        const getAdminRoleAssignmentTopicsFilter = address => ({
          ...getLogTopicsFilter(
            ColonyRoleSet.interface.topics[0],
            // @TODO: Allow null values on log topics filter
            // $FlowFixMe: We should be able to pass in null values as part of the log topics filter!
            null,
            // $FlowFixMe: We should be able to pass in null values as part of the log topics filter!
            null,
            getFilterFormatted(COLONY_ROLES[COLONY_ROLE_ADMINISTRATION]),
          ),
          address,
        });

        const eventsFromRoleAssignment = (await getDecoratedEvents(
          colonyClient,
          getAdminRoleAssignmentTopicsFilter(colonyAddress),
          {
            blocksBack: 400000,
            events: [ColonyRoleSet],
          },
        )).filter(
          ({ transaction: { from }, event: { address: assigneeAddress } }) =>
            assigneeAddress !== from,
        );

        const eventsFromColony = (await getDecoratedEvents(
          colonyClient,
          {
            address: colonyAddress,
          },
          {
            blocksBack: 400000,
            events: [DomainAdded],
          },
        )).filter(({ event }) => event.domainId !== 1);

        const eventsFromNetwork = await getDecoratedEvents(
          colonyNetworkClient,
          getColonyLabelRegisteredTopicsFilter(colonyAddress),
          {
            blocksBack: 400000,
            events: [ColonyLabelRegistered],
          },
        );

        const eventsFromToken = await getDecoratedEvents(
          tokenClient,
          {
            address: tokenAddress,
          },
          {
            blocksBack: 400000,
            events: [Mint],
          },
        );

        const eventsFromTransfer = await getDecoratedEvents(
          tokenClient,
          {},
          {
            blocksBack: 400000,
            to: walletAddress,
            events: [Transfer],
          },
        );

        return [
          ...eventsFromColony.map(event =>
            normalizeTransactionLog(colonyAddress, event),
          ),
          ...eventsFromNetwork.map(event =>
            normalizeTransactionLog(colonyNetworkAddress, event),
          ),
          ...eventsFromToken.map(event =>
            normalizeTransactionLog(tokenAddress, event),
          ),
          ...eventsFromTransfer.map(event =>
            normalizeTransactionLog(tokenAddress, event),
          ),
          ...eventsFromRoleAssignment.map(event =>
            normalizeTransactionLog(colonyAddress, event),
          ),
        ];
      }),
    );

    const contractEvents = flatten(aggregatedContractEvents);
    const storeEvents = userInboxStore
      .all()
      .map(event =>
        normalizeDDBStoreEvent(userInboxStore.address.toString(), event),
      );

    return storeEvents.concat(contractEvents);
  },
};

export const getProfileStoreAddress: Query<
  {| ddb: DDB, metadata: {| walletAddress: Address |} |},
  {| walletAddress: Address |},
  void,
  string,
> = {
  name: 'getProfileStoreAddress',
  context: [CONTEXT.DDB_INSTANCE],
  async prepare({ ddb }, metadata) {
    return { ddb, metadata };
  },
  async execute({ ddb, metadata }) {
    const orbitAddress = await getUserProfileStoreAddress(ddb)(metadata);
    return orbitAddress.toString();
  },
};

export const getUserNotificationMetadata: Query<
  ?UserMetadataStore,
  UserMetadataStoreMetadata,
  void,
  {| readUntil: number, exceptFor: string[] |},
> = {
  name: 'getUserNotificationMetadata',
  context: [CONTEXT.DDB_INSTANCE],
  prepare: prepareMetadataStoreQuery,
  async execute(metadataStore) {
    /*
     * The user has no metadata store set, assuming there's no metadata
     */
    const [{ payload: { readUntil, exceptFor } = {} } = {}] = metadataStore
      ? metadataStore
          .all()
          .filter(({ type }) => type === READ_UNTIL)
          .sort((a, b) => b.meta.timestamp - a.meta.timestamp)
      : [];

    return {
      readUntil,
      exceptFor,
    };
  },
};

import ApolloClient from 'apollo-client';
import {
  COLONY_ROLE_ADMINISTRATION,
  COLONY_ROLES,
} from '@colony/colony-js-client';
import flatten from 'lodash/flatten';
import BigNumber from 'bn.js';
import { formatEther } from 'ethers/utils';

import { Address, createAddress } from '~types/index';
import {
  ColonyClient,
  ColonyManager,
  DDB,
  ENSCache,
  NetworkClient,
  Query,
  Subscription,
  UserInboxStore,
  UserMetadataStore,
  UserProfileStore,
} from '~data/types';
import {
  ContractTransactionType,
  UserProfileType,
  UserTokenReferenceType,
} from '~immutable/index';
import {
  normalizeDDBStoreEvent,
  normalizeTransactionLog,
} from '~data/normalizers';
import ENS from '~lib/ENS';
import { Context } from '~context/index';
import { EventTypes } from '~data/constants';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import { reduceToLastState } from '~utils/reducers';
import {
  formatFilterTopic,
  getDecoratedEvents,
  getEventLogs,
  mapTopics,
  parseUserTransferEvent,
} from '~utils/web3/eventLogs';
import {
  getUserInboxStore,
  getUserMetadataStore,
  getUserProfileStore,
  getUserProfileStoreAddress,
} from '~data/stores';
import { getUserProfileReducer, getUserTasksReducer } from './reducers';
import { USER } from '../queries';
import {
  decorateColonyEventPayload,
  getExtensionAddresses,
  getUserAddressByUsername,
  getUserTokenAddresses,
} from './utils';

interface UserProfileStoreMetadata {
  walletAddress: Address;
}

interface UserMetadataStoreMetadata {
  metadataStoreAddress: string;
  walletAddress: Address;
}

const prepareMetaColonyClientQuery = async ({
  colonyManager,
}: {
  colonyManager: ColonyManager;
}) => colonyManager.getMetaColonyClient();

const prepareProfileStoreQuery = async (
  { ddb }: { ddb: DDB },
  metadata: UserProfileStoreMetadata,
) => getUserProfileStore(ddb)(metadata);

const prepareMetadataStoreQuery = async (
  { ddb }: { ddb: DDB },
  metadata: UserMetadataStoreMetadata,
) =>
  metadata.metadataStoreAddress ? getUserMetadataStore(ddb)(metadata) : null;

// This query is used by a few other sagas/queries(?) so we can't remove it for now
// FIXME REMOVE
export const getUserProfile: Query<
  { apolloClient: ApolloClient<any> },
  UserProfileStoreMetadata,
  { walletAddress: Address },
  UserProfileType
> = {
  name: 'getUserProfile',
  context: [Context.DDB_INSTANCE, Context.APOLLO_CLIENT],
  prepare: async ({ apolloClient }) => ({ apolloClient }),
  async execute({ apolloClient }, { walletAddress }) {
    const { data } = await apolloClient.query<{
      user: { profile: UserProfileType };
    }>({
      query: USER,
      variables: { address: walletAddress },
    });
    return data.user.profile;
  },
};

export const getUserTasks: Query<
  UserMetadataStore | null,
  UserMetadataStoreMetadata,
  void,
  any
> = {
  name: 'getUserTasks',
  context: [Context.DDB_INSTANCE],
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
              type === EventTypes.SUBSCRIBED_TO_TASK ||
              type === EventTypes.UNSUBSCRIBED_FROM_TASK,
          )
          .reduce(getUserTasksReducer, [])
      : [];
  },
};

export const getUserColonies: Query<
  UserMetadataStore | null,
  UserMetadataStoreMetadata,
  void,
  any
> = {
  name: 'getUserColonies',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
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
                type === EventTypes.SUBSCRIBED_TO_COLONY ||
                type === EventTypes.UNSUBSCRIBED_FROM_COLONY,
            ),
          ({ payload: { colonyAddress } }) => colonyAddress,
          ({ type }) => type,
        )
          .filter(([, type]) => type === EventTypes.SUBSCRIBED_TO_COLONY)
          .map(([colonyAddress]) => createAddress(colonyAddress))
      : [];
  },
};

export const getUserTokens: Query<
  {
    metadataStore: UserMetadataStore | null;
    colonyManager: ColonyManager;
  },
  { walletAddress: Address; metadataStoreAddress: string },
  { walletAddress: Address },
  any
> = {
  name: 'getUserTokens',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  async prepare(
    {
      colonyManager,
      ddb,
    }: {
      colonyManager: ColonyManager;
      ddb: DDB;
    },
    metadata: UserMetadataStoreMetadata,
  ) {
    const { metadataStoreAddress } = metadata;
    let metadataStore: UserMetadataStore | null = null;
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
    let tokens = [] as UserTokenReferenceType[];
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

// FIXME remove as soon as possible
export const getUserBalance: Query<
  NetworkClient,
  void,
  { walletAddress: string },
  string
> = {
  name: 'getUserBalance',
  context: [Context.COLONY_MANAGER],
  prepare: async ({
    colonyManager: { networkClient },
  }: {
    colonyManager: ColonyManager;
  }) => networkClient,
  async execute(networkClient, { walletAddress }) {
    const {
      adapter: { provider },
    } = networkClient;
    const balance = await provider.getBalance(walletAddress);
    return formatEther(balance);
  },
};

export const getUserAddress: Query<
  { ens: ENSCache; networkClient: NetworkClient },
  void,
  { username: string },
  Address
> = {
  name: 'getUserAddress',
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
  async execute({ ens, networkClient }, { username }) {
    const userAddress = await getUserAddressByUsername(ens, networkClient)(
      username,
    );

    if (!userAddress) {
      throw new Error(`Address not found for username "${username}"`);
    }

    return createAddress(userAddress);
  },
};

export const getUsername: Query<
  { ens: ENSCache; networkClient: NetworkClient },
  void,
  { walletAddress: Address },
  string | null
> = {
  name: 'getUsername',
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
  async execute({ ens, networkClient }, { walletAddress }) {
    try {
      const domain = await ens.getDomain(walletAddress, networkClient);
      return ENS.stripDomainParts('user', domain);
    } catch (e) {
      return null;
    }
  },
};

/**
 * This query gets all tokens sent from or received to this wallet since a certain block time
 */
export const getUserColonyTransactions: Query<
  ColonyClient,
  void,
  {
    userColonyAddresses: Address[];
    walletAddress: string;
  },
  ContractTransactionType[]
> = {
  name: 'getUserColonyTransactions',
  context: [Context.COLONY_MANAGER],
  prepare: prepareMetaColonyClientQuery,
  async execute(metaColonyClient, { walletAddress, userColonyAddresses }) {
    const { tokenClient } = metaColonyClient;
    const {
      events: { Transfer },
    } = tokenClient;
    const logFilterOptions = {
      events: [Transfer],
    };

    const transferToEventLogs = await getEventLogs(
      tokenClient,
      { fromBlock: 1 },
      {
        ...logFilterOptions,
        to: walletAddress,
      },
    );

    const transferFromEventLogs = await getEventLogs(
      tokenClient,
      { fromBlock: 1 },
      {
        ...logFilterOptions,
        from: walletAddress,
      },
    );

    // Combine and sort logs by blockNumber, then parse events from thihs
    const logs = [...transferToEventLogs, ...transferFromEventLogs].sort(
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
  { ens: ENSCache; networkClient: NetworkClient },
  void,
  { username: string },
  boolean
> = {
  name: 'checkUsernameIsAvailable',
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
  async execute({ ens, networkClient }, { username }) {
    return ens.isENSNameAvailable('user', username, networkClient);
  },
};

const getColonyEventsForUserInbox = async (
  colonyClient: ColonyClient,
  walletAddress: Address,
) => {
  const {
    contract: { address: colonyAddress },
    events: { DomainAdded, ColonyRoleSet },
    tokenClient,
    tokenClient: {
      events: { Mint },
      contract: { address: tokenAddress },
    },
    networkClient: {
      contract: { address: colonyNetworkAddress },
      events: { ColonyLabelRegistered },
    },
    networkClient,
  } = colonyClient;

  const extensionAddresses = await getExtensionAddresses(colonyClient);

  const colonyLabelRegisteredEvents = await getDecoratedEvents<
    'ColonyLabelRegistered',
    { colony: string; label: string; tokenAddress: string }
  >(
    networkClient,
    {
      ...mapTopics(ColonyLabelRegistered.interface.topics[0], colonyAddress),
      fromBlock: 1,
    },
    {
      events: [ColonyLabelRegistered],
    },
  );

  const roleAssignmentEvents = await getDecoratedEvents<
    'ColonyRoleSet',
    {
      address: string;
      domainId: number;
      // In the future we might want to use an enum here
      role: string;
      setTo: boolean;
    }
  >(
    colonyClient,
    {
      // @TODO: Allow null values on log topics filter
      ...mapTopics(
        ColonyRoleSet.interface.topics[0],
        null,
        null,
        formatFilterTopic(COLONY_ROLES[COLONY_ROLE_ADMINISTRATION]),
      ),
      address: colonyAddress,
      fromBlock: 1,
    },
    {
      events: [ColonyRoleSet],
    },
  );

  const domainAddedEvents = await getDecoratedEvents<
    'DomainAdded',
    {
      domainId: number;
    }
  >(
    colonyClient,
    {
      address: colonyAddress,
      fromBlock: 1,
    },
    {
      events: [DomainAdded],
    },
  );

  const tokenMintedEvents = await getDecoratedEvents<
    'Mint',
    { address: string; amount: BigNumber }
  >(
    tokenClient,
    {
      address: tokenAddress,
      fromBlock: 1,
    },
    {
      events: [Mint],
    },
  );

  const colonyEvents = [
    ...tokenMintedEvents,
    ...domainAddedEvents.filter(
      // Filter out the root domain added event
      ({ event }) => event.domainId !== 1,
    ),
    ...roleAssignmentEvents.filter(
      (
        { transaction: { from }, event }, // Filter out assignments from/to the same user, and assignments
      ) =>
        // for extension contracts
        from !== event.address && !extensionAddresses.includes(event.address),
    ),
  ].filter(({ transaction: { from } }) => from !== walletAddress);

  const normalized = [
    ...colonyLabelRegisteredEvents.map(event =>
      normalizeTransactionLog(colonyNetworkAddress, event),
    ),
    ...colonyEvents.map(event => normalizeTransactionLog(colonyAddress, event)),
  ];

  return normalized.map(decorateColonyEventPayload).filter(Boolean);
};

const getAllColonyEventsForUserInbox = async (
  colonyClients: ColonyClient[],
  walletAddress: Address,
) => {
  const events = await Promise.all(
    colonyClients.map(colonyClient =>
      getColonyEventsForUserInbox(colonyClient, walletAddress),
    ),
  );
  return flatten(events);
};

export const getUserInboxActivity: Query<
  {
    userInboxStore: UserInboxStore | void;
    userProfileStore: UserProfileStore | void;
    colonyClients: ColonyClient[];
    walletAddress: Address;
  },
  {
    userColonies: Address[];
    inboxStoreAddress: string | void;
    walletAddress: Address;
  },
  void,
  any
> = {
  name: 'getUserInboxActivity',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE],
  async prepare(
    { colonyManager, ddb },
    { userColonies, inboxStoreAddress, walletAddress },
  ) {
    let userProfileStore;
    try {
      userProfileStore = await getUserProfileStore(ddb)({ walletAddress });
    } catch {
      // Ignore the error; it's ok if the store doesn't exist yet
    }

    const userInboxStore = inboxStoreAddress
      ? await getUserInboxStore(ddb)({
          inboxStoreAddress,
          walletAddress,
        })
      : undefined;

    const colonyClients = await Promise.all(
      userColonies.map(address => colonyManager.getColonyClient(address)),
    );

    return {
      colonyClients,
      userInboxStore,
      userProfileStore,
      walletAddress,
    };
  },
  async execute({
    colonyClients,
    userInboxStore,
    userProfileStore,
    walletAddress,
  }) {
    const colonyEvents = await getAllColonyEventsForUserInbox(
      colonyClients,
      walletAddress,
    );

    const inboxStoreEvents = userInboxStore
      ? userInboxStore
          .all()
          .map(event =>
            normalizeDDBStoreEvent(userInboxStore.address.toString(), event),
          )
      : [];

    const profileStoreEvents = userProfileStore
      ? userProfileStore
          .all()
          .filter(({ type }) => type === EventTypes.USER_PROFILE_CREATED)
          .map(event =>
            normalizeDDBStoreEvent(userProfileStore.address.toString(), event),
          )
      : [];

    // Sort all events in descending date order
    return [...profileStoreEvents, ...inboxStoreEvents, ...colonyEvents].sort(
      (a, b) => b.meta.timestamp - a.meta.timestamp,
    );
  },
};

export const getProfileStoreAddress: Query<
  { ddb: DDB; metadata: { walletAddress: Address } },
  { walletAddress: Address },
  void,
  string
> = {
  name: 'getProfileStoreAddress',
  context: [Context.DDB_INSTANCE],
  async prepare({ ddb }, metadata) {
    return { ddb, metadata };
  },
  async execute({ ddb, metadata }) {
    const orbitAddress = await getUserProfileStoreAddress(ddb)(metadata);
    return orbitAddress.toString();
  },
};

export const getUserNotificationMetadata: Query<
  UserMetadataStore | null,
  UserMetadataStoreMetadata,
  void,
  { readUntil: number; exceptFor: string[] }
> = {
  name: 'getUserNotificationMetadata',
  context: [Context.DDB_INSTANCE],
  prepare: prepareMetadataStoreQuery,
  async execute(metadataStore) {
    /*
     * The user has no metadata store set, assuming there's no metadata
     */
    // @ts-ignore
    const [{ payload: { readUntil, exceptFor } = {} } = {}] = metadataStore
      ? metadataStore
          .all()
          .filter(({ type }) => type === EventTypes.READ_UNTIL)
          .sort((a, b) => b.meta.timestamp - a.meta.timestamp)
      : [];

    return {
      readUntil,
      exceptFor,
    };
  },
};

export const subscribeToUser: Subscription<
  UserProfileStore,
  UserProfileStoreMetadata,
  void,
  UserProfileType
> = {
  name: 'subscribeToUser',
  context: [Context.DDB_INSTANCE],
  prepare: prepareProfileStoreQuery,
  async execute(profileStore) {
    return emitter => [
      profileStore.subscribe(events =>
        emitter(
          events &&
            events.reduce(getUserProfileReducer, {
              walletAddress: ZERO_ADDRESS,
              inboxStoreAddress: '',
              metadataStoreAddress: '',
            }),
        ),
      ),
    ];
  },
};

export const subscribeToUserTasks: Subscription<
  UserMetadataStore | null,
  UserMetadataStoreMetadata,
  void,
  any
> = {
  name: 'subscribeToUserTasks',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareMetadataStoreQuery,
  async execute(metadataStore) {
    if (!metadataStore) throw new Error('No such user metadata store');
    return emitter => [
      metadataStore.subscribe(events =>
        emitter(
          events &&
            events
              .filter(
                ({ type }) =>
                  type === EventTypes.SUBSCRIBED_TO_TASK ||
                  type === EventTypes.UNSUBSCRIBED_FROM_TASK,
              )
              .reduce(getUserTasksReducer, []),
        ),
      ),
    ];
  },
};

export const subscribeToUserColonies: Subscription<
  UserMetadataStore | null,
  UserMetadataStoreMetadata,
  void,
  any
> = {
  name: 'subscribeToUserColonies',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE, Context.WALLET],
  prepare: prepareMetadataStoreQuery,
  async execute(metadataStore) {
    if (!metadataStore) throw new Error('No such user metadata store');
    return emitter => [
      metadataStore.subscribe(events =>
        emitter(
          events &&
            reduceToLastState(
              events.filter(
                ({ type }) =>
                  type === EventTypes.SUBSCRIBED_TO_COLONY ||
                  type === EventTypes.UNSUBSCRIBED_FROM_COLONY,
              ),
              ({ payload: { colonyAddress } }) => colonyAddress,
              ({ type }) => type,
            )
              .filter(([, type]) => type === EventTypes.SUBSCRIBED_TO_COLONY)
              .map(([colonyAddress]) => createAddress(colonyAddress)),
        ),
      ),
    ];
  },
};

/* @flow */
import { formatEther } from 'ethers/utils';
import { ADMIN_ROLE, FOUNDER_ROLE } from '@colony/colony-js-client';
import BigNumber from 'bn.js';

import type { OrbitDBAddress } from '~types';

import type {
  ContractTransactionType,
  UserPermissionsType,
  UserProfileType,
} from '~immutable';

import { getEventLogs, parseUserTransferEvent } from '~utils/web3/eventLogs';
import { getTokenClient } from '~utils/web3/contracts';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import { reduceToLastState } from '~utils/reducers';

import type {
  ColonyClientContext,
  ContextWithMetadata,
  DDBContext,
  ENSCacheContext,
  NetworkClientContext,
  Query,
} from '~data/types';

import { USER_EVENT_TYPES } from '~data/constants';
import {
  getUserMetadataStore,
  getUserProfileStore,
  getUserInboxStore,
} from '~data/stores';
import { getUserTokenAddresses } from './utils';
import { getUserTasksReducer } from './reducers';

const {
  SUBSCRIBED_TO_COLONY,
  SUBSCRIBED_TO_TASK,
  UNSUBSCRIBED_FROM_TASK,
} = USER_EVENT_TYPES;

type UserQueryContext = ContextWithMetadata<
  {|
    walletAddress: string,
    username?: string,
  |},
  DDBContext,
>;

type UserMetadataQueryContext = ContextWithMetadata<
  {|
    userMetadataStoreAddress: string | OrbitDBAddress,
    walletAddress: string,
  |},
  DDBContext,
>;

type UserBalanceQueryContext = NetworkClientContext;
type UserPermissionsQueryContext = ColonyClientContext;

type UserTokensQueryContext = ContextWithMetadata<
  {|
    userMetadataStoreAddress: string | OrbitDBAddress,
    walletAddress: string,
  |},
  DDBContext & NetworkClientContext,
>;

type UserColonyTransactionsQueryContext = ContextWithMetadata<
  {|
    walletAddress: string,
  |},
  ColonyClientContext,
>;

type UsernameQueryContext = {| ...ENSCacheContext, ...NetworkClientContext |};

type UserQuery<I: *, R: *> = Query<UserQueryContext, I, R>;
type UserMetadataQuery<I: *, R: *> = Query<UserMetadataQueryContext, I, R>;
type UsernameQuery<I: *, R: *> = Query<UsernameQueryContext, I, R>;
type UserPermissionsQuery<I: *, R: *> = Query<
  UserPermissionsQueryContext,
  I,
  R,
>;
type UserTokensQuery<I: *, R: *> = Query<UserTokensQueryContext, I, R>;

type UserColonyTransactionsQuery<I: *> = Query<
  UserColonyTransactionsQueryContext,
  I,
  ContractTransactionType[],
>;

export type UserActivitiesQueryContext = ContextWithMetadata<
  {|
    inboxStoreAddress: string | OrbitDBAddress,
    walletAddress: string,
  |},
  DDBContext,
>;

export type UserActivitiesQuery<I: *, R: *> = Query<
  UserActivitiesQueryContext,
  I,
  R,
>;

export const getUserProfile: UserQuery<void, UserProfileType> = ({
  ddb,
  metadata,
}) => ({
  async execute() {
    const profileStore = await getUserProfileStore(ddb)(metadata);
    const {
      avatarHash,
      bio,
      displayName,
      location,
      username,
      walletAddress,
      website,
    } = await profileStore.all();
    return {
      avatarHash,
      bio,
      displayName,
      location,
      username,
      walletAddress,
      website,
    };
  },
});

// TODO consider merging this query with `getUserProfile`
export const getUserMetadata: UserQuery<void, *> = ({ ddb, metadata }) => ({
  async execute() {
    const profileStore = await getUserProfileStore(ddb)(metadata);
    const inboxStoreAddress = profileStore.get('inboxStoreAddress');
    const metadataStoreAddress = profileStore.get('metadataStoreAddress');

    // Flow hack: Should not happen, here to appease flow
    if (!(inboxStoreAddress && metadataStoreAddress))
      throw new Error('User metadata not found');

    return {
      inboxStoreAddress,
      metadataStoreAddress,
      profileStoreAddress: profileStore.address.toString(),
    };
  },
});

export const checkUsernameIsAvailable: UsernameQuery<string, boolean> = ({
  networkClient,
  ensCache,
}) => ({
  async execute(username) {
    const ensAddress = await ensCache.getAddress(
      ensCache.constructor.getFullDomain('user', username),
      networkClient,
    );

    if (ensAddress)
      throw new Error(`ENS address for user "${username}" already exists`);

    return true;
  },
});

export const getUserBalance: Query<UserBalanceQueryContext, string, string> = ({
  networkClient,
}) => ({
  async execute(walletAddress) {
    const {
      adapter: { provider },
    } = networkClient;
    const balance = await provider.getBalance(walletAddress);
    return formatEther(balance);
  },
});

export const getUserPermissions: UserPermissionsQuery<
  string,
  UserPermissionsType,
> = ({ colonyClient }) => ({
  async execute(walletAddress) {
    // TODO: Wait for new ColonyJS version and replace with the code below
    // const canEnterRecoveryMode = await colonyClient.hasUserRole.call({
    //   user: walletAddress,
    //   role: RECOVERY_ROLE,
    // });
    const canEnterRecoveryMode = false;
    const isAdmin = await colonyClient.hasUserRole.call({
      user: walletAddress,
      role: ADMIN_ROLE,
    });
    const isFounder = await colonyClient.hasUserRole.call({
      user: walletAddress,
      role: FOUNDER_ROLE,
    });
    return { canEnterRecoveryMode, isAdmin, isFounder };
  },
});

export const getUserColonyTransactions: UserColonyTransactionsQuery<void> = ({
  colonyClient: {
    tokenClient: {
      events: { Transfer },
    },
    tokenClient,
  },
  metadata: { walletAddress },
}) => ({
  async execute() {
    const logFilterOptions = {
      blocksBack: 400000, // TODO use a more meaningful value for blocksBack
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
          tokenClient,
          event,
          log: logs[i],
          walletAddress,
        }),
      ),
    );
  },
});

export const getUserTasks: UserMetadataQuery<void, *> = ({
  ddb,
  metadata: { userMetadataStoreAddress },
  metadata,
}) => ({
  async execute() {
    /*
     * If the user has no metadata store set, we will assume that the
     * user is newly-created (and we can't get their subscribed tasks yet).
     */
    if (!userMetadataStoreAddress) return [];

    const metadataStore = await getUserMetadataStore(ddb)(metadata);
    return metadataStore
      .all()
      .filter(
        ({ type }) =>
          type === SUBSCRIBED_TO_TASK || type === UNSUBSCRIBED_FROM_TASK,
      )
      .reduce(getUserTasksReducer, []);
  },
});

export const getUserColonies: UserMetadataQuery<void, *> = ({
  ddb,
  metadata: { userMetadataStoreAddress },
  metadata,
}) => ({
  async execute() {
    /*
     * If the user has no metadata store set, we will assume that the
     * user is newly-created (and we can't get their subscribed colonies yet).
     */
    if (!userMetadataStoreAddress) return [];

    const metadataStore = await getUserMetadataStore(ddb)(metadata);
    return reduceToLastState(
      metadataStore.all(),
      ({ payload: { colonyAddress } }) => colonyAddress,
      ({ type }) => type,
    )
      .filter(([, type]) => type === SUBSCRIBED_TO_COLONY)
      .map(([colonyAddress]) => colonyAddress);
  },
});

export const getUserTokens: UserTokensQuery<void, *> = ({
  ddb,
  networkClient,
  metadata,
}) => ({
  async execute() {
    const { walletAddress } = metadata;
    const {
      adapter: { provider },
    } = networkClient;
    const metadataStore = await getUserMetadataStore(ddb)(metadata);

    // for each address, get balance
    const tokens = await Promise.all(
      getUserTokenAddresses(metadataStore).map(async address => {
        const tokenClient = await getTokenClient(address, networkClient);
        const { amount } = await tokenClient.getBalanceOf.call({
          sourceAddress: walletAddress,
        });
        // convert from Ethers BN
        const balance = new BigNumber(amount.toString());
        return { address, balance };
      }),
    );

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
});

export const getUserMetadataStoreAddress: UserQuery<void, string> = ({
  ddb,
  metadata,
}) => ({
  async execute() {
    const profileStore = await getUserProfileStore(ddb)(metadata);
    const { metadataStoreAddress } = await profileStore.all();
    return metadataStoreAddress;
  },
});

export const getUserInboxActivity: UserActivitiesQuery<*, *> = ({
  ddb,
  metadata,
}) => ({
  async execute() {
    const userInboxStore = await getUserInboxStore(ddb)(metadata);
    return userInboxStore
      .all()
      .map(({ meta: { id, timestamp, userAddress }, payload }) =>
        Object.assign({}, payload, { id, timestamp, userAddress }),
      );
  },
});

/* @flow */
import { formatEther } from 'ethers/utils';
import { ADMIN_ROLE, FOUNDER_ROLE } from '@colony/colony-js-client';

import type { OrbitDBAddress } from '~types';

import type {
  ContractTransactionType,
  UserPermissionsType,
  UserProfileType,
} from '~immutable';

import { getEventLogs, parseUserTransferEvent } from '~utils/web3/eventLogs';

import type {
  ColonyClientContext,
  ContextWithMetadata,
  DDBContext,
  ENSCacheContext,
  IPFSContext,
  NetworkClientContext,
  Query,
} from '../../types';

import { USER_EVENT_TYPES } from '../../constants';
import { getUserTasksReducer } from '../reducers';
import { getUserMetadataStore, getUserProfileStore } from '../../stores';

const { SUBSCRIBED_TO_TASK, UNSUBSCRIBED_FROM_TASK } = USER_EVENT_TYPES;

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

type UserAvatarQueryContext = ContextWithMetadata<
  {|
    walletAddress: string,
    username?: string,
  |},
  DDBContext & IPFSContext,
>;

type UserBalanceQueryContext = NetworkClientContext;
type UserPermissionsQueryContext = ColonyClientContext;

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
// type UserPermissionsQuery<I: *, R: *> = Query<ColonyClientContext, I, R>;

type UserColonyTransactionsQuery<I: *> = Query<
  UserColonyTransactionsQueryContext,
  I,
  ContractTransactionType[],
>;

export const getUserProfile: UserQuery<void, UserProfileType> = ({
  ddb,
  metadata,
}) => ({
  async execute() {
    const profileStore = await getUserProfileStore(ddb)(metadata);
    const {
      avatar,
      bio,
      displayName,
      location,
      username,
      walletAddress,
      website,
    } = await profileStore.all();
    return {
      avatar,
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

export const getUserAvatar: Query<UserAvatarQueryContext, void, ?string> = ({
  ddb,
  ipfsNode,
  metadata,
}) => ({
  async execute() {
    const profileStore = await getUserProfileStore(ddb)(metadata);
    const hash = profileStore.get('avatar');
    return hash ? ipfsNode.getString(hash) : null;
  },
});

export const getUserAddress: UsernameQuery<string, string> = ({
  networkClient,
  ensCache,
}) => ({
  async execute(username) {
    const domain = ensCache.constructor.getFullDomain('user', username);
    const address = await ensCache.getAddress(domain, networkClient);

    if (!address)
      throw new Error(`No address found for username "${username}"`);

    return address;
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

export const getUsername: UsernameQuery<string, string> = ({
  networkClient,
  ensCache,
}) => ({
  async execute(address) {
    const domain = await ensCache.getDomain(address, networkClient);

    if (!domain) throw new Error(`No username found for address "${address}"`);

    const [username, type] = domain.split('.');

    if (type !== 'user') throw new Error(`Address "${address}" is not a user`);

    return username;
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

export const getUserPermissions: Query<
  UserPermissionsQueryContext,
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
  metadata,
}) => ({
  async execute() {
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

/* @flow */

import type {
  ContractTransactionType,
  UserProfileType,
  UserPermissionsType,
} from '~immutable';

import { formatEther } from 'ethers/utils';

import type {
  ColonyClientContext,
  Context,
  DDBContext,
  IPFSContext,
  NetworkClientContext,
  Query,
} from '../../types';

import { getUserProfileStore } from '../../stores';
import { getHashedENSDomainString } from '~utils/web3/ens';
import { getEventLogs, parseUserTransferEvent } from '~utils/web3/eventLogs';

type UserQueryContext = Context<
  {|
    walletAddress: string,
    username?: string,
  |},
  DDBContext,
>;

type UserAvatarQueryContext = Context<
  {|
    walletAddress: string,
    username?: string,
  |},
  DDBContext & IPFSContext,
>;

type UserBalanceQueryContext = Context<{}, NetworkClientContext>;
type UserPermissionsQueryContext = Context<{}, ColonyClientContext>;

type UserColonyTransactionsQueryContext = Context<
  {|
    walletAddress: string,
  |},
  ColonyClientContext,
>;

type UserQuery<I: *, R: *> = Query<UserQueryContext, I, R>;
type UsernameQuery<I: *, R: *> = Query<NetworkClientContext, I, R>;
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

export const checkUsernameIsAvailable: UsernameQuery<string, boolean> = ({
  networkClient,
}) => ({
  async execute(username) {
    const nameHash = getHashedENSDomainString(username, 'user');

    const { ensAddress } = networkClient.getAddressForENSHash.call({
      nameHash,
    });

    if (ensAddress)
      throw new Error(`ENS address for user "${username}" already exists`);

    return true;
  },
});

export const getUsername: UsernameQuery<string, string> = ({
  networkClient,
}) => ({
  async execute(ensAddress) {
    const { domain } = networkClient.lookupRegisteredENSDomain.call({
      ensAddress,
    });

    if (!domain)
      throw new Error(`No username found for address "${ensAddress}"`);

    const [username, type] = domain.split('.');

    if (type !== 'user')
      throw new Error(`Address "${ensAddress}" is not a user`);

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
    const canEnterRecoveryMode = await colonyClient.contract.hasUserRole(
      walletAddress,
      2,
    );
    // const canEnterRecoveryMode = await colonyClient.hasUserRole.call({
    //   user: walletAddress,
    //   role: RECOVERY,
    // });
    return { canEnterRecoveryMode };
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

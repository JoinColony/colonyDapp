/* @flow */

import type { ContractTransactionType, UserProfileType } from '~immutable';

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
import {
  getFilterFromPartial,
  getFilterFormattedAddress,
  parseUserTransferEvent,
} from '~utils/web3/eventLogs';

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

type UserBalanceQueryContext = Context<
  {|
    walletAddress: string,
  |},
  NetworkClientContext,
>;

type UserColonyTransactionsQueryContext = Context<
  {|
    walletAddress: string,
  |},
  ColonyClientContext,
>;

type UserQuery<I: *, R: *> = Query<UserQueryContext, I, R>;
type UsernameQueryContext<I: *, R: *> = Query<NetworkClientContext, I, R>;

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

export const checkUsernameIsAvailable: UsernameQueryContext<
  string,
  boolean,
> = ({ networkClient }) => ({
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

export const getUsername: UsernameQueryContext<string, string> = ({
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

export const getUserBalance: Query<UserBalanceQueryContext, void, string> = ({
  networkClient,
  metadata: { walletAddress },
}) => ({
  async execute() {
    const {
      adapter: { provider },
    } = networkClient;
    const balance = await provider.getBalance(walletAddress);
    return formatEther(balance);
  },
});

export const getUserColonyTransactions: UserColonyTransactionsQuery<void> = ({
  colonyClient,
  metadata: { walletAddress },
}) => ({
  async execute() {
    // Will contain to/from block and event name topics
    // TODO use a more meaningful value for blocksBack
    const baseLog = await getFilterFromPartial(
      {
        eventNames: [colonyClient.events.Transfer.eventName],
        blocksBack: 400000,
      },
      colonyClient,
    );

    const filterFormattedAddress = getFilterFormattedAddress(walletAddress);

    // Get logs + events for token Transfer to/from current user
    const toTransferLogs = await colonyClient.tokenClient.getLogs({
      ...baseLog,
      // [eventNames, from, to]
      topics: [[], filterFormattedAddress],
    });

    const fromTransferLogs = await colonyClient.tokenClient.getLogs({
      ...baseLog,
      // [eventNames, from, to]
      topics: [[], undefined, filterFormattedAddress],
    });

    // Combine and sort by blockNumber, parse events
    const transferLogs = [...toTransferLogs, ...fromTransferLogs].sort(
      // $FlowFixMe colonyJS Log should contain blockNumber
      (a, b) => a.blockNumber - b.blockNumber,
    );
    const transferEvents = await colonyClient.tokenClient.parseLogs(
      transferLogs,
    );

    return Promise.all(
      transferEvents.map((event, i) =>
        parseUserTransferEvent({
          event,
          log: transferLogs[i],
          colonyClient,
          userAddress: walletAddress,
        }),
      ),
    );
  },
});

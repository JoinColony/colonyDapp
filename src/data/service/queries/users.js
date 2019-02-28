/* @flow */

import type {
  ContractTransactionType,
  TaskReferenceType,
  UserProfileType,
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
import {
  getEventLogs,
  getFilterFormatted,
  getLogsAndEvents,
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

type UserTransactionIdsQueryContext = Context<
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

export const getUserTaskIds: Query<
  UserTransactionIdsQueryContext,
  void,
  {|
    open: TaskReferenceType[],
    closed: TaskReferenceType[],
  |},
> = ({
  colonyClient: {
    events: { TaskRoleUserSet, TaskFinalized, TaskCanceled },
  },
  colonyClient,
  metadata: { walletAddress },
}) => ({
  async execute() {
    // Get tasks where the user has been involved
    const {
      events: userTasksEvents,
      logs: userTasksLogs,
    } = await getLogsAndEvents(
      colonyClient,
      {},
      {
        blocksBack: 400000,
        events: [TaskRoleUserSet],
        to: walletAddress,
      },
    );

    // Reduce to array of unique taskId/colonyENSName pairs
    const taskIds: TaskReferenceType[] = userTasksEvents.reduce(
      (acc, { taskId }, i) => {
        const colonyENSName = userTasksLogs[i].address;
        return acc.find(
          item =>
            item.taskId === taskId && item.colonyENSName === colonyENSName,
        )
          ? acc
          : [
              ...acc,
              {
                taskId,
                colonyENSName,
              },
            ];
      },
      [],
    );

    // Transform taskId numbers to event topic 32 byte hex strings
    const taskIdTopics = taskIds.map(({ taskId }) =>
      getFilterFormatted(taskId),
    );

    // Get task closed/finalized events for those tasks: `TaskFinalized`, `TaskCanceled`
    const {
      events: taskEndEvents,
      logs: endedTaskLogs,
    } = await getLogsAndEvents(
      colonyClient,
      {
        topics: [[], taskIdTopics],
      },
      {
        blocksBack: 400000,
        events: [TaskFinalized, TaskCanceled],
      },
    );

    // Reduce to array of unique taskId/colonyENSName pairs
    const endedTaskIds: TaskReferenceType[] = taskEndEvents.reduce(
      (acc, { taskId }, i) => {
        const colonyENSName = endedTaskLogs[i].address;
        return acc.find(
          item =>
            item.taskId === taskId && item.colonyENSName === colonyENSName,
        )
          ? acc
          : [
              ...acc,
              {
                taskId,
                colonyENSName,
              },
            ];
      },
      [],
    );

    // Filter tasks which are still open
    const openTaskIds = taskIds.filter(
      task =>
        !endedTaskIds.find(
          endedTask =>
            task.taskId === endedTask.taskId &&
            task.colonyENSName === endedTask.colonyENSName,
        ),
    );

    return {
      closed: endedTaskIds,
      open: openTaskIds,
    };
  },
});

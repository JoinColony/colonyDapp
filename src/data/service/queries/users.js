/* @flow */
import { formatEther } from 'ethers/utils';

import type {
  ContractTransactionType,
  TaskReferenceType,
  UserPermissionsType,
  UserProfileType,
} from '~immutable';

import {
  getEventLogs,
  getFilterFormatted,
  getLogsAndEvents,
  parseUserTransferEvent,
} from '~utils/web3/eventLogs';

import type {
  ColonyClientContext,
  ContextWithMetadata,
  DDBContext,
  ENSCacheContext,
  IPFSContext,
  NetworkClientContext,
  Query,
} from '../../types';

import { getUserProfileStore } from '../../stores';

type UserQueryContext = ContextWithMetadata<
  {|
    walletAddress: string,
    username?: string,
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

type UserTransactionIdsQueryContext = ContextWithMetadata<
  {|
    walletAddress: string,
  |},
  ColonyClientContext,
>;

type UsernameQueryContext = {| ...ENSCacheContext, ...NetworkClientContext |};

type UserQuery<I: *, R: *> = Query<UserQueryContext, I, R>;
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
  async execute(ensAddress) {
    const domain = await ensCache.getDomain(ensAddress, networkClient);

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

// Given task events and logs for those events, obtain unique task references
const getUniqueTaskRefs = (
  events: { taskId: number }[],
  logs: { address: string }[],
): TaskReferenceType[] =>
  events.reduce(
    (refs, { taskId }, i) =>
      refs.find(
        item =>
          item.taskId === taskId && item.colonyIdentifier === logs[i].address,
      )
        ? refs
        : refs.concat({
            taskId,
            colonyIdentifier: logs[i].address,
          }),
    [],
  );

const getTaskRefs = async (
  colonyClient: $PropertyType<ColonyClientContext, 'colonyClient'>,
  ...args: *
) => {
  const { events, logs } = await getLogsAndEvents(colonyClient, ...args);
  return getUniqueTaskRefs(events, logs);
};

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
    // Get unique references to tasks where the user has been involved
    const taskIds = await getTaskRefs(
      colonyClient,
      {},
      {
        blocksBack: 400000,
        events: [TaskRoleUserSet],
        to: walletAddress,
      },
    );

    // Transform taskId numbers to event topic 32 byte hex strings
    const taskIdTopics = taskIds.map(({ taskId }) =>
      getFilterFormatted(taskId),
    );

    // Get unique references for those tasks which are closed
    const endedTaskIds = await getTaskRefs(
      colonyClient,
      {
        topics: [[], taskIdTopics],
      },
      {
        blocksBack: 400000,
        events: [TaskFinalized, TaskCanceled],
      },
    );

    // Filter tasks which are still open
    const openTaskIds = taskIds.filter(
      task =>
        !endedTaskIds.find(
          endedTask =>
            task.taskId === endedTask.taskId &&
            task.colonyIdentifier === endedTask.colonyIdentifier,
        ),
    );

    return {
      closed: endedTaskIds,
      open: openTaskIds,
    };
  },
});

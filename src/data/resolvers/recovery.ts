import { Resolvers } from '@apollo/client';
import {
  ClientType,
  getBlockTime,
  getLogs,
  ColonyClientV5,
  ColonyClientV6,
  getMultipleEvents,
  ColonyRole,
  ColonyVersion,
} from '@colony/colony-js';
import { Log } from 'ethers/providers';
import { LogDescription } from 'ethers/utils';

import { Context } from '~context/index';
import {
  RecoveryEventsForSessionQuery,
  RecoveryEventsForSessionQueryVariables,
  RecoveryEventsForSessionDocument,
  ColonySubscribedUsersQuery,
  ColonySubscribedUsersQueryVariables,
  ColonySubscribedUsersDocument,
  RecoveryRolesUsersQuery,
  RecoveryRolesUsersQueryVariables,
  RecoveryRolesUsersDocument,
  getMinimalUser,
  UserQuery,
} from '~data/index';

import { ProcessedEvent } from './colonyActions';
import {
  ActionsPageFeedType,
  SystemMessage,
  SystemMessagesName,
} from '~dashboard/ActionsPageFeed';
import { ensureHexPrefix } from '~utils/strings';
import { ColonyAndExtensionsEvents } from '~types/index';

const getSessionRecoveryEvents = async (
  colonyClient: ColonyClientV6,
  startBlock = 1,
) => {
  const blockFilter: {
    fromBlock: number;
    toBlock?: number;
  } = {
    fromBlock: startBlock,
  };
  const recoveryModeLogs: Log[] = [];

  const [mostRecentExitRecovery] = await getLogs(
    colonyClient,
    colonyClient.filters.RecoveryModeExited(null),
    {
      fromBlock: startBlock,
    },
  );

  if (mostRecentExitRecovery) {
    blockFilter.toBlock = mostRecentExitRecovery?.blockNumber;
    recoveryModeLogs.push(mostRecentExitRecovery);
  }

  const storageSlotSetLogs = await getLogs(
    colonyClient,
    colonyClient.filters.RecoveryStorageSlotSet(null, null, null, null),
    blockFilter,
  );

  const exitApprovedLogs = await getLogs(
    colonyClient,
    colonyClient.filters.RecoveryModeExitApproved(null),
    blockFilter,
  );

  const parsedRecoveryEvents = await Promise.all(
    [...recoveryModeLogs, ...storageSlotSetLogs, ...exitApprovedLogs].map(
      async (log) => {
        const potentialParsedLog = colonyClient.interface.parseLog(log);
        const { address, blockHash } = log;
        const { name, values } = potentialParsedLog;
        return {
          type: ActionsPageFeedType.NetworkEvent,
          name,
          values,
          createdAt: blockHash
            ? await getBlockTime(colonyClient.provider, blockHash)
            : 0,
          emmitedBy: ClientType.ColonyClient,
          address,
        } as ProcessedEvent;
      },
    ),
  );

  const sortedRecoveryEvents = parsedRecoveryEvents.sort(
    (firstEvent, secondEvent) => firstEvent.createdAt - secondEvent.createdAt,
  );

  return sortedRecoveryEvents;
};

const getUsersWithRecoveryRoles = (recoveryRoleSetEvents: LogDescription[]) => {
  const userAddresses: Record<string, boolean> = {};
  recoveryRoleSetEvents.map(({ values: { user, setTo } }) => {
    if (setTo) {
      userAddresses[user] = true;
    } else {
      userAddresses[user] = false;
    }
    return null;
  });
  return Object.keys(userAddresses).filter(
    (userAddress) => !!userAddresses[userAddress],
  );
};

const resetAllApprovalChecks = (users: Array<UserQuery['user']>) =>
  users.map((user) => ({ ...user, approvedRecoveryExit: false }));

export const recoveryModeResolvers = ({
  colonyManager,
  colonyManager: { provider },
  apolloClient,
}: Required<Context>): Resolvers => ({
  Query: {
    async recoveryEventsForSession(_, { blockNumber, colonyAddress }) {
      try {
        const colonyClient = (await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        )) as ColonyClientV6;

        return await getSessionRecoveryEvents(colonyClient, blockNumber);
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async recoverySystemMessagesForSession(_, { blockNumber, colonyAddress }) {
      try {
        /*
         * @NOTE Leveraging apollo's internal cache
         *
         * This might seem counter intuitive, fetching an apollo query here,
         * when we could just call `getSessionRecoveryEvents` directly, but
         * doing so, allows us to fetch the recovery events that are already
         * inside the cache, and not be forced to fetch them all over again.
         *
         * This cuts down on loading times, especially on pages with a lot
         * of events generated.
         */
        const recoveryEvents = await apolloClient.query<
          RecoveryEventsForSessionQuery,
          RecoveryEventsForSessionQueryVariables
        >({
          query: RecoveryEventsForSessionDocument,
          variables: {
            colonyAddress,
            blockNumber,
          },
        });

        if (recoveryEvents?.data?.recoveryEventsForSession?.length) {
          const colonyClient = (await colonyManager.getClient(
            ClientType.ColonyClient,
            colonyAddress,
          )) as ColonyClientV6;

          let exitApprovalsCounter = 0;
          const systemMessages: SystemMessage[] = [];

          const thresholdExitApprovals = (
            await colonyClient.numRecoveryRoles()
          ).toNumber();

          await Promise.all(
            recoveryEvents.data.recoveryEventsForSession.map(
              async ({ createdAt, name }) => {
                switch (name) {
                  case ColonyAndExtensionsEvents.RecoveryModeExitApproved:
                    exitApprovalsCounter += 1;
                    break;
                  case ColonyAndExtensionsEvents.RecoveryStorageSlotSet:
                    exitApprovalsCounter = 0;
                    break;
                  default:
                    break;
                }
                if (exitApprovalsCounter >= thresholdExitApprovals) {
                  systemMessages.push({
                    type: ActionsPageFeedType.SystemMessage,
                    name: SystemMessagesName.EnoughExitRecoveryApprovals,
                    createdAt,
                  });
                  exitApprovalsCounter = 0;
                }
              },
            ),
          );
          return systemMessages;
        }
        return [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async recoveryRolesUsers(_, { colonyAddress }) {
      try {
        const subscribedUsers = await apolloClient.query<
          ColonySubscribedUsersQuery,
          ColonySubscribedUsersQueryVariables
        >({
          query: ColonySubscribedUsersDocument,
          variables: {
            colonyAddress,
          },
        });

        const colonyClient = (await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        )) as ColonyClientV6;

        const recoveryRolesSet = await getMultipleEvents(colonyClient, [
          colonyClient.filters.RecoveryRoleSet(null, null),
        ]);

        const allUsers = subscribedUsers?.data?.subscribedUsers || [];
        const userWithRecoveryRoles = getUsersWithRecoveryRoles(
          recoveryRolesSet,
        );

        return userWithRecoveryRoles.map((userAddress) => {
          const userWithProfile = allUsers.find(
            ({ profile: { walletAddress } }) =>
              walletAddress.toLowerCase() === userAddress.toLowerCase(),
          );
          if (!userWithProfile) {
            return getMinimalUser(userAddress);
          }
          return userWithProfile;
        });
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async recoveryRolesAndApprovalsForSession(
      _,
      { blockNumber, colonyAddress },
    ) {
      try {
        /*
         * @NOTE Leveraging apollo's internal cache
         *
         * This might seem counter intuitive, fetching an apollo query here,
         * when we could just call `getSessionRecoveryEvents` directly, but
         * doing so, allows us to fetch the recovery events that are already
         * inside the cache, and not be forced to fetch them all over again.
         *
         * This cuts down on loading times, especially on pages with a lot
         * of events generated.
         */
        const recoveryEvents = await apolloClient.query<
          RecoveryEventsForSessionQuery,
          RecoveryEventsForSessionQueryVariables
        >({
          query: RecoveryEventsForSessionDocument,
          variables: {
            colonyAddress,
            blockNumber,
          },
        });

        /*
         * @NOTE Leveraging apollo's internal cache yet again, so we don't
         * re-fetch and re-parse both the server user and the recovery role events
         */
        const usersWithRecoveryRoles = await apolloClient.query<
          RecoveryRolesUsersQuery,
          RecoveryRolesUsersQueryVariables
        >({
          query: RecoveryRolesUsersDocument,
          variables: {
            colonyAddress,
          },
        });

        if (
          recoveryEvents?.data?.recoveryEventsForSession?.length &&
          usersWithRecoveryRoles?.data?.recoveryRolesUsers?.length
        ) {
          let usersAndApprovals = resetAllApprovalChecks(
            usersWithRecoveryRoles.data.recoveryRolesUsers,
          );

          recoveryEvents.data.recoveryEventsForSession.map((event) => {
            const { name, values } = event;
            const { user: userAddress } = (values as unknown) as {
              user: string;
            };
            const userIndex = usersAndApprovals.findIndex(
              ({ id: walletAddress }) =>
                walletAddress.toLowerCase() === userAddress.toLowerCase(),
            );
            if (name === ColonyAndExtensionsEvents.RecoveryModeExitApproved) {
              usersAndApprovals[userIndex].approvedRecoveryExit = true;
            }
            /*
             * Storage Slot was set, reset everything
             */
            if (name === ColonyAndExtensionsEvents.RecoveryStorageSlotSet) {
              usersAndApprovals = resetAllApprovalChecks(usersAndApprovals);
            }
            return null;
          });

          return usersAndApprovals;
        }
        return [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async getRecoveryStorageSlot(_, { colonyAddress, storageSlot }) {
      try {
        const storageSlotValue = await provider.getStorageAt(
          colonyAddress,
          storageSlot,
        );
        return ensureHexPrefix(
          storageSlotValue.toLowerCase().slice(2).padStart(64, '0'),
        );
      } catch (error) {
        console.error(error);
        return `0x${'0'.padStart(64, '0')}`;
      }
    },
    async getRecoveryRequiredApprovals(_, { colonyAddress }) {
      try {
        const colonyClient = (await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        )) as ColonyClientV6;

        const requiredApprovals = await colonyClient.numRecoveryRoles();
        return requiredApprovals.toNumber();
      } catch (error) {
        console.error(error);
        return 0;
      }
    },
    /*
     * Total number of recovery roles set to users by the colony
     *
     * We use this to detect the issue introduced in v5 network contracts
     * and prevent the colony upgrade if a colony has more than 1 recovery
     * roles set to users
     */
    async legacyNumberOfRecoveryRoles(_, { colonyAddress }) {
      try {
        const colonyClient = (await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        )) as ColonyClientV5;

        const colonyVersion = await colonyClient.version();

        /*
         * @NOTE We don't care about colonies that are newer than v6
         */
        if (colonyVersion.toNumber() === ColonyVersion.LightweightSpaceship) {
          const allRolesSet = await getMultipleEvents(colonyClient, [
            colonyClient.filters.ColonyRoleSet(null, null, null, null, null),
          ]);
          const filteredAllRoles = getUsersWithRecoveryRoles(
            allRolesSet?.filter(
              ({ values }) => values?.role === ColonyRole.Recovery,
            ) || [],
          );

          const recoveryRolesSet = await getMultipleEvents(colonyClient, [
            colonyClient.filters.RecoveryRoleSet(null, null),
          ]);
          const filteredRecoveryRoles = getUsersWithRecoveryRoles(
            recoveryRolesSet,
          );

          return [...filteredAllRoles, ...filteredRecoveryRoles].length;
        }
        return 0;
      } catch (error) {
        console.error(error);
        return 0;
      }
    },
  },
});

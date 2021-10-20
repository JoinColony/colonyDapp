import { ApolloClient, Resolvers } from '@apollo/client';
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
import { LogDescription } from 'ethers/utils';
import { AddressZero } from 'ethers/constants';

import { Context } from '~context/index';
import {
  RecoveryEventsForSessionQuery,
  RecoveryEventsForSessionQueryVariables,
  RecoveryEventsForSessionDocument,
  ColonyMembersQuery,
  ColonyMembersQueryVariables,
  ColonyMembersDocument,
  RecoveryRolesUsersQuery,
  RecoveryRolesUsersQueryVariables,
  RecoveryRolesUsersDocument,
  getMinimalUser,
  UserQuery,
  GetRecoveryRequiredApprovalsQuery,
  GetRecoveryRequiredApprovalsQueryVariables,
  GetRecoveryRequiredApprovalsDocument,
} from '~data/index';

import { ProcessedEvent } from './colonyActions';
import {
  ActionsPageFeedType,
  SystemMessage,
  SystemMessagesName,
} from '~dashboard/ActionsPageFeed';
import { ensureHexPrefix } from '~utils/strings';
import { halfPlusOne } from '~utils/numbers';
import { ColonyAndExtensionsEvents } from '~types/index';
import {
  SubgraphRecoveryModeEventsDocument,
  SubgraphRecoveryModeEventsQuery,
  SubgraphRecoveryModeEventsQueryVariables,
} from '~data/generated';
import { parseSubgraphEvent } from '~utils/events';

const getSessionRecoveryEvents = async (
  apolloClient: ApolloClient<object>,
  colonyAddress: string,
  startBlock = 1,
) => {
  const blockFilter: {
    fromBlock: number;
    toBlock?: number;
  } = {
    fromBlock: startBlock,
  };

  const { data: recoveryModeEventsData } = await apolloClient.query<
    SubgraphRecoveryModeEventsQuery,
    SubgraphRecoveryModeEventsQueryVariables
  >({
    query: SubgraphRecoveryModeEventsDocument,
    variables: {
      colonyAddress: colonyAddress.toLowerCase(),
    },
    fetchPolicy: 'network-only',
  });

  const storageSlotSetEvents =
    recoveryModeEventsData?.recoveryStorageSlotSetEvents || [];
  const recoveryModeExitApprovedEvents =
    recoveryModeEventsData?.recoveryModeExitApprovedEvents || [];
  const recoveryModeExitedEvents =
    recoveryModeEventsData?.recoveryModeExitedEvents || [];

  const [mostRecentExitRecoveryEvent] = recoveryModeExitedEvents
    .filter(
      (event) =>
        parseInt(event.transaction.block.number.replace('block_', ''), 10) >=
        blockFilter.fromBlock,
    )
    .sort(
      (firstEvent, secondEvent) =>
        parseInt(firstEvent.transaction.block.timestamp, 10) -
        parseInt(secondEvent.transaction.block.timestamp, 10),
    );

  if (mostRecentExitRecoveryEvent) {
    blockFilter.toBlock = parseInt(
      mostRecentExitRecoveryEvent.transaction.block.number.replace(
        'block_',
        '',
      ),
      10,
    );
  }

  const recoveryModeEvents = [
    ...storageSlotSetEvents,
    ...recoveryModeExitApprovedEvents,
  ].filter((event) => {
    const eventBlockNumber = parseInt(
      event.transaction.block.number.replace('block_', ''),
      10,
    );
    const isOnToBlockRange = blockFilter.toBlock
      ? eventBlockNumber <= blockFilter.toBlock
      : true;
    return eventBlockNumber >= blockFilter.fromBlock && isOnToBlockRange;
  });

  if (mostRecentExitRecoveryEvent) {
    recoveryModeEvents.push(mostRecentExitRecoveryEvent);
  }

  const parsedRecoveryEvents = await Promise.all(
    [...recoveryModeEvents].map(async (event) => {
      const parsedEvent = parseSubgraphEvent(event);
      const { address } = event;
      const { name, values, blockNumber, hash, timestamp } = parsedEvent;
      return {
        type: ActionsPageFeedType.NetworkEvent,
        name,
        values,
        createdAt: timestamp,
        emmitedBy: ClientType.ColonyClient,
        address,
        blockNumber,
        transactionHash: hash,
      } as ProcessedEvent;
    }),
  );

  /*
   * Mayyyybe? this can work if we just use reverse() -- going by the logic
   * that all events come in order from the chain?
   *
   * Unless the RPC provider screws us over that is...
   */
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
        return await getSessionRecoveryEvents(
          apolloClient,
          colonyAddress,
          blockNumber,
        );
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async recoveryAllEnteredEvents(_, { colonyAddress }) {
      try {
        const colonyClient = (await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        )) as ColonyClientV6;

        const enterRecoveryLogs = await getLogs(
          colonyClient,
          colonyClient.filters.RecoveryModeEntered(null),
        );

        return Promise.all(
          enterRecoveryLogs.map(async (log) => {
            const potentialParsedLog = colonyClient.interface.parseLog(log);
            const { address, blockHash, blockNumber, transactionHash } = log;
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
              blockNumber,
              transactionHash,
            } as ProcessedEvent;
          }),
        );
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

        /*
         * @NOTE Leveraging apollo's internal cache
         *
         * This cuts down on loading times, especially on pages with a lot
         * of events generated.
         */
        const requiredApprovals = await apolloClient.query<
          GetRecoveryRequiredApprovalsQuery,
          GetRecoveryRequiredApprovalsQueryVariables
        >({
          query: GetRecoveryRequiredApprovalsDocument,
          variables: {
            colonyAddress,
            blockNumber,
          },
        });

        if (
          recoveryEvents?.data?.recoveryEventsForSession?.length &&
          requiredApprovals?.data?.getRecoveryRequiredApprovals
        ) {
          let exitApprovalsCounter = 0;
          const systemMessages: SystemMessage[] = [];

          const {
            data: { getRecoveryRequiredApprovals: thresholdExitApprovals },
          } = requiredApprovals;

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
    async recoveryRolesUsers(_, { colonyAddress, endBlockNumber }) {
      try {
        const subscribedUsers = await apolloClient.query<
          ColonyMembersQuery,
          ColonyMembersQueryVariables
        >({
          query: ColonyMembersDocument,
          variables: {
            colonyAddress,
          },
        });

        /*
         * @NOTE This part is **very** import here
         *
         * We need to check the RecoveryRoleSet events UP UNTIL the block where
         * we exit the recovery mode.
         *
         * This is because the "old" recovery mode pages (where the recovery
         * session finished), need the reflect the then-users and approvals
         * as the roles might change between sessions (eg: one user lost
         * the recovery role, another gained it)
         *
         * If we are in a recovery session curently, we just go up until the
         * curent block
         *
         * (then again, we could also check these against the bock up until the
         * recovery session start, as roles cannot be changed once the recovery
         * session starts)
         */
        const filterOptions: { fromBlock: number; toBlock?: number } = {
          fromBlock: 0,
        };
        if (endBlockNumber) {
          filterOptions.toBlock = endBlockNumber;
        }

        const colonyClient = (await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        )) as ColonyClientV6;

        const recoveryRolesSet = await getMultipleEvents(
          colonyClient,
          [colonyClient.filters.RecoveryRoleSet(null, null)],
          filterOptions,
        );

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

        // eslint-disable-next-line max-len
        const potentialExitEvent = recoveryEvents?.data?.recoveryEventsForSession?.find(
          ({ name }) => name === ColonyAndExtensionsEvents.RecoveryModeExited,
        );

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
            endBlockNumber: potentialExitEvent?.blockNumber,
          },
        });

        if (usersWithRecoveryRoles?.data?.recoveryRolesUsers?.length) {
          let usersAndApprovals = resetAllApprovalChecks(
            usersWithRecoveryRoles.data.recoveryRolesUsers,
          );

          recoveryEvents?.data?.recoveryEventsForSession.map((event) => {
            const { name, values } = event;
            const { user: userAddress } = (values as unknown) as {
              user: string;
            };
            const userIndex = usersAndApprovals.findIndex(
              ({ id: walletAddress }) =>
                walletAddress.toLowerCase() === userAddress.toLowerCase(),
            );
            if (
              name === ColonyAndExtensionsEvents.RecoveryModeExitApproved &&
              userIndex >= 0
            ) {
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
    async getRecoveryRequiredApprovals(_, { blockNumber, colonyAddress }) {
      try {
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
            endBlockNumber: blockNumber,
          },
        });

        const colonyClient = (await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        )) as ColonyClientV6;

        /*
         * The deployment owner is "special"
         *
         * Normally it's not set, but might get set when the colony is in
         * recovery mode, so the next the colony is in recovery mode, we
         * need to count recovery roles + 1
         */
        const deploymentOwner = await colonyClient.owner();

        /*
         * If we have an owner address, we need to actually check if that is
         * a different address from all the ones that have recovery roles assinged
         * to them.
         *
         * If it is, disregard it, as the number of required approvals is the same.
         *
         * But if it's not, then we need to add one to the count
         */
        if (deploymentOwner !== AddressZero) {
          /*
           * Prettier is being stupid again
           */
          // eslint-disable-next-line max-len
          const isOwnerAlreadyAssignedRole = usersWithRecoveryRoles?.data?.recoveryRolesUsers?.find(
            ({ id: walletAddress }) =>
              walletAddress.toLowerCase() === deploymentOwner.toLowerCase(),
          );
          if (!isOwnerAlreadyAssignedRole) {
            return halfPlusOne(
              usersWithRecoveryRoles?.data?.recoveryRolesUsers?.length
                ? usersWithRecoveryRoles?.data?.recoveryRolesUsers?.length + 1
                : 1,
            );
          }
          /*
           * If we could find the user in the recovery roles array it means that
           * even though it has the owner designation as well, it was also
           * assigned a recovery role, at which point we just default back
           * to our usual mode of calculating this.
           */
        }

        /*
         * We don't have the owner address set, so we just take the total
         * number of recovery roles and apply the half + 1 logic
         */
        return halfPlusOne(
          usersWithRecoveryRoles?.data?.recoveryRolesUsers?.length || 0,
        );
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

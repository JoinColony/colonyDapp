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

import { Context } from '~context/index';
import {
  RecoveryEventsForSessionQueryVariables,
  RecoveryEventsForSessionQuery,
  RecoveryEventsForSessionDocument,
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

        return getSessionRecoveryEvents(colonyClient, blockNumber);
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
          const filteredAllRoles = allRolesSet?.filter(({ values }) => {
            if (values) {
              return values?.setTo && values?.role === ColonyRole.Recovery;
            }
            return false;
          });

          const recoveryRolesSet = await getMultipleEvents(colonyClient, [
            colonyClient.filters.RecoveryRoleSet(null, null),
          ]);
          const filteredRecoveryRoles = recoveryRolesSet?.filter(
            ({ values }) => {
              if (values) {
                return values?.setTo;
              }
              return false;
            },
          );

          return [...filteredAllRoles, ...filteredRecoveryRoles].length;
        }
        return 0;
      } catch (error) {
        console.error(error);
        return 0;
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
  },
});

import { Resolvers } from '@apollo/client';
import {
  ClientType,
  getBlockTime,
  getLogs,
  ColonyClientV5,
  getMultipleEvents,
  ColonyRole,
  ColonyVersion,
} from '@colony/colony-js';
import { Log } from 'ethers/providers';

import { Context } from '~context/index';

import { ProcessedEvent } from './colonyActions';

export const recoveryModeResolvers = ({
  colonyManager,
  colonyManager: {
    networkClient: { provider },
  },
}: Required<Context>): Resolvers => ({
  Query: {
    async recoveryEventsForSession(_, { blockNumber, colonyAddress }) {
      try {
        const blockFilter: {
          fromBlock: number;
          toBlock?: number;
        } = {
          fromBlock: blockNumber,
        };
        const recoveryModeLogs: Log[] = [];

        const colonyClient = (await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        )) as ColonyClientV5;

        const [mostRecentRecovery] = await getLogs(
          colonyClient,
          colonyClient.filters.RecoveryModeExited(null),
          blockFilter,
        );

        if (mostRecentRecovery) {
          blockFilter.toBlock = mostRecentRecovery?.blockNumber;
          recoveryModeLogs.push(mostRecentRecovery);
        }

        const storageSlotSet = await getLogs(
          colonyClient,
          colonyClient.filters.RecoveryStorageSlotSet(null, null, null, null),
          blockFilter,
        );

        const exitApprovedLogs = await getLogs(
          colonyClient,
          colonyClient.filters.RecoveryModeExitApproved(null),
          blockFilter,
        );

        const parsedLogs = await Promise.all(
          [...storageSlotSet, ...exitApprovedLogs, ...recoveryModeLogs].map(
            async (log) => {
              const potentialParsedLog = colonyClient.interface.parseLog(log);
              const { address, blockHash } = log;
              const { name, values } = potentialParsedLog;
              return {
                name,
                values,
                createdAt: blockHash
                  ? await getBlockTime(provider, blockHash)
                  : 0,
                emmitedBy: ClientType.ColonyClient,
                address,
              } as ProcessedEvent;
            },
          ),
        );
        return parsedLogs;
      } catch (error) {
        console.error(error);
        return null;
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
  },
});

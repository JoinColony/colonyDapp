import { Resolvers } from '@apollo/client';
import {
  ClientType,
  getBlockTime,
  getLogs,
  ColonyClientV5,
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

        const storageSetFilter = await getLogs(
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
          [...storageSetFilter, ...exitApprovedLogs, ...recoveryModeLogs].map(
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
  },
});

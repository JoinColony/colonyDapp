import { ClientType } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';
import { Resolvers } from '@apollo/client';

import {
  ClientType,
  getLogs,
  getBlockTime,
  ExtensionClient,
  MotionState as NetworkMotionState,
} from '@colony/colony-js';

import { Context } from '~context/index';
import { createAddress } from '~utils/web3';
import { ColonyAndExtensionsEvents } from '~types/index';
import {
  ActionsPageFeedType,
  SystemMessage,
  SystemMessagesName,
} from '~dashboard/ActionsPageFeed';

import { ProcessedEvent } from './colonyActions';

export const motionsResolvers = ({
  colonyManager: { networkClient },
  colonyManager,
}: Required<Context>): Resolvers => ({
  Query: {
    async motionsSystemMessages(_, { motionId, colonyAddress }) {
      const { provider } = networkClient;
      const votingReputationClient = (await colonyManager.getClient(
        ClientType.VotingReputationClient,
        colonyAddress,
      )) as ExtensionClient;
      const motion = await votingReputationClient.getMotion(motionId);
      const motionNetworkState = await votingReputationClient.getMotionState(
        motionId,
      );
      const systemMessages: SystemMessage[] = [];

      // @TODO Add missing types to colonyjs
      // @ts-ignore
      const motionStakedFilter = votingReputationClient.filters.MotionStaked(
        motionId,
        null,
        null,
        null,
      );
      const motionStakedLogs = await getLogs(
        votingReputationClient,
        motionStakedFilter,
      );
      // @ts-ignore
      // eslint-disable-next-line max-len
      const motionVoteRevealedFilter = votingReputationClient.filters.MotionVoteRevealed(
        motionId,
        null,
        null,
      );
      const motionVoteRevealedLogs = await getLogs(
        votingReputationClient,
        motionVoteRevealedFilter,
      );

      const parsedEvents = await Promise.all(
        [...motionStakedLogs, ...motionVoteRevealedLogs].map(async (log) => {
          const parsedLog = votingReputationClient.interface.parseLog(log);
          const { address, blockHash, blockNumber, transactionHash } = log;
          const { name, values } = parsedLog;
          return {
            type: ActionsPageFeedType.NetworkEvent,
            name,
            values,
            createdAt: blockHash ? await getBlockTime(provider, blockHash) : 0,
            emmitedBy: ClientType.ColonyClient,
            address,
            blockNumber,
            transactionHash,
          } as ProcessedEvent;
        }),
      );

      const sortedEvents = parsedEvents.sort(
        (firstEvent, secondEvent) =>
          secondEvent.createdAt - firstEvent.createdAt,
      );

      if (
        motionNetworkState === NetworkMotionState.Finalizable ||
        motionNetworkState === NetworkMotionState.Finalized
      ) {
        const newestStakeOrVoteEvent = sortedEvents.find(
          (event) =>
            event.name === ColonyAndExtensionsEvents.MotionStaked ||
            event.name === ColonyAndExtensionsEvents.MotionVoteRevealed,
        );
        if (newestStakeOrVoteEvent) {
          if (
            motion.votes[0].lt(motion.votes[1]) ||
            motion.stakes[0].lt(motion.stakes[1])
          ) {
            systemMessages.push({
              type: ActionsPageFeedType.SystemMessage,
              name: SystemMessagesName.MotionHasPassed,
              createdAt: newestStakeOrVoteEvent.createdAt,
            });
          }
        }
      }

      return Promise.all(systemMessages);
    },
  },
  Motion: {
    async state({ fundamentalChainId, associatedColony: { colonyAddress } }) {
      const votingReputationClient = await colonyManager.getClient(
        ClientType.VotingReputationClient,
        createAddress(colonyAddress),
      );
      return votingReputationClient.getMotionState(
        bigNumberify(fundamentalChainId),
      );
    },
 },
});

import { Resolvers } from '@apollo/client';
import {
  ClientType,
  getBlockTime,
  getLogs,
  Extension,
  ColonyClientV6,
} from '@colony/colony-js';
import { VotingReputationClient } from '@colony/colony-js/lib/clients/VotingReputationClient';
import { bigNumberify } from 'ethers/utils';

import { Context } from '~context/index';

import { ProcessedEvent } from './colonyActions';
import { ActionsPageFeedType } from '~dashboard/ActionsPageFeed';

const getMotionEvents = async (
  votingReputationClient: VotingReputationClient,
  motionId: string,
) => {
  const motionStakedLogs = await getLogs(
    votingReputationClient,
    votingReputationClient.filters.MotionStaked(
      bigNumberify(motionId),
      null,
      null,
      null,
    ),
  );

  const parsedMotionEvents = await Promise.all(
    [...motionStakedLogs].map(async (log) => {
      const potentialParsedLog = votingReputationClient.interface.parseLog(log);
      const { address, blockHash, blockNumber, transactionHash } = log;
      const {
        name,
        values: { amount, ...rest },
      } = potentialParsedLog;
      const stakeAmount = name === 'MotionStaked' ? amount : null;

      return {
        type: ActionsPageFeedType.NetworkEvent,
        name,
        values: {
          ...rest,
          stakeAmount,
        },
        createdAt: blockHash
          ? await getBlockTime(votingReputationClient.provider, blockHash)
          : 0,
        emmitedBy: ClientType.VotingReputationClient,
        address,
        blockNumber,
        transactionHash,
      } as ProcessedEvent;
    }),
  );

  /*
   * Mayyyybe? this can work if we just use reverse() -- going by the logic
   * that all events come in order from the chain?
   *
   * Unless the RPC provider screws us over that is...
   */
  const sortedMotionEvents = parsedMotionEvents.sort(
    (firstEvent, secondEvent) => firstEvent.createdAt - secondEvent.createdAt,
  );

  return sortedMotionEvents;
};

export const motionResolvers = ({
  colonyManager,
}: Required<Context>): Resolvers => ({
  Query: {
    async eventsForMotion(_, { motionId, colonyAddress }) {
      try {
        const colonyClient = (await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        )) as ColonyClientV6;
        const votingReputationClient = (await colonyClient.getExtensionClient(
          Extension.VotingReputation,
        )) as VotingReputationClient;

        return await getMotionEvents(votingReputationClient, motionId);
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  },
});

import { Resolvers } from '@apollo/client';
import { ClientType, ColonyClientV6, Extension } from '@colony/colony-js';

import { Context } from '~context/index';

export const stakesResolvers = ({
  colonyManager,
}: Required<Context>): Resolvers => ({
  Query: {
    async stakeAmountsForMotion(_, { colonyAddress, userAddress, motionId }) {
      try {
        const colonyClient = (await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        )) as ColonyClientV6;
        const votingReputationClient = colonyClient.getExtensionClient(
          Extension.VotingReputation,
        );
        const motionData = (await votingReputationClient).getMotion(motionId);
        const totalStaked = motionData.stakes[1];
        const userStake = (await votingReputationClient).getStake(
          motionId,
          userAddress,
          1,
        );
        const requiredStake = (await votingReputationClient).getRequiredStake(
          motionId,
        );

        return {
          totalStaked,
          userStake,
          requiredStake,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});

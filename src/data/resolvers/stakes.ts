import { Resolvers } from '@apollo/client';
import { ClientType, Extension } from '@colony/colony-js';

import { Context } from '~context/index';
import { getMotionRequiredStake, MotionVote } from '~utils/colonyMotions';

export const stakesResolvers = ({
  colonyManager,
}: Required<Context>): Resolvers => ({
  Query: {
    async stakeAmountsForMotion(_, { colonyAddress, userAddress, motionId }) {
      try {
        const colonyClient = await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        );
        const votingReputationClient = await colonyClient.getExtensionClient(
          Extension.VotingReputation,
        );
        const { stakes, skillRep } = await votingReputationClient.getMotion(
          motionId,
        );
        const [totalNAYStakes, totalYAYStaked] = stakes;

        const userStakeYay = await votingReputationClient.getStake(
          motionId,
          userAddress,
          MotionVote.Yay,
        );

        const userStakeNay = await votingReputationClient.getStake(
          motionId,
          userAddress,
          MotionVote.Nay,
        );

        // @NOTE There's no prettier compatible solution to this :(
        // eslint-disable-next-line max-len
        const totalStakeFraction = await votingReputationClient.getTotalStakeFraction();
        const requiredStake = getMotionRequiredStake(
          skillRep,
          totalStakeFraction,
          18,
        ).toString();

        return {
          totalStaked: {
            YAY: totalYAYStaked.toString(),
            NAY: totalNAYStakes.toString(),
          },
          userStake: {
            YAY: userStakeYay.toString(),
            NAY: userStakeNay.toString(),
          },
          requiredStake,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});

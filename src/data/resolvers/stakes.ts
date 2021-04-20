import { Resolvers } from '@apollo/client';
import { ClientType, Extension } from '@colony/colony-js';

import { Context } from '~context/index';
import { getMotionRequiredStake, MotionVote } from '~utils/colonyMotions';

export const stakesResolvers = ({
  colonyManager,
}: Required<Context>): Resolvers => ({
  Query: {
    async stakeAmountsForMotion(
      _,
      { colonyAddress, userAddress, motionId, isObjectionStake },
    ) {
      try {
        const supportedSide = isObjectionStake
          ? MotionVote.NAY
          : MotionVote.YAY;
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
        const userStake = await votingReputationClient.getStake(
          motionId,
          userAddress,
          supportedSide,
        );
        // @NOTE There's no prettier compatible solution to this :(
        // eslint-disable-next-line max-len
        const totalStakeFraction = await votingReputationClient.getTotalStakeFraction();
        const requiredStake = getMotionRequiredStake(
          skillRep,
          totalStakeFraction,
          18,
        ).toString();
        const totalStaked = stakes[supportedSide].toString();
        const userStakeAmount = userStake.toString();

        return {
          totalStaked,
          userStake: userStakeAmount,
          requiredStake,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});

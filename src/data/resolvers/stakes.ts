import { Resolvers } from '@apollo/client';
import { ClientType, Extension } from '@colony/colony-js';

import { Context } from '~context/index';
import { StakeSide } from '~dashboard/ActionsPage/TotalStakeWidget';
import { getMotionRequiredStake, MotionVote } from '~utils/colonyMotions';

export const stakesResolvers = ({
  colonyManager,
}: Required<Context>): Resolvers => ({
  Query: {
    async stakeAmountsForMotion(
      _,
      { colonyAddress, userAddress, motionId, stakeSide },
    ) {
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
        let userStakeAmount: string | null = null;

        if (stakeSide !== StakeSide.Both) {
          const supportedSide =
            stakeSide === StakeSide.Objection ? MotionVote.Nay : MotionVote.Yay;

          const userStake = await votingReputationClient.getStake(
            motionId,
            userAddress,
            supportedSide,
          );

          userStakeAmount = userStake.toString();
        }

        // @NOTE There's no prettier compatible solution to this :(
        // eslint-disable-next-line max-len
        const totalStakeFraction = await votingReputationClient.getTotalStakeFraction();
        const requiredStake = getMotionRequiredStake(
          skillRep,
          totalStakeFraction,
          18,
        ).toString();
        const totalStaked: {
          YAY: string | null;
          NAY: string | null;
        } = {
          YAY:
            stakeSide !== StakeSide.Objection ? stakes[MotionVote.Yay] : null,
          NAY: stakeSide !== StakeSide.Motion ? stakes[MotionVote.Nay] : null,
        };

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

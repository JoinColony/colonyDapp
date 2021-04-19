import { Resolvers } from '@apollo/client';
import { ClientType, Extension } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';

import { Context } from '~context/index';
import { MotionVote } from '~utils/colonyMotions';

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
        const tokenDecimals = await colonyClient.tokenClient.decimals();
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
        const requiredStake = skillRep
          .mul(totalStakeFraction)
          .div(bigNumberify(10).pow(tokenDecimals * 2))
          .toString();
        const totalStaked = stakes[supportedSide]
          .div(bigNumberify(10).pow(tokenDecimals))
          .toString();
        const userStakeAmount = userStake
          .div(bigNumberify(10).pow(tokenDecimals))
          .toString();

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

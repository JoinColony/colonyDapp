import { Resolvers } from '@apollo/client';
import { ClientType, ColonyClientV6 } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';

import { Context } from '~context/index';

export const stakesResolvers = ({
  colonyManager,
}: Required<Context>): Resolvers => ({
  Query: {
    async stakeMotionLimits(
      _,
      { colonyAddress, userAddress, motionId, rootHash },
    ) {
      try {
        const colonyClient = (await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        )) as ColonyClientV6;
        const votingReputationClient = await colonyManager.getClient(
          ClientType.VotingReputationClient,
          colonyAddress,
        );
        const tokenDecimals = await colonyClient.tokenClient.decimals();
        const {
          skillRep,
          stakes,
          domainId,
        } = await votingReputationClient.getMotion(motionId);
        const { skillId } = await colonyClient.getDomain(domainId);
        const { reputationAmount } = await colonyClient.getReputation(
          skillId,
          userAddress,
          rootHash,
        );
        // @NOTE There's no prettier compatible solution to this :(
        // eslint-disable-next-line max-len
        const totalStakeFraction = await votingReputationClient.getTotalStakeFraction();
        // eslint-disable-next-line max-len
        const userMinStakeFraction = await votingReputationClient.getUserMinStakeFraction();

        const totalYAYStaked = stakes[1];
        const requiredStake = skillRep
          .mul(totalStakeFraction)
          .div(bigNumberify(10).pow(tokenDecimals))
          /*
           * @NOTE This is over-estimating by 1 to counteract a bug in the contracts
           * To remove after it's fixed
           */
          .add(1);
        const remainingToFullyStaked = requiredStake.sub(totalYAYStaked);
        const userMinStakeAmount = skillRep
          .mul(totalStakeFraction)
          .mul(userMinStakeFraction)
          /*
           * @NOTE 36 in here has a reason.
           * Both totalStakeFraction and userMinStakeFraction are fixed point 18
           * meaning they both divide by 10 to the power of 18
           *
           * So since we've multiplied by both, we need to divide by
           * 10 to the power of 18 times 2
           */
          .div(bigNumberify(10).pow(36));

        return {
          remainingToFullyStaked: remainingToFullyStaked.toString(),
          maxUserStake: reputationAmount.toString(),
          minUserStake: userMinStakeAmount.toString(),
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});

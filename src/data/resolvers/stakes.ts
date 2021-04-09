import { Resolvers } from '@apollo/client';
import { ClientType, ColonyClientV6, Extension } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';

import { Context } from '~context/index';

export const stakesResolvers = ({
  colonyManager,
}: Required<Context>): Resolvers => ({
  Query: {
    async stakeMotionLimits(_, { colonyAddress, userAddress, motionId }) {
      try {
        const colonyClient = (await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        )) as ColonyClientV6;
        const votingReputationClient = await colonyClient.getExtensionClient(
          Extension.VotingReputation,
        );
        const {
          skillRep,
          stakes,
          domainId,
        } = await votingReputationClient.getMotion(motionId);
        const { skillId } = await colonyClient.getDomain(domainId);
        const { reputationAmount } = await colonyClient.getReputation(
          skillId,
          userAddress,
        );
        // @NOTE There's no prettier compatible solution to this :(
        // eslint-disable-next-line max-len
        const totalStakeFraction = await votingReputationClient.getTotalStakeFraction();
        // eslint-disable-next-line max-len
        const userMinStakeFraction = await votingReputationClient.getUserMinStakeFraction();

        const totalStaked = bigNumberify(stakes[1])
          .div(bigNumberify(10).pow(18))
          .toNumber();
        const totalStakeAmount = skillRep
          .mul(totalStakeFraction)
          .div(bigNumberify(10).pow(36))
          .toNumber();
        const userMinStakeAmount = skillRep
          .mul(totalStakeFraction)
          .mul(userMinStakeFraction)
          .div(bigNumberify(10).pow(54))
          .toNumber();
        const formattedReputationAmount = reputationAmount
          .div(bigNumberify(10).pow(18))
          .toNumber();

        let maxStake: number;
        let minStake: number;

        if (formattedReputationAmount >= totalStakeAmount - totalStaked) {
          maxStake = totalStakeAmount - totalStaked;
        } else {
          maxStake = formattedReputationAmount;
        }

        if (userMinStakeAmount > totalStakeAmount - totalStaked) {
          minStake = totalStakeAmount - totalStaked;
        } else {
          minStake = userMinStakeAmount;
        }

        return {
          minStake,
          maxStake,
          requiredStake: totalStakeAmount,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});

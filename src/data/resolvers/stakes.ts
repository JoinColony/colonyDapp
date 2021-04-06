import { Resolvers } from '@apollo/client';
import { ClientType, ColonyClientV6, Extension } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';

import { Context } from '~context/index';

export const stakesResolvers = ({
  colonyManager,
}: Required<Context>): Resolvers => ({
  Query: {
    async stakeMotionLimits(_, { colonyAddress, motionId }) {
      try {
        const colonyClient = (await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        )) as ColonyClientV6;
        const votingReputationClient = await colonyClient.getExtensionClient(
          Extension.VotingReputation,
        );
        const { skillRep, stakes } = await votingReputationClient.getMotion(
          motionId,
        );
        // @NOTE There's no prettier compatible solution to this :(
        // eslint-disable-next-line max-len
        const totalStakeFraction = await votingReputationClient.getTotalStakeFraction();
        // eslint-disable-next-line max-len
        const userMinStakeFraction = await votingReputationClient.getUserMinStakeFraction();

        const totalStaked = bigNumberify(stakes[1]).toNumber();
        const totalStakeAmount = skillRep
          .mul(totalStakeFraction)
          .div(bigNumberify(10).pow(36))
          .toNumber();
        const userMinStakeAmount = skillRep
          .mul(totalStakeFraction)
          .mul(userMinStakeFraction)
          .div(bigNumberify(10).pow(54))
          .toNumber();

        const maxStake = totalStakeAmount - totalStaked;
        let minStake: number;

        if (userMinStakeAmount > totalStakeAmount - totalStaked) {
          minStake = totalStakeAmount - totalStaked;
        } else {
          minStake = userMinStakeAmount;
        }

        return {
          minStake,
          maxStake,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});

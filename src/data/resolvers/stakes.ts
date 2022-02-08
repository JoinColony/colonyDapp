import { Resolvers } from '@apollo/client';
import { ClientType, Extension } from '@colony/colony-js';

import { Context } from '~context/index';
import { getMotionRequiredStake, MotionVote } from '~utils/colonyMotions';
import {
  SubgraphUserMotionTokenEventsDocument,
  SubgraphUserMotionTokenEventsQuery,
  SubgraphUserMotionTokenEventsQueryVariables,
} from '~data/generated';

export const stakesResolvers = ({
  colonyManager,
  apolloClient,
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
    async claimableStakedMotions(_, { colonyAddress, walletAddress }) {
      try {
        const colonyClient = await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        );
        const votingReputationClient = await colonyClient.getExtensionClient(
          Extension.VotingReputation,
        );

        const { data: userStakedMotions } = await apolloClient.query<
          SubgraphUserMotionTokenEventsQuery,
          SubgraphUserMotionTokenEventsQueryVariables
        >({
          query: SubgraphUserMotionTokenEventsDocument,
          variables: {
            colonyAddress: colonyAddress?.toLowerCase(),
            walletAddress: walletAddress?.toLowerCase(),
            extensionAddress:
              votingReputationClient?.address?.toLowerCase() || '',
            sortDirection: 'desc',
          },
          fetchPolicy: 'network-only',
        });

        /* Get array of already claimed motionIds within argument string */
        const alreadyClaimedMotions =
          userStakedMotions?.motionRewardClaimedEvents.map((event) => {
            return JSON.parse(event.args).motionId;
          }) || [];

        /* Get array of claimable motionIds */
        let unclaimedMotions;
        if (
          userStakedMotions?.motionStakedEvents &&
          userStakedMotions.motionStakedEvents?.length > 0
        ) {
          unclaimedMotions = userStakedMotions.motionStakedEvents
            /* Map event motionIds */
            .map((event) => JSON.parse(event.args).motionId)
            /* Filter out already claimed motions */
            .filter((motionId) => !alreadyClaimedMotions.includes(motionId))
            /* Remove duplicate motionIds */
            .filter((motionId, index, arr) => arr.indexOf(motionId) === index);
        } else {
          unclaimedMotions = [];
        }

        return {
          motionIds: unclaimedMotions,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});

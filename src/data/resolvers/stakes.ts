import { Resolvers } from '@apollo/client';
import {
  ClientType,
  Extension,
  MotionState as NetworkMotionState,
} from '@colony/colony-js';

import { Context } from '~context/index';
import { getMotionRequiredStake, MotionVote } from '~utils/colonyMotions';
import { parseSubgraphEvent } from '~utils/events';
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

        /* Query staked motion events and claimed motion events */
        const { data } = await apolloClient.query<
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

        const motionStakedEvents = (data?.motionStakedEvents || []).map(
          parseSubgraphEvent,
        );
        const motionRewardClaimedEvents = (
          data?.motionRewardClaimedEvents || []
        ).map(parseSubgraphEvent);

        /* Get array of staked motionIds */
        /* Remove duplicate motionIds */
        const mappedMotionIds = motionStakedEvents?.map(
          (event) => event.values?.motionId,
        );
        const mappedClaimedIds = motionRewardClaimedEvents?.map(
          (event) => event.values?.motionId,
        );

        const unclaimedMotions =
          motionStakedEvents
            ?.filter(
              (event, index) =>
                mappedMotionIds.indexOf(event.values?.motionId) === index,
            )
            /* Filter out claimed motions */
            .filter(
              (event) => !mappedClaimedIds.includes(event.values?.motionId),
            ) || [];

        /* Return finalized and failed claimable motions */
        const motionStates = await Promise.all(
          unclaimedMotions?.map(async (event) => {
            try {
              const motionStatus = await votingReputationClient.getMotionState(
                event.values.motionId,
              );
              if (
                motionStatus === NetworkMotionState.Finalized ||
                motionStatus === NetworkMotionState.Failed
              ) {
                return event.values.motionId;
              }
              return undefined;
            } catch (error) {
              return undefined;
            }
          }) || [],
        );

        const claimableUnclaimedMotions =
          unclaimedMotions?.filter((event) =>
            motionStates.includes(event.values?.motionId),
          ) || [];

        return {
          unclaimedMotionStakeEvents: claimableUnclaimedMotions,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});

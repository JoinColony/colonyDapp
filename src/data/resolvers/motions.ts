import {
  ClientType,
  ExtensionClient,
  ColonyClientV6,
  getBlockTime,
  MotionState as NetworkMotionState,
  ROOT_DOMAIN_ID,
} from '@colony/colony-js';
import { bigNumberify, hexStripZeros } from 'ethers/utils';
import { AddressZero } from 'ethers/constants';
import { Resolvers } from '@apollo/client';

import { Context } from '~context/index';
import { createAddress } from '~utils/web3';
import {
  getMotionActionType,
  getMotionState,
  parseSubgraphEvent,
  sortSubgraphEventByIndex,
  NormalizedSubgraphEvent,
  ExtendedLogDescription,
} from '~utils/events';
import {
  MotionVote,
  getMotionRequiredStake,
  getEarlierEventTimestamp,
} from '~utils/colonyMotions';
import { ColonyAndExtensionsEvents, SortDirection } from '~types/index';
import {
  SubgraphMotionEventsQuery,
  SubgraphMotionEventsQueryVariables,
  SubgraphMotionEventsDocument,
  SubgraphMotionSystemEventsQuery,
  SubgraphMotionSystemEventsQueryVariables,
  SubgraphMotionSystemEventsDocument,
  SubgraphMotionVoteSubmittedEventsQuery,
  SubgraphMotionVoteSubmittedEventsQueryVariables,
  SubgraphMotionVoteSubmittedEventsDocument,
  SubgraphMotionVoteRevealedEventsQuery,
  SubgraphMotionVoteRevealedEventsQueryVariables,
  SubgraphMotionVoteRevealedEventsDocument,
  SubgraphMotionStakedEventsQuery,
  SubgraphMotionStakedEventsQueryVariables,
  SubgraphMotionStakedEventsDocument,
  SubgraphAnnotationEventsQuery,
  SubgraphAnnotationEventsQueryVariables,
  SubgraphAnnotationEventsDocument,
  SubgraphMotionRewardClaimedEventsQuery,
  SubgraphMotionRewardClaimedEventsQueryVariables,
  SubgraphMotionRewardClaimedEventsDocument,
  UserReputationQuery,
  UserReputationQueryVariables,
  UserReputationDocument,
} from '~data/index';

import {
  ActionsPageFeedType,
  SystemMessage,
  SystemMessagesName,
} from '~dashboard/ActionsPageFeed';
import { availableRoles } from '~dashboard/PermissionManagementDialog';
import { DEFAULT_NETWORK_TOKEN } from '~constants';

import { ProcessedEvent } from './colonyActions';

const getMotionEvents = (
  isSystemEvents: boolean,
  motionEvents?: NormalizedSubgraphEvent[],
): ProcessedEvent[] => {
  if (motionEvents) {
    const parsedMotionEvents = motionEvents
      .map(parseSubgraphEvent)
      .map((event) => {
        const { hash, timestamp, blockNumber } = event;
        return {
          ...event,
          type: ActionsPageFeedType.NetworkEvent,
          createdAt: timestamp || 0,
          blockNumber: blockNumber || 0,
          emmitedBy: isSystemEvents
            ? ClientType.ColonyClient
            : ClientType.VotingReputationClient,
          transactionHash: hash || '',
        };
      });

    return parsedMotionEvents;
  }

  return [];
};

const getTimeoutPeriods = async (colonyManager, colonyAddress, motionId) => {
  try {
    const extensionClient = await colonyManager.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const { networkClient } = colonyManager;

    const blockTime =
      (await getBlockTime(networkClient.provider, 'latest')) || 0;

    const escalationPeriod = await extensionClient.getEscalationPeriod();

    const { events } = await extensionClient.getMotion(motionId);

    const timeLeftToStake = events[0] * 1000 - blockTime;
    const timeLeftToSubmit = events[1] * 1000 - blockTime;
    const timeLeftToReveal = events[2] * 1000 - blockTime;
    const timeLeftToEscalate =
      timeLeftToReveal + escalationPeriod.toNumber() * 1000;

    return {
      __typename: 'MotionTimeoutPeriods',
      timeLeftToStake: timeLeftToStake > 0 ? timeLeftToStake : 0,
      timeLeftToSubmit: timeLeftToSubmit > 0 ? timeLeftToSubmit : 0,
      timeLeftToReveal: timeLeftToReveal > 0 ? timeLeftToReveal : 0,
      timeLeftToEscalate: timeLeftToEscalate > 0 ? timeLeftToEscalate : 0,
    };
  } catch (error) {
    console.error('Could not get Voting Reputation extension period values');
    console.error(error);
    return null;
  }
};

export const motionsResolvers = ({
  colonyManager: { networkClient },
  colonyManager,
  apolloClient,
}: Required<Context>): Resolvers => ({
  Query: {
    async motionStakes(_, { colonyAddress, userAddress, motionId }) {
      try {
        const colonyClient = (await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        )) as ColonyClientV6;
        const votingReputationClient = await colonyManager.getClient(
          ClientType.VotingReputationClient,
          colonyAddress,
        );
        const {
          skillRep,
          stakes,
          domainId,
          rootHash,
        } = await votingReputationClient.getMotion(motionId);
        const { skillId } = await colonyClient.getDomain(domainId);
        const {
          reputationAmount,
        } = await colonyClient.getReputationWithoutProofs(
          skillId,
          userAddress,
          rootHash,
        );
        // @NOTE There's no prettier compatible solution to this :(
        // eslint-disable-next-line max-len
        const totalStakeFraction = await votingReputationClient.getTotalStakeFraction();
        // eslint-disable-next-line max-len
        const userMinStakeFraction = await votingReputationClient.getUserMinStakeFraction();

        const [totalNAYStakes, totalYAYStaked] = stakes;
        const requiredStake = getMotionRequiredStake(
          skillRep,
          totalStakeFraction,
          18,
        );
        const remainingToFullyYayStaked = requiredStake.sub(totalYAYStaked);
        const remainingToFullyNayStaked = requiredStake.sub(totalNAYStakes);
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
          totalNAYStakes: totalNAYStakes.toString(),
          remainingToFullyYayStaked: remainingToFullyYayStaked.toString(),
          remainingToFullyNayStaked: remainingToFullyNayStaked.toString(),
          maxUserStake: reputationAmount.toString(),
          minUserStake: userMinStakeAmount.toString(),
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async motionsSystemMessages(_, { motionId, colonyAddress }) {
      const votingReputationClient = (await colonyManager.getClient(
        ClientType.VotingReputationClient,
        colonyAddress,
      )) as ExtensionClient;
      const motion = await votingReputationClient.getMotion(motionId);
      const motionNetworkState = await votingReputationClient.getMotionState(
        motionId,
      );
      const { domainId: motionDomainId } = motion;
      const systemMessages: SystemMessage[] = [];

      const { data } = await apolloClient.query<
        SubgraphMotionSystemEventsQuery,
        SubgraphMotionSystemEventsQueryVariables
      >({
        query: SubgraphMotionSystemEventsDocument,
        variables: {
          /*
           * Subgraph addresses are not checksummed
           */
          colonyAddress: colonyAddress.toLowerCase(),
          motionId: `"motionId":"${motionId}"`,
        },
        fetchPolicy: 'network-only',
      });

      const sortedEvents = getMotionEvents(
        true,
        data?.motionSystemEvents,
      ).sort((firstEvent, secondEvent) =>
        sortSubgraphEventByIndex(firstEvent, secondEvent, SortDirection.DESC),
      );

      const blocktime = await getBlockTime(networkClient.provider, 'latest');

      const timeToSubmitMS = motion.events[1].toNumber() * 1000;
      const timeToSubmitInPast = timeToSubmitMS < blocktime;
      const newestVoteSubmittedEvent = sortedEvents.find(
        (event) => event.name === ColonyAndExtensionsEvents.MotionVoteSubmitted,
      );

      // eslint-disable-next-line max-len
      const totalStakeFraction = await votingReputationClient.getTotalStakeFraction();
      const requiredStake = getMotionRequiredStake(
        motion.skillRep,
        totalStakeFraction,
        18,
      );

      const latestMotionStakedYAYEvent = sortedEvents.find(
        (event) =>
          event.name === ColonyAndExtensionsEvents.MotionStaked &&
          event.values.vote === MotionVote.Yay,
      );

      const latestMotionStakedNAYEvent = sortedEvents.find(
        (event) =>
          event.name === ColonyAndExtensionsEvents.MotionStaked &&
          event.values.vote === MotionVote.Nay,
      );

      if (latestMotionStakedNAYEvent) {
        if (motion.stakes[MotionVote.Nay].gte(requiredStake)) {
          if (
            (motion.stakes[MotionVote.Yay].eq(motion.stakes[MotionVote.Nay]) &&
              latestMotionStakedYAYEvent &&
              latestMotionStakedNAYEvent?.createdAt <
                latestMotionStakedYAYEvent?.createdAt) ||
            motion.stakes[MotionVote.Nay].gt(motion.stakes[MotionVote.Yay])
          ) {
            systemMessages.push({
              type: ActionsPageFeedType.SystemMessage,
              name: SystemMessagesName.ObjectionFullyStaked,
              createdAt: latestMotionStakedNAYEvent.createdAt,
            });
          }
        }
      }

      if (latestMotionStakedYAYEvent) {
        if (motion.stakes[MotionVote.Yay].gte(requiredStake)) {
          if (
            motion.stakes[MotionVote.Yay].eq(motion.stakes[MotionVote.Nay]) &&
            latestMotionStakedNAYEvent &&
            latestMotionStakedNAYEvent?.createdAt <
              latestMotionStakedYAYEvent?.createdAt
          ) {
            systemMessages.push({
              type: ActionsPageFeedType.SystemMessage,
              name: SystemMessagesName.MotionFullyStakedAfterObjection,
              createdAt: latestMotionStakedYAYEvent.createdAt,
            });
          } else {
            systemMessages.push({
              type: ActionsPageFeedType.SystemMessage,
              name: SystemMessagesName.MotionFullyStaked,
              createdAt: latestMotionStakedYAYEvent.createdAt,
            });
          }
        }
      }

      if (
        motionNetworkState === NetworkMotionState.Reveal ||
        timeToSubmitInPast
      ) {
        if (newestVoteSubmittedEvent) {
          systemMessages.push({
            type: ActionsPageFeedType.SystemMessage,
            name: SystemMessagesName.MotionRevealPhase,
            createdAt: timeToSubmitMS,
          });
        }
      }

      if (
        motionNetworkState === NetworkMotionState.Submit ||
        newestVoteSubmittedEvent
      ) {
        systemMessages.push({
          type: ActionsPageFeedType.SystemMessage,
          name: SystemMessagesName.MotionVotingPhase,
          createdAt: motion.events[0].toNumber() * 1000,
        });
      }

      if (
        motionNetworkState === NetworkMotionState.Closed &&
        !motionDomainId.eq(ROOT_DOMAIN_ID)
      ) {
        systemMessages.push({
          type: ActionsPageFeedType.SystemMessage,
          name: SystemMessagesName.MotionCanBeEscalated,
          /*
           * @NOTE We can just use the current time, since this is the last entry
           * in the feed
           */
          createdAt: blocktime,
        });
      }

      if (
        motionNetworkState === NetworkMotionState.Finalizable ||
        motionNetworkState === NetworkMotionState.Finalized
      ) {
        const newestStakeOrVoteEvent = sortedEvents.find(
          (event) =>
            event.name === ColonyAndExtensionsEvents.MotionStaked ||
            event.name === ColonyAndExtensionsEvents.MotionVoteRevealed,
        );
        if (newestStakeOrVoteEvent) {
          if (
            motion.votes[0].lt(motion.votes[1]) ||
            motion.stakes[0].lt(motion.stakes[1])
          ) {
            systemMessages.push({
              type: ActionsPageFeedType.SystemMessage,
              name: SystemMessagesName.MotionHasPassed,
              createdAt: getEarlierEventTimestamp(
                newestStakeOrVoteEvent.createdAt,
                -5,
              ),
            });
          }
        }
      }

      if (
        motionNetworkState === NetworkMotionState.Finalizable ||
        motionNetworkState === NetworkMotionState.Finalized
      ) {
        const newestVoteRevealed = sortedEvents.find(
          (event) =>
            event.name === ColonyAndExtensionsEvents.MotionVoteRevealed,
        );
        if (newestVoteRevealed) {
          if (motion.votes[0].gte(motion.votes[1])) {
            systemMessages.push({
              type: ActionsPageFeedType.SystemMessage,
              name: SystemMessagesName.MotionRevealResultObjectionWon,
              createdAt: getEarlierEventTimestamp(
                newestVoteRevealed.createdAt,
                -1,
              ),
            });
            systemMessages.push({
              type: ActionsPageFeedType.SystemMessage,
              name: SystemMessagesName.MotionHasFailedFinalizable,
              createdAt: getEarlierEventTimestamp(
                newestVoteRevealed.createdAt,
                -5,
              ),
            });
          } else {
            systemMessages.push({
              type: ActionsPageFeedType.SystemMessage,
              name: SystemMessagesName.MotionRevealResultMotionWon,
              createdAt: getEarlierEventTimestamp(
                newestVoteRevealed.createdAt,
                -1,
              ),
            });
          }
        } else if (
          motion.votes[0].gte(motion.votes[1]) &&
          motion.stakes[0].gte(motion.stakes[1])
        ) {
          systemMessages.push({
            type: ActionsPageFeedType.SystemMessage,
            name: SystemMessagesName.MotionHasFailedFinalizable,
            createdAt: motion.events[2].toNumber() * 1000,
          });
        }
      }

      if (motionNetworkState === NetworkMotionState.Failed) {
        systemMessages.push({
          type: ActionsPageFeedType.SystemMessage,
          name: SystemMessagesName.MotionHasFailedNotFinalizable,
          createdAt: motion.events[1].toNumber() * 1000,
        });
      }

      return Promise.all(systemMessages);
    },
    async motionVoterReward(_, { motionId, colonyAddress, userAddress }) {
      try {
        const votingReputationClient = await colonyManager.getClient(
          ClientType.VotingReputationClient,
          colonyAddress,
        );
        const { domainId, rootHash } = await votingReputationClient.getMotion(
          motionId,
        );
        const state = await votingReputationClient.getMotionState(motionId);

        const { data } = await apolloClient.query<
          UserReputationQuery,
          UserReputationQueryVariables
        >({
          query: UserReputationDocument,
          variables: {
            colonyAddress,
            address: userAddress,
            domainId: domainId.toNumber(),
            rootHash,
          },
        });
        if (data?.userReputation) {
          let reward = bigNumberify(0);
          let minReward = bigNumberify(0);
          let maxReward = bigNumberify(0);

          if (state === NetworkMotionState.Submit) {
            try {
              const [
                minUserReward,
                maxUserReward,
              ] = await votingReputationClient.getVoterRewardRange(
                bigNumberify(motionId),
                bigNumberify(data.userReputation),
                createAddress(userAddress),
              );
              minReward = minUserReward;
              maxReward = maxUserReward;
            } catch (error) {
              /* getVoterRewardRange return error if no-one has voted yet or
               user in question has no reputaiton.
              */
            }
          } else {
            reward = await votingReputationClient.getVoterReward(
              bigNumberify(motionId),
              bigNumberify(data.userReputation),
            );
          }
          return {
            reward: reward.toString(),
            minReward: minReward.toString(),
            maxReward: maxReward.toString(),
          };
        }
        return null;
      } catch (error) {
        console.error('Could not fetch users vote reward');
        console.error(error);
        return null;
      }
    },
    async eventsForMotion(_, { motionId, colonyAddress }) {
      try {
        const { data } = await apolloClient.query<
          SubgraphMotionEventsQuery,
          SubgraphMotionEventsQueryVariables
        >({
          query: SubgraphMotionEventsDocument,
          variables: {
            /*
             * Subgraph addresses are not checksummed
             */
            colonyAddress: colonyAddress.toLowerCase(),
            motionId: `"motionId":"${motionId}"`,
          },
          fetchPolicy: 'network-only',
        });

        const sortedMotionEvents = getMotionEvents(
          false,
          data?.motionEvents,
        ).sort((firstEvent, secondEvent) =>
          sortSubgraphEventByIndex(firstEvent, secondEvent),
        );

        const firstMotionStakedNAYEvent = sortedMotionEvents.find(
          (event) =>
            event.name === ColonyAndExtensionsEvents.MotionStaked &&
            event.values.vote === MotionVote.Nay,
        );

        if (firstMotionStakedNAYEvent) {
          const {
            values,
            blockNumber,
            transactionHash,
            address,
          } = firstMotionStakedNAYEvent;
          sortedMotionEvents.push({
            type: ActionsPageFeedType.NetworkEvent,
            name: ColonyAndExtensionsEvents.ObjectionRaised,
            /*
             * @NOTE: I substract 1 second out of the timestamp
             * to make the event appear before the first NAY stake
             */
            createdAt: getEarlierEventTimestamp(
              firstMotionStakedNAYEvent.createdAt || 0,
            ),
            values,
            emmitedBy: ClientType.VotingReputationClient,
            blockNumber,
            transactionHash,
            address,
          });
        }
        return sortedMotionEvents;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async motionCurrentUserVoted(_, { motionId, colonyAddress, userAddress }) {
      try {
        const { data } = await apolloClient.query<
          SubgraphMotionVoteSubmittedEventsQuery,
          SubgraphMotionVoteSubmittedEventsQueryVariables
        >({
          query: SubgraphMotionVoteSubmittedEventsDocument,
          variables: {
            /*
             * Subgraph addresses are not checksummed
             */
            colonyAddress: colonyAddress.toLowerCase(),
            motionId: `"motionId":"${motionId}"`,
          },
          fetchPolicy: 'network-only',
        });

        const hasCurrentUserVoted = !!data?.motionVoteSubmittedEvents.filter(
          (event) => event.args.includes(userAddress),
        );

        return hasCurrentUserVoted;
      } catch (error) {
        console.error('Could not fetch current user vote status');
        console.error(error);
        return null;
      }
    },
    async motionUserVoteRevealed(_, { motionId, colonyAddress, userAddress }) {
      try {
        let userVote: {
          revealed: boolean;
          vote: MotionVote | null;
        } = {
          revealed: false,
          vote: null,
        };

        const { data } = await apolloClient.query<
          SubgraphMotionVoteRevealedEventsQuery,
          SubgraphMotionVoteRevealedEventsQueryVariables
        >({
          query: SubgraphMotionVoteRevealedEventsDocument,
          variables: {
            /*
             * Subgraph addresses are not checksummed
             */
            colonyAddress: colonyAddress.toLowerCase(),
            motionId: `"motionId":"${motionId}"`,
          },
          fetchPolicy: 'network-only',
        });

        const userEvents = data?.motionVoteRevealedEvents.filter((event) =>
          event.args.includes(userAddress.toLowerCase()),
        );

        if (userEvents?.length) {
          const {
            values: { vote },
          } = parseSubgraphEvent(userEvents[0]);
          userVote = {
            revealed: true,
            vote,
          };
        }
        return userVote;
      } catch (error) {
        console.error('Could not fetch user vote revealed state');
        console.error(error);
        return null;
      }
    },
    async motionVoteResults(_, { motionId, colonyAddress, userAddress }) {
      try {
        const voteResult: {
          currentUserVoteSide: number | null;
          yayVotes: string | null;
          yayVoters: string[];
          nayVotes: string | null;
          nayVoters: string[];
        } = {
          currentUserVoteSide: null,
          yayVotes: null,
          yayVoters: [],
          nayVotes: null,
          nayVoters: [],
        };

        const votingReputationClient = await colonyManager.getClient(
          ClientType.VotingReputationClient,
          colonyAddress,
        );
        const { votes } = await votingReputationClient.getMotion(motionId);
        voteResult.yayVotes = votes[1].toString();
        voteResult.nayVotes = votes[0].toString();

        const { data } = await apolloClient.query<
          SubgraphMotionVoteRevealedEventsQuery,
          SubgraphMotionVoteRevealedEventsQueryVariables
        >({
          query: SubgraphMotionVoteRevealedEventsDocument,
          variables: {
            /*
             * Subgraph addresses are not checksummed
             */
            colonyAddress: colonyAddress.toLowerCase(),
            motionId: `"motionId":"${motionId}"`,
          },
          fetchPolicy: 'network-only',
        });

        if (data?.motionVoteRevealedEvents) {
          const parsedEvents = data?.motionVoteRevealedEvents.map(
            parseSubgraphEvent,
          );

          parsedEvents?.map(({ values: { vote, voter } }) => {
            const currentUserVoted = voter === createAddress(userAddress);
            /*
             * @NOTE We're using this little hack in order to ensure, that if
             * the currently logged in user was one of the voters, that
             * their avatar is going to show up first in the vote results
             */
            const arrayMethod = currentUserVoted ? 'unshift' : 'push';
            if (currentUserVoted) {
              voteResult.currentUserVoteSide = vote;
            }
            if (vote === MotionVote.Yay) {
              voteResult.yayVoters[arrayMethod](voter);
            }
            /*
             * @NOTE We expressly declare NAY rather then using "else" to prevent
             * any other *unexpected* values coming from the chain messing up our
             * data (eg if vote was 2 due to weird issues)
             */
            if (vote === MotionVote.Nay) {
              voteResult.nayVoters[arrayMethod](voter);
            }
          });
        }

        return voteResult;
      } catch (error) {
        console.error('Could not fetch motion voting results');
        console.error(error);
        return null;
      }
    },
    async votingState(_, { colonyAddress, motionId }) {
      try {
        const votingReputationClient = await colonyManager.getClient(
          ClientType.VotingReputationClient,
          colonyAddress,
        );
        const {
          skillRep,
          repSubmitted,
        } = await votingReputationClient.getMotion(motionId);
        // eslint-disable-next-line max-len
        const maxVoteFraction = await votingReputationClient.getMaxVoteFraction();

        const thresholdValue = getMotionRequiredStake(
          skillRep,
          maxVoteFraction,
          18,
        );

        return {
          thresholdValue: thresholdValue.toString(),
          totalVotedReputation: repSubmitted.toString(),
          skillRep: skillRep.toString(),
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async motionStatus(_, { motionId, colonyAddress }) {
      try {
        const votingReputationClient = await colonyManager.getClient(
          ClientType.VotingReputationClient,
          colonyAddress,
        );
        const motion = await votingReputationClient.getMotion(motionId);
        const motionState = await votingReputationClient.getMotionState(
          motionId,
        );

        return getMotionState(
          motionState,
          votingReputationClient as ExtensionClient,
          motion,
        );
      } catch (error) {
        console.error('Could not fetch motion state');
        console.error(error);
        return null;
      }
    },
    async motionFinalized(_, { motionId, colonyAddress }) {
      try {
        const votingReputationClient = await colonyManager.getClient(
          ClientType.VotingReputationClient,
          colonyAddress,
        );
        const { finalized } = await votingReputationClient.getMotion(motionId);

        return finalized;
      } catch (error) {
        console.error('Could not fetch motion finalized state');
        console.error(error);
        return null;
      }
    },
    async motionStakerReward(_, { motionId, colonyAddress, userAddress }) {
      try {
        let stakerReward: {
          stakingRewardYay: string | null;
          stakingRewardNay: string | null;
          stakesYay: string | null;
          stakesNay: string | null;
          claimedReward: boolean | null;
        } = {
          stakingRewardYay: null,
          stakingRewardNay: null,
          stakesYay: null,
          stakesNay: null,
          claimedReward: null,
        };

        const { data: stakeEventsData } = await apolloClient.query<
          SubgraphMotionStakedEventsQuery,
          SubgraphMotionStakedEventsQueryVariables
        >({
          query: SubgraphMotionStakedEventsDocument,
          variables: {
            /*
             * Subgraph addresses are not checksummed
             */
            colonyAddress: colonyAddress.toLowerCase(),
            motionId: `"motionId":"${motionId}"`,
          },
          fetchPolicy: 'network-only',
        });

        const { data: rewardsEventsData } = await apolloClient.query<
          SubgraphMotionRewardClaimedEventsQuery,
          SubgraphMotionRewardClaimedEventsQueryVariables
        >({
          query: SubgraphMotionRewardClaimedEventsDocument,
          variables: {
            /*
             * Subgraph addresses are not checksummed
             */
            colonyAddress: colonyAddress.toLowerCase(),
            motionId: `"motionId":"${motionId}"`,
          },
          fetchPolicy: 'network-only',
        });

        const userStakeEvents = stakeEventsData?.motionStakedEvents.filter(
          (event) => event.args.includes(userAddress.toLowerCase()),
        );

        /* eslint-disable-next-line max-len */
        const userRewardClaimedEvents = rewardsEventsData?.motionRewardClaimedEvents.filter(
          (event) => event.args.includes(userAddress.toLowerCase()),
        );

        const userStakeParsedEvents = userStakeEvents
          ? userStakeEvents.map(parseSubgraphEvent)
          : [];

        const userRewardClaimedParsedEvents = userRewardClaimedEvents
          ? userRewardClaimedEvents.map(parseSubgraphEvent)
          : [];

        const votingReputationClient = await colonyManager.getClient(
          ClientType.VotingReputationClient,
          colonyAddress,
        );

        let stakesYay = bigNumberify(0);
        let stakesNay = bigNumberify(0);
        userStakeParsedEvents.map(({ values: { amount, vote } }) => {
          if (vote === MotionVote.Yay) {
            stakesYay = stakesYay.add(amount);
            return stakesYay;
          }
          stakesNay = stakesNay.add(amount);
          return stakesNay;
        });
        /*
         * @NOTE We need to do a little bit of try/catch trickery here because of
         * the way the contracts function
         *
         * If **anyone** staked on a side, calling the rewards function (even for
         * a user who didnd't stake) returns 0
         *
         * But calling the rewards function on a side where **no one** has voted
         * will result in an error being thrown.
         *
         * For this we initialize both with zero, call them both in a try/catch
         * block. If they succeed, they overwrite their initial valiues, if they
         * fail, they fall back to the initial 0.
         */
        let stakingRewardYay = bigNumberify(0);
        let stakingRewardNay = bigNumberify(0);
        try {
          [stakingRewardYay] = await votingReputationClient.getStakerReward(
            motionId,
            userAddress,
            1,
          );
        } catch (error) {
          /*
           * We don't care to catch the error since we fallback to it's initial value
           */
          // silent error
        }
        try {
          [stakingRewardNay] = await votingReputationClient.getStakerReward(
            motionId,
            userAddress,
            0,
          );
        } catch (error) {
          /*
           * We don't care to catch the error since we fallback to it's initial value
           */
          // silent error
        }
        /*
         * @NOTE If we claimed the rewards, than `getStakerReward` will return 0
         * (since we already claimed the reward, hence no more reward left).
         *
         * To be able to display the "original" value of the reward, we need to
         * parse the claim reward events
         */
        userRewardClaimedParsedEvents.map(({ values: { amount, vote } }) => {
          if (vote === MotionVote.Yay) {
            stakingRewardYay = amount;
            return stakingRewardYay;
          }
          stakingRewardNay = amount;
          return stakingRewardNay;
        });
        stakerReward = {
          stakingRewardYay: stakingRewardYay.toString(),
          stakingRewardNay: stakingRewardNay.toString(),
          stakesYay: stakesYay.toString(),
          stakesNay: stakesNay.toString(),
          claimedReward: !!userRewardClaimedParsedEvents.length,
        };
        return stakerReward;
      } catch (error) {
        console.error('Could not fetch the rewards for the current staker');
        console.error(error);
        return null;
      }
    },
    async motionObjectionAnnotation(_, { motionId, colonyAddress }) {
      let objectionAnnotation = {
        address: null,
        metadata: null,
      };
      try {
        const { data } = await apolloClient.query<
          SubgraphMotionStakedEventsQuery,
          SubgraphMotionStakedEventsQueryVariables
        >({
          query: SubgraphMotionStakedEventsDocument,
          variables: {
            /*
             * Subgraph addresses are not checksummed
             */
            colonyAddress: colonyAddress.toLowerCase(),
            motionId: `"motionId":"${motionId}"`,
          },
          fetchPolicy: 'network-only',
        });

        if (data?.motionStakedEvents) {
          const nayStakeEvents = data?.motionStakedEvents
            .map(parseSubgraphEvent)
            .filter((event) => event.values.vote === MotionVote.Nay);

          let parsedEvents: ExtendedLogDescription[] = [];
          await Promise.all(
            nayStakeEvents.map(async ({ hash }) => {
              const { data: annotationData } = await apolloClient.query<
                SubgraphAnnotationEventsQuery,
                SubgraphAnnotationEventsQueryVariables
              >({
                query: SubgraphAnnotationEventsDocument,
                variables: {
                  transactionHash: hash || '',
                },
              });
              if (annotationData?.annotationEvents) {
                parsedEvents = annotationData?.annotationEvents.map(
                  parseSubgraphEvent,
                );
              }
            }),
          );

          if (parsedEvents.length) {
            const [latestAnnotatedNayStake] = parsedEvents;
            objectionAnnotation = {
              address: latestAnnotatedNayStake.values.agent,
              metadata: latestAnnotatedNayStake.values.metadata,
            };
          }
        }
        return objectionAnnotation;
      } catch (error) {
        console.error('Could not nay side stake annotation for current motion');
        console.error(error);
        return null;
      }
    },
    async motionTimeoutPeriods(_, { colonyAddress, motionId }) {
      return getTimeoutPeriods(colonyManager, colonyAddress, motionId);
    },
  },
  Motion: {
    async state({ fundamentalChainId, associatedColony: { colonyAddress } }) {
      const motionId = bigNumberify(fundamentalChainId);
      const votingReputationClient = await colonyManager.getClient(
        ClientType.VotingReputationClient,
        createAddress(colonyAddress),
      );
      const motion = await votingReputationClient.getMotion(motionId);
      const state = await votingReputationClient.getMotionState(motionId);
      return getMotionState(
        state,
        votingReputationClient as ExtensionClient,
        motion,
      );
    },
    async type({
      fundamentalChainId,
      associatedColony: { colonyAddress: address },
    }) {
      const colonyAddress = createAddress(address);
      const votingReputationClient = await colonyManager.getClient(
        ClientType.VotingReputationClient,
        colonyAddress,
      );
      const oneTxPaymentClient = await colonyManager.getClient(
        ClientType.OneTxPaymentClient,
        colonyAddress,
      );
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      return getMotionActionType(
        votingReputationClient as ExtensionClient,
        oneTxPaymentClient as ExtensionClient,
        colonyClient,
        bigNumberify(fundamentalChainId),
      );
    },
    async timeoutPeriods({
      fundamentalChainId: motionId,
      associatedColony: { colonyAddress },
    }) {
      return getTimeoutPeriods(colonyManager, colonyAddress, motionId);
    },
    async args({ action, associatedColony: { colonyAddress } }) {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );

      const actionValues = colonyClient.interface.parseTransaction({
        data: action,
      });

      const tokenAddress = colonyClient.tokenClient.address;
      const {
        symbol,
        decimals,
      } = await colonyClient.tokenClient.getTokenInfo();

      const defaultValues = {
        amount: '0',
        token: {
          id: tokenAddress,
          symbol,
          decimals,
        },
      };

      // PaymentMotion
      if (!actionValues) {
        const oneTxPaymentClient = await colonyManager.getClient(
          ClientType.OneTxPaymentClient,
          colonyAddress,
        );

        const paymentValues = oneTxPaymentClient.interface.parseTransaction({
          data: action,
        });

        if (
          !paymentValues ||
          paymentValues.signature !==
            'makePaymentFundedFromDomain(uint256,uint256,uint256,uint256,address[],address[],uint256[],uint256,uint256)' // eslint-disable-line max-len
        ) {
          return defaultValues;
        }

        const [
          ,
          ,
          ,
          ,
          [recipient],
          [paymentTokenAddress],
          [paymentAmount],
        ] = paymentValues?.args;

        /*
         * If the payment was made with the native chain's token. Eg: Xdai or Eth
         */
        if (paymentTokenAddress === AddressZero) {
          return {
            amount: paymentAmount.toString(),
            recipient,
            token: {
              id: AddressZero,
              symbol: DEFAULT_NETWORK_TOKEN.symbol,
              decimals: DEFAULT_NETWORK_TOKEN.decimals,
            },
          };
        }

        /*
         * Otherwise the payment was made with the native token's address, or an
         * equally similar ERC20 token
         */

        let tokenClient;
        try {
          tokenClient = await colonyManager.getTokenClient(paymentTokenAddress);
        } catch (error) {
          /*
           * If this try/catch block triggers it means that we have a non-standard
           * ERC-20 token, which we can't handle
           * For that, we will just replace the values with the colony's native token
           */
          tokenClient = await colonyManager.getTokenClient(tokenAddress);
        }

        const {
          symbol: paymentTokenSymbol,
          decimals: paymentTokenDecimals,
        } = await tokenClient.getTokenInfo();

        return {
          amount: paymentAmount.toString(),
          recipient,
          token: {
            id: tokenClient.address,
            symbol: paymentTokenSymbol,
            decimals: paymentTokenDecimals,
          },
        };
      }

      if (
        actionValues.signature ===
        'moveFundsBetweenPots(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)' // eslint-disable-line max-len
      ) {
        const fromDomain = await colonyClient.getDomainFromFundingPot(
          actionValues.args[5],
        );
        const toDomain = await colonyClient.getDomainFromFundingPot(
          actionValues.args[6],
        );

        const tokenClient = await colonyManager.getTokenClient(
          actionValues.args[8],
        );
        const tokenInfo = await tokenClient.getTokenInfo();

        return {
          amount: actionValues.args[7].toString(),
          fromDomain: fromDomain.toNumber(),
          toDomain: toDomain.toNumber(),
          token: {
            id: actionValues.args[8],
            symbol: tokenInfo.symbol,
            decimals: tokenInfo.decimals,
          },
        };
      }

      if (actionValues.name === 'addDomain') {
        return {
          ...defaultValues,
          metadata: actionValues.args[3],
        };
      }

      if (
        actionValues.signature === 'editDomain(uint256,uint256,uint256,string)'
      ) {
        return {
          ...defaultValues,
          fromDomain: parseInt(actionValues.args[2].toString(), 10),
        };
      }

      if (actionValues.name === 'editColony') {
        return {
          ...defaultValues,
          metadata: actionValues.args[0],
        };
      }

      if (
        actionValues.signature ===
        'setUserRoles(uint256,uint256,address,uint256,bytes32)'
      ) {
        const roleBitMask = parseInt(
          hexStripZeros(actionValues.args[4]),
          16,
        ).toString(2);
        const roleBitMaskArray = roleBitMask.split('').reverse();

        const roles = availableRoles.map((role) => ({
          id: role,
          setTo: roleBitMaskArray[role] === '1',
        }));

        return {
          ...defaultValues,
          recipient: actionValues.args[2],
          fromDomain: bigNumberify(actionValues.args[3]).toNumber(),
          roles,
        };
      }

      if (
        actionValues.signature ===
        'emitDomainReputationPenalty(uint256,uint256,uint256,address,int256)'
      ) {
        return {
          reputationChange: actionValues?.args[4].toString(),
          recipient: actionValues?.args[3],
        };
      }

      // MintTokenMotion - default
      return {
        amount: bigNumberify(actionValues?.args[0] || '0').toString(),
        token: {
          id: tokenAddress,
          symbol,
          decimals,
        },
      };
    },
  },
});

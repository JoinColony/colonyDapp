import {
  ClientType,
  ExtensionClient,
  ColonyClientV6,
  getLogs,
  getBlockTime,
  MotionState as NetworkMotionState,
  getEvents,
  getMultipleEvents,
} from '@colony/colony-js';
import { bigNumberify, LogDescription } from 'ethers/utils';
import { Resolvers } from '@apollo/client';

import { Context } from '~context/index';
import { createAddress } from '~utils/web3';
import { getMotionActionType, getMotionState } from '~utils/events';
import {
  MotionVote,
  getMotionRequiredStake,
  getEarlierEventTimestamp,
} from '~utils/colonyMotions';
import { ColonyAndExtensionsEvents } from '~types/index';
import {
  UserReputationQuery,
  UserReputationQueryVariables,
  UserReputationDocument,
} from '~data/index';

import {
  ActionsPageFeedType,
  SystemMessage,
  SystemMessagesName,
} from '~dashboard/ActionsPageFeed';

import { ProcessedEvent } from './colonyActions';

const getMotionEvents = async (
  votingReputationClient: ExtensionClient,
  motionId: string,
) => {
  const motionStakedLogs = await getLogs(
    votingReputationClient,
    // @TODO Add missing types to colonyjs
    // @ts-ignore
    votingReputationClient.filters.MotionStaked(motionId, null, null, null),
  );

  const motionVoteRevealedLogs = await getLogs(
    votingReputationClient,
    // @TODO Add missing types to colonyjs
    // @ts-ignore
    votingReputationClient.filters.MotionVoteRevealed(motionId, null, null),
  );

  const motionFinalizedLogs = await getLogs(
    votingReputationClient,
    // @TODO Add missing types to colonyjs
    // @ts-ignore
    votingReputationClient.filters.MotionFinalized(motionId, null, null),
  );

  const motionStakeClaimedLogs = await getLogs(
    votingReputationClient,
    // @TODO Add missing types to colonyjs
    // @ts-ignore
    votingReputationClient.filters.MotionRewardClaimed(motionId, null, null),
  );

  const parsedMotionEvents = await Promise.all(
    [
      ...motionStakedLogs,
      ...motionVoteRevealedLogs,
      ...motionFinalizedLogs,
      ...motionStakeClaimedLogs,
    ].map(async (log) => {
      const parsedLog = votingReputationClient.interface.parseLog(log);
      const { address, blockHash, blockNumber, transactionHash } = log;
      const {
        name,
        values: { amount, ...rest },
      } = parsedLog;
      const stakeAmount =
        name === ColonyAndExtensionsEvents.MotionStaked ? amount : null;

      return {
        type: ActionsPageFeedType.NetworkEvent,
        name,
        values: {
          ...rest,
          stakeAmount,
        },
        createdAt: blockHash
          ? await getBlockTime(votingReputationClient.provider, blockHash)
          : 0,
        emmitedBy: ClientType.VotingReputationClient,
        address,
        blockNumber,
        transactionHash,
      } as ProcessedEvent;
    }),
  );

  const sortedMotionEvents = parsedMotionEvents.sort(
    (firstEvent, secondEvent) => firstEvent.createdAt - secondEvent.createdAt,
  );

  const firstMotionStakedNAYEvent = sortedMotionEvents.find(
    (event) =>
      event.name === ColonyAndExtensionsEvents.MotionStaked &&
      event.values.vote.eq(MotionVote.Nay),
  );

  if (firstMotionStakedNAYEvent) {
    const {
      values,
      address,
      blockNumber,
      transactionHash,
    } = firstMotionStakedNAYEvent;
    sortedMotionEvents.push({
      type: ActionsPageFeedType.NetworkEvent,
      name: ColonyAndExtensionsEvents.ObjectionRaised,
      /*
       * @NOTE: I substract 1 second out of the timestamp
       * to make the event appear before the first NAY stake
       */
      createdAt: getEarlierEventTimestamp(firstMotionStakedNAYEvent.createdAt),
      values,
      emmitedBy: ClientType.VotingReputationClient,
      address,
      blockNumber,
      transactionHash,
    });
  }

  return sortedMotionEvents;
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
        const tokenDecimals = await colonyClient.tokenClient.decimals();
        const {
          skillRep,
          stakes,
          domainId,
          rootHash,
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

        const [totalNAYStakes, totalYAYStaked] = stakes;
        const requiredStake = skillRep
          .mul(totalStakeFraction)
          .div(bigNumberify(10).pow(tokenDecimals))
          /*
           * @NOTE This is over-estimating by 1 to counteract a bug in the contracts
           * To remove after it's fixed
           */
          .add(1);
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
      const { provider } = networkClient;
      const votingReputationClient = (await colonyManager.getClient(
        ClientType.VotingReputationClient,
        colonyAddress,
      )) as ExtensionClient;
      const motion = await votingReputationClient.getMotion(motionId);
      const motionNetworkState = await votingReputationClient.getMotionState(
        motionId,
      );
      const systemMessages: SystemMessage[] = [];

      // @TODO Add missing types to colonyjs
      // @ts-ignore
      const motionStakedFilter = votingReputationClient.filters.MotionStaked(
        motionId,
        null,
        null,
        null,
      );
      const motionStakedLogs = await getLogs(
        votingReputationClient,
        motionStakedFilter,
      );
      // @ts-ignore
      // eslint-disable-next-line max-len
      const motionVoteSubmittedFilter = votingReputationClient.filters.MotionVoteSubmitted(
        motionId,
        null,
      );
      const motionVoteSubmittedLogs = await getLogs(
        votingReputationClient,
        motionVoteSubmittedFilter,
      );
      // @ts-ignore
      // eslint-disable-next-line max-len
      const motionVoteRevealedFilter = votingReputationClient.filters.MotionVoteRevealed(
        motionId,
        null,
        null,
      );
      const motionVoteRevealedLogs = await getLogs(
        votingReputationClient,
        motionVoteRevealedFilter,
      );

      const parsedEvents = await Promise.all(
        [
          ...motionStakedLogs,
          ...motionVoteRevealedLogs,
          ...motionVoteSubmittedLogs,
        ].map(async (log) => {
          const parsedLog = votingReputationClient.interface.parseLog(log);
          const { address, blockHash, blockNumber, transactionHash } = log;
          const { name, values } = parsedLog;
          return {
            type: ActionsPageFeedType.NetworkEvent,
            name,
            values,
            createdAt: blockHash ? await getBlockTime(provider, blockHash) : 0,
            emmitedBy: ClientType.ColonyClient,
            address,
            blockNumber,
            transactionHash,
          } as ProcessedEvent;
        }),
      );

      const sortedEvents = parsedEvents.sort(
        (firstEvent, secondEvent) =>
          secondEvent.createdAt - firstEvent.createdAt,
      );
      const blocktime = await getBlockTime(networkClient.provider, 'latest');

      const timeToSubmitMS = motion.events[1].toNumber() * 1000;
      const timeToSubmitInPast = timeToSubmitMS < blocktime;
      const newestVoteSubmittedEvent = sortedEvents.find(
        (event) => event.name === ColonyAndExtensionsEvents.MotionVoteSubmitted,
      );

      const latestMotionStakedYAYEvent = sortedEvents.find(
        (event) =>
          event.name === ColonyAndExtensionsEvents.MotionStaked &&
          event.values.vote.eq(MotionVote.Yay),
      );

      if (latestMotionStakedYAYEvent) {
        // eslint-disable-next-line max-len
        const totalStakeFraction = await votingReputationClient.getTotalStakeFraction();
        const requiredStake = getMotionRequiredStake(
          motion.skillRep,
          totalStakeFraction,
          18,
        );

        if (motion.stakes[MotionVote.Yay].gte(requiredStake)) {
          systemMessages.push({
            type: ActionsPageFeedType.SystemMessage,
            name: SystemMessagesName.MotionFullyStaked,
            createdAt: latestMotionStakedYAYEvent.createdAt,
          });
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
        const { domainId } = await votingReputationClient.getMotion(motionId);

        const { data } = await apolloClient.query<
          UserReputationQuery,
          UserReputationQueryVariables
        >({
          query: UserReputationDocument,
          variables: {
            colonyAddress,
            address: userAddress,
            domainId: domainId.toNumber(),
          },
        });
        if (data?.userReputation) {
          const reward = await votingReputationClient.getVoterReward(
            bigNumberify(motionId),
            bigNumberify(data.userReputation),
          );
          return reward.toString();
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
        const votingReputationClient = (await colonyManager.getClient(
          ClientType.VotingReputationClient,
          colonyAddress,
        )) as ExtensionClient;

        return await getMotionEvents(votingReputationClient, motionId);
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async motionCurrentUserVoted(_, { motionId, colonyAddress, userAddress }) {
      try {
        const votingReputationClient = await colonyManager.getClient(
          ClientType.VotingReputationClient,
          colonyAddress,
        );
        // @ts-ignore
        // eslint-disable-next-line max-len
        const motionVoteFilter = votingReputationClient.filters.MotionVoteSubmitted(
          bigNumberify(motionId),
          userAddress,
        );
        const voteSubmittedEvents = await getEvents(
          votingReputationClient,
          motionVoteFilter,
        );
        return !!voteSubmittedEvents.length;
      } catch (error) {
        console.error('Could not fetch current user vote status');
        console.error(error);
        return null;
      }
    },
    async motionUserVoteRevealed(_, { motionId, colonyAddress, userAddress }) {
      try {
        let userVote = {
          revealed: false,
          vote: null,
        };
        const votingReputationClient = await colonyManager.getClient(
          ClientType.VotingReputationClient,
          colonyAddress,
        );
        // @ts-ignore
        // eslint-disable-next-line max-len
        const motionVoteRevealedFilter = votingReputationClient.filters.MotionVoteRevealed(
          bigNumberify(motionId),
          userAddress,
          null,
        );
        const [userReveal] = await getEvents(
          votingReputationClient,
          motionVoteRevealedFilter,
        );
        if (userReveal) {
          userVote = {
            revealed: true,
            vote: userReveal.values.vote.toNumber(),
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

        // @ts-ignore
        // eslint-disable-next-line max-len
        const motionVoteRevealedFilter = votingReputationClient.filters.MotionVoteRevealed(
          bigNumberify(motionId),
          null,
          null,
        );
        const revealEvents = await getEvents(
          votingReputationClient,
          motionVoteRevealedFilter,
        );
        revealEvents?.map(({ values: { vote, voter } }) => {
          const currentUserVoted =
            createAddress(voter) === createAddress(userAddress);
          /*
           * @NOTE We're using this little hack in order to ensure, that if
           * the currently logged in user was one of the voters, that
           * their avatar is going to show up first in the vote results
           */
          const arrayMethod = currentUserVoted ? 'unshift' : 'push';
          if (currentUserVoted) {
            voteResult.currentUserVoteSide = vote.toNumber();
          }
          if (vote.toNumber() === MotionVote.Yay) {
            voteResult.yayVoters[arrayMethod](createAddress(voter));
          }
          /*
           * @NOTE We expressly declare NAY rather then using "else" to prevent
           * any other *unexpected* values coming from the chain messing up our
           * data (eg if vote was 2 due to weird issues)
           */
          if (vote.toNumber() === MotionVote.Nay) {
            voteResult.nayVoters[arrayMethod](createAddress(voter));
          }
        });
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

        const threasholdValue = getMotionRequiredStake(
          skillRep,
          maxVoteFraction,
          18,
        );

        return {
          threasholdValue: threasholdValue.toString(),
          totalVotedReputation: repSubmitted.toString(),
          skillRep: skillRep.toString(),
        };
      } catch (error) {
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
        const votingReputationClient = await colonyManager.getClient(
          ClientType.VotingReputationClient,
          colonyAddress,
        );
        const motionStakedFilter = votingReputationClient.filters.MotionStaked(
          bigNumberify(motionId),
          userAddress.toLowerCase(),
          null,
        );
        // eslint-disable-next-line max-len
        const stakeClaimedFilter = votingReputationClient.filters.MotionRewardClaimed(
          bigNumberify(motionId),
          userAddress.toLowerCase(),
          null,
          null,
        );
        const events = await getMultipleEvents(votingReputationClient, [
          motionStakedFilter,
          stakeClaimedFilter,
        ]);
        const userStakeEvents = events.filter(
          ({ name }) => name === ColonyAndExtensionsEvents.MotionStaked,
        );
        const rewardClaimedEvents = events.filter(
          ({ name }) => name === ColonyAndExtensionsEvents.MotionRewardClaimed,
        );
        let stakesYay = bigNumberify(0);
        let stakesNay = bigNumberify(0);
        userStakeEvents.map(({ values: { amount, vote } }) => {
          if (vote.toNumber() === 1) {
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
        rewardClaimedEvents.map(({ values: { amount, vote } }) => {
          if (vote.toNumber() === 1) {
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
          claimedReward: !!rewardClaimedEvents.length,
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
        const colonyClient = await colonyManager.getClient(
          ClientType.ColonyClient,
          colonyAddress,
        );
        const votingReputationClient = await colonyManager.getClient(
          ClientType.VotingReputationClient,
          colonyAddress,
        );
        const nayStakedFilter = votingReputationClient.filters.MotionStaked(
          bigNumberify(motionId),
          null,
          bigNumberify(0),
          null,
        );
        const nayStakeEvents = await getLogs(
          votingReputationClient,
          nayStakedFilter,
        );

        let annotationEvents: LogDescription[] = [];
        await Promise.all(
          nayStakeEvents.map(async ({ transactionHash }) => {
            const events = await getEvents(
              colonyClient,
              colonyClient.filters.Annotation(null, transactionHash, null),
            );
            annotationEvents = [...annotationEvents, ...events];
          }),
        );

        if (annotationEvents.length) {
          const [latestAnnotatedNayStake] = annotationEvents;
          objectionAnnotation = {
            address: latestAnnotatedNayStake.values.agent,
            metadata: latestAnnotatedNayStake.values.metadata,
          };
        }
        return objectionAnnotation;
      } catch (error) {
        console.error('Could not nay side stake annotation for current motion');
        console.error(error);
        return null;
      }
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
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      return getMotionActionType(
        votingReputationClient as ExtensionClient,
        colonyClient,
        bigNumberify(fundamentalChainId),
      );
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
      /*
       * @TODO Return argumnents for the other motions as well, as soon
       * as they get wired into the dapp
       */
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

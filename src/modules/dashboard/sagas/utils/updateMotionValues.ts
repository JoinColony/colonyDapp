import { BigNumber } from 'ethers/utils';
import { ClientType } from '@colony/colony-js';

import { TEMP_getContext, ContextModule } from '~context/index';
import { Address } from '~types/index';
import {
  MotionStakesQuery,
  MotionStakesQueryVariables,
  MotionStakesDocument,
  EventsForMotionQuery,
  EventsForMotionQueryVariables,
  EventsForMotionDocument,
  MotionsSystemMessagesQuery,
  MotionsSystemMessagesQueryVariables,
  MotionsSystemMessagesDocument,
  MotionStatusQuery,
  MotionStatusQueryVariables,
  MotionStatusDocument,
  MotionUserVoteRevealedQuery,
  MotionUserVoteRevealedQueryVariables,
  MotionUserVoteRevealedDocument,
  MotionCurrentUserVotedQuery,
  MotionCurrentUserVotedQueryVariables,
  MotionCurrentUserVotedDocument,
  StakeAmountsForMotionQuery,
  StakeAmountsForMotionQueryVariables,
  StakeAmountsForMotionDocument,
  MotionFinalizedQuery,
  MotionFinalizedQueryVariables,
  MotionFinalizedDocument,
  MotionStakerRewardQuery,
  MotionStakerRewardQueryVariables,
  MotionStakerRewardDocument,
  UserBalanceWithLockQuery,
  UserBalanceWithLockQueryVariables,
  UserBalanceWithLockDocument,
  VotingStateQuery,
  VotingStateQueryVariables,
  VotingStateDocument,
  MotionObjectionAnnotationQuery,
  MotionObjectionAnnotationQueryVariables,
  MotionObjectionAnnotationDocument,
  MotionTimeoutPeriodsQuery,
  MotionTimeoutPeriodsQueryVariables,
  MotionTimeoutPeriodsDocument,
} from '~data/index';

export function* updateMotionValues(
  colonyAddress: Address,
  userAddress: Address,
  motionId: BigNumber,
) {
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
  const context = TEMP_getContext(ContextModule.ColonyManager);
  const colonyClient = yield context.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );
  const tokenAddress = colonyClient.tokenClient.address;
  /*
   * Staking values
   */
  yield apolloClient.query<MotionStakesQuery, MotionStakesQueryVariables>({
    query: MotionStakesDocument,
    variables: {
      colonyAddress,
      userAddress,
      motionId: motionId.toNumber(),
    },
    fetchPolicy: 'network-only',
  });

  /*
   * Objection stake annotation
   */
  yield apolloClient.query<
    MotionObjectionAnnotationQuery,
    MotionObjectionAnnotationQueryVariables
  >({
    query: MotionObjectionAnnotationDocument,
    variables: {
      colonyAddress,
      motionId: motionId.toNumber(),
    },
    fetchPolicy: 'network-only',
  });

  /*
   * Vote Revelead
   */
  yield apolloClient.query<
    MotionUserVoteRevealedQuery,
    MotionUserVoteRevealedQueryVariables
  >({
    query: MotionUserVoteRevealedDocument,
    variables: {
      colonyAddress,
      userAddress,
      motionId: motionId.toNumber(),
    },
    fetchPolicy: 'network-only',
  });

  /*
   * User voted check
   */
  yield apolloClient.query<
    MotionCurrentUserVotedQuery,
    MotionCurrentUserVotedQueryVariables
  >({
    query: MotionCurrentUserVotedDocument,
    variables: {
      colonyAddress,
      userAddress,
      motionId: motionId.toNumber(),
    },
    fetchPolicy: 'network-only',
  });

  /*
   * Total stake widget values
   */
  yield apolloClient.query<
    StakeAmountsForMotionQuery,
    StakeAmountsForMotionQueryVariables
  >({
    query: StakeAmountsForMotionDocument,
    variables: {
      colonyAddress,
      userAddress,
      motionId: motionId.toNumber(),
    },
    fetchPolicy: 'network-only',
  });

  /*
   * Is motion finalized check
   */
  yield apolloClient.query<MotionFinalizedQuery, MotionFinalizedQueryVariables>(
    {
      query: MotionFinalizedDocument,
      variables: {
        colonyAddress,
        motionId: motionId.toNumber(),
      },
      fetchPolicy: 'network-only',
    },
  );

  /*
   * Refresh rewards values and if the user claimed them
   */
  yield apolloClient.query<
    MotionStakerRewardQuery,
    MotionStakerRewardQueryVariables
  >({
    query: MotionStakerRewardDocument,
    variables: {
      colonyAddress,
      userAddress,
      motionId: motionId.toNumber(),
    },
    fetchPolicy: 'network-only',
  });

  /*
   * Motion Events
   */
  yield apolloClient.query<EventsForMotionQuery, EventsForMotionQueryVariables>(
    {
      query: EventsForMotionDocument,
      variables: {
        colonyAddress,
        motionId: motionId.toNumber(),
      },
      fetchPolicy: 'network-only',
    },
  );

  /*
   * Motion System Messages
   */
  yield apolloClient.query<
    MotionsSystemMessagesQuery,
    MotionsSystemMessagesQueryVariables
  >({
    query: MotionsSystemMessagesDocument,
    variables: {
      colonyAddress,
      motionId: motionId.toNumber(),
    },
    fetchPolicy: 'network-only',
  });

  /*
   * Colony Actions (to get the refreshed motion state)
   *
   * @NOTE It might make sense in the long run to just create a separate
   * resolver just for the motion's state. It will cut down on fetching
   * data we don't need just to show the updated state
   */
  yield apolloClient.query<MotionStatusQuery, MotionStatusQueryVariables>({
    query: MotionStatusDocument,
    variables: {
      colonyAddress,
      motionId: motionId.toNumber(),
    },
    fetchPolicy: 'network-only',
  });

  /*
   * Refresh wallet balance
   */
  yield apolloClient.query<
    UserBalanceWithLockQuery,
    UserBalanceWithLockQueryVariables
  >({
    query: UserBalanceWithLockDocument,
    variables: {
      address: userAddress,
      tokenAddress,
      colonyAddress,
    },
    fetchPolicy: 'network-only',
  });

  /*
   * Voting state
   */
  yield apolloClient.query<VotingStateQuery, VotingStateQueryVariables>({
    query: VotingStateDocument,
    variables: {
      colonyAddress,
      motionId: motionId.toNumber(),
    },
    fetchPolicy: 'network-only',
  });

  /*
   * Timeout periods
   */
  yield apolloClient.query<
    MotionTimeoutPeriodsQuery,
    MotionTimeoutPeriodsQueryVariables
  >({
    query: MotionTimeoutPeriodsDocument,
    variables: {
      motionId: motionId.toNumber(),
      colonyAddress,
    },
    fetchPolicy: 'network-only',
  });
}

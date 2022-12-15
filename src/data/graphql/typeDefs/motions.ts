import gql from 'graphql-tag';

export default gql`
  type MotionStakes {
    totalNAYStakes: String!
    remainingToFullyYayStaked: String!
    remainingToFullyNayStaked: String!
    maxUserStake: String!
    minUserStake: String!
  }

  type MotionVoterReward {
    reward: String!
    minReward: String!
    maxReward: String!
  }

  type MotionVoteReveal {
    revealed: Boolean!
    vote: Int!
  }

  type MotionVoteResults {
    currentUserVoteSide: Int!
    yayVotes: String!
    yayVoters: [String!]!
    nayVotes: String!
    nayVoters: [String!]!
  }

  type MotionStakerRewards {
    stakingRewardYay: String!
    stakingRewardNay: String!
    stakesYay: String!
    stakesNay: String!
    claimedReward: Boolean!
  }

  type StakeSidesAmounts {
    YAY: String!
    NAY: String!
  }

  type StakeAmounts {
    totalStaked: StakeSidesAmounts!
    userStake: StakeSidesAmounts!
    requiredStake: String!
  }

  type ParsedMotionStakedEventValues {
    amount: String!
    motionId: String!
    stakeAmount: String!
    staker: String!
    vote: Int!
  }

  type ParsedMotionStakedEvent {
    address: String!
    blockNumber: Int!
    hash: String!
    index: String!
    name: String!
    signature: String!
    timestamp: Int!
    topic: String!
    values: ParsedMotionStakedEventValues!
  }

  type ClaimableMotions {
    unclaimedMotionStakeEvents: [ParsedMotionStakedEvent!]!
  }

  type MotionObjectionAnnotation {
    address: String!
    metadata: String!
  }

  type VotingState {
    thresholdValue: String!
    totalVotedReputation: String!
    skillRep: String!
  }

  type MotionTimeoutPeriods {
    timeLeftToStake: Int!
    timeLeftToSubmit: Int!
    timeLeftToReveal: Int!
    timeLeftToEscalate: Int!
  }

  type TxHash {
    txHash: String!
  }

  type MotionTxHashMap {
    key: Int!
    value: TxHash!
  }

  extend type Query {
    eventsForMotion(motionId: Int!, colonyAddress: String!): [ParsedEvent!]!
    motionStakes(
      colonyAddress: String!
      userAddress: String!
      motionId: Int!
    ): MotionStakes!
    motionsSystemMessages(
      motionId: Int!
      colonyAddress: String!
    ): [SystemMessage!]!
    motionVoterReward(
      motionId: Int!
      colonyAddress: String!
      userAddress: String!
    ): MotionVoterReward!
    motionUserVoteRevealed(
      motionId: Int!
      colonyAddress: String!
      userAddress: String!
    ): MotionVoteReveal!
    motionVoteResults(
      motionId: Int!
      colonyAddress: String!
      userAddress: String!
    ): MotionVoteResults!
    votingState(colonyAddress: String!, motionId: Int!): VotingState!
    motionCurrentUserVoted(
      motionId: Int!
      colonyAddress: String!
      userAddress: String!
    ): Boolean!
    motionFinalized(motionId: Int!, colonyAddress: String!): Boolean!
    motionStakerReward(
      motionId: Int!
      colonyAddress: String!
      userAddress: String!
    ): MotionStakerRewards!
    stakeAmountsForMotion(
      colonyAddress: String!
      userAddress: String!
      motionId: Int!
    ): StakeAmounts!
    claimableStakedMotions(
      colonyAddress: String!
      walletAddress: String!
    ): ClaimableMotions!
    motionObjectionAnnotation(
      motionId: Int!
      colonyAddress: String!
    ): MotionObjectionAnnotation!
    motionStatus(motionId: Int!, colonyAddress: String!): String!
    motionTimeoutPeriods(
      motionId: Int!
      colonyAddress: String!
    ): MotionTimeoutPeriods!
    motionsTxHashes(
      motionIds: [String!]!
      colonyAddress: String!
    ): MotionTxHashMap!
    motionSafeTransactionStatuses(
      motionId: Int!
      colonyAddress: String!
      safeChainId: String!
    ): [String!]!
  }
`;

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

  type ClaimableMotions {
    motionIds: [Int!]!
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
    claimableStakedMotions(motionIds: [Int!]!): ClaimableMotions!
    motionObjectionAnnotation(
      motionId: Int!
      colonyAddress: String!
    ): MotionObjectionAnnotation!
    motionStatus(motionId: Int!, colonyAddress: String!): String!
    motionTimeoutPeriods(
      motionId: Int!
      colonyAddress: String!
    ): MotionTimeoutPeriods!
  }
`;

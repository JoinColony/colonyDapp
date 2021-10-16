import gql from 'graphql-tag';

export default gql`
  input ActionsFilter {
    payment_contains: String
  }

  input MotionsFilter {
    associatedColony: String
    extensionAddress: String
  }

  type OneTxPayment {
    id: String!
    agent: String!
    transaction: SubgraphTransaction!
    payment: SubgraphPayment!
  }

  type SubscriptionMotion {
    id: String!
    fundamentalChainId: String!
    transaction: SubgraphTransaction!
    associatedColony: SubgraphColony!
    domain: SubgraphDomain!
    extensionAddress: String!
    agent: String!
    stakes: [String!]!
    requiredStake: String!
    escalated: Boolean!
    state: String!
    action: String!
    type: String!
    args: SubscriptionMotionArguments!
    timeoutPeriods: MotionTimeoutPeriods!
  }

  type MotionTimeoutPeriods {
    timeLeftToStake: Int!
    timeLeftToSubmit: Int!
    timeLeftToReveal: Int!
    timeLeftToEscalate: Int!
  }

  # @TODO Add types for the rest of the arguments
  #
  type SubscriptionMotionArguments {
    amount: String!
    token: SubgraphToken!
  }

  #
  # Subgraph Subscriptions
  #
  extend type Subscription {
    oneTxPayments(
      skip: Int!
      first: Int!
      where: ActionsFilter!
    ): [OneTxPayment!]!
    events(skip: Int, first: Int, where: EventsFilter): [SubgraphEvent!]!
    motions(
      skip: Int!
      first: Int!
      where: MotionsFilter!
    ): [SubscriptionMotion!]!
  }
`;

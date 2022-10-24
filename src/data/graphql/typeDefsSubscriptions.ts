import gql from 'graphql-tag';

export default gql`
  input ActionsFilter {
    payment_contains: String
  }

  input MotionsFilter {
    associatedColony: String
    extensionAddress: String
    action_not: String
  }

  type OneTxPayment {
    id: String!
    agent: String!
    transaction: SubgraphTransaction!
    payment: SubgraphPayment!
    timestamp: String!
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
    annotationHash: String!
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
      skip: Int
      first: Int
      orderBy: String
      orderDirection: String
      where: ActionsFilter!
    ): [OneTxPayment!]!
    events(
      skip: Int
      first: Int
      orderBy: String
      orderDirection: String
      where: EventsFilter
    ): [SubgraphEvent!]!
    motions(
      skip: Int
      first: Int
      orderBy: String
      orderDirection: String
      where: MotionsFilter!
    ): [SubscriptionMotion!]!
    tokenBoughtEvents(where: EventsFilter): [SubgraphEvent!]!
  }
`;

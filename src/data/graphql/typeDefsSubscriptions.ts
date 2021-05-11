import gql from 'graphql-tag';

export default gql`
  input ActionsFilter {
    payment_contains: String
  }

  input EventsFilter {
    associatedColony_contains: String
    associatedColony: String
    name_in: [String!]
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

  type EventProcessedValues {
    agent: String!
    who: String!
    fromPot: String!
    fromDomain: String!
    toPot: String!
    toDomain: String!
    domainId: String!
    amount: String!
    token: String!
    metadata: String!
    user: String!
    role: String!
    setTo: String!
    oldVersion: String!
    newVersion: String!
    storageSlot: String!
    storageSlotValue: String!
  }

  type SubscriptionEvent {
    id: String!
    transaction: SubgraphTransaction!
    address: String!
    name: String!
    args: String!
    associatedColony: SubgraphColony!
    processedValues: EventProcessedValues!
  }

  type SubscriptionMotion {
    id: String!
    fundamentalChainId: String!
    transaction: SubgraphTransaction!
    associatedColony: SubgraphColony!
    domain: SubgraphDomain!
    extensionAddress: String!
    agent: String!
    stakes: [String!]
    requiredStake: String!
    escalated: Boolean!
    state: String!
    action: String!
    type: String!
    args: SubscriptionMotionArguments!
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
    events(skip: Int!, first: Int!, where: EventsFilter!): [SubscriptionEvent!]!
    motions(
      skip: Int!
      first: Int!
      where: MotionsFilter!
    ): [SubscriptionMotion!]!
  }
`;

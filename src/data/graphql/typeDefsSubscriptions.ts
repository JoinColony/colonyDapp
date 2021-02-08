import gql from 'graphql-tag';

export default gql`
  #
  # Subgraph Subscriptions
  #

  extend type Subscription {
    oneTxPayments(
      skip: Int!
      first: Int!
      where: ActionsFilter!
    ): [OneTxPayment!]!
    events(skip: Int!, first: Int!, where: EventsFilter!): [SubgraphEvent!]!
  }
`;

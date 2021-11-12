import gql from 'graphql-tag';

export default gql`
  type SubgraphBlock {
    id: String!
    timestamp: String!
  }

  type SubgraphTransaction {
    id: String!
    block: SubgraphBlock!
  }

  extend type Query {
    events(
      skip: Int
      first: Int
      where: EventsFilter
      orderDirection: String
      block: ToBlockInput
    ): [SubgraphEvent!]!
    block(id: String!): SubgraphBlock
  }
`;

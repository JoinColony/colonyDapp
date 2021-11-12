import gql from 'graphql-tag';

export default gql`
  input SubgraphMetaBlock {
    number: Int!
  }

  type SubgraphUnusedDomain {
    id: String!
  }

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
    domain(id: Int!, block: SubgraphMetaBlock): SubgraphUnusedDomain!
  }
`;

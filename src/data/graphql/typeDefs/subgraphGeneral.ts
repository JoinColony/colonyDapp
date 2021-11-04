import gql from 'graphql-tag';

export default gql`
  extend type Query {
    events(
      skip: Int
      first: Int
      where: EventsFilter
      orderDirection: String
      block: ToBlockInput
    ): [SubgraphEvent!]!
  }
`;

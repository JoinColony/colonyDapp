import gql from 'graphql-tag';

export default gql`
  extend type Query {
    latestRpcBlock: String!
    isServerAlive: Boolean!
    justLatestSubgraphBlock: Int!
    isReputationOracleAlive: Boolean!
  }
`;

import gql from 'graphql-tag';

export default gql`
  extend type Query {
    latestRpcBlock: Int!
    isServerAlive: Boolean!
    latestSubgraphBlock: Int!
    isReputationOracleAlive: Boolean!
    isIPFSAlive: Boolean!
  }
`;

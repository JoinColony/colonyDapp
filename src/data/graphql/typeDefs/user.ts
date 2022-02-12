import gql from 'graphql-tag';

export default gql`
  type ContractUserProfile {
    username: String
    walletAddress: String!
  }

  type ContractUser {
    id: String!
    profile: ContractUserProfile!
  }

  extend type Query {
    userBalance(address: String!): String!
    contractUser(address: String!): ContractUser!
    contractUserByName(username: String!): ContractUser!
  }
`;

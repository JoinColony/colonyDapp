import gql from 'graphql-tag';

export default gql`
  type LoggedInUser {
    id: String!
    balance: String!
    username: String
    walletAddress: String!
  }

  input LoggedInUserInput {
    balance: String
    username: String
    walletAddress: String
  }

  extend type Query {
    loggedInUser: LoggedInUser!
    colonyAddress(name: String!): String!
    colonyName(address: String!): String!
  }

  extend type Mutation {
    setLoggedInUser(input: LoggedInUserInput): LoggedInUser!
  }

  extend type Colony {
    canMintNativeToken(address: String!): Boolean!
    canUnlockNativeToken(address: String!): Boolean!
    isInRecoveryMode(address: String!): Boolean!
    isNativeTokenLocked(address: String!): Boolean!
    version(address: String!): Int!
  }

  type DomainBalance {
    id: Int!
    domainId: Int!
    amount: String!
  }

  extend type Token {
    balance(walletAddress: String!): String!
    balances(colonyAddress: String!, domainIds: [Int!]): [DomainBalance!]!
    details: TokenInfo!
  }

  extend type TokenInfo {
    verified: Boolean
  }
`;

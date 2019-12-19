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

  extend type Token {
    balance(walletAddress: String!): String!
    details: TokenInfo!
  }

  extend type TokenInfo {
    verified: Boolean
  }

  type DomainBalance {
    id: Int!
    domainId: Int!
    balance: String!
  }

  extend type ColonyToken {
    balances(
      colonyAddress: String!
      domainIds: [Int!] = [0, 1]
    ): [DomainBalance!]!
    details: TokenInfo!
  }
`;

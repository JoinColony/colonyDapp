import gql from 'graphql-tag';

export default gql`
  input LoggedInUserInput {
    balance: String
    username: String
    walletAddress: String
  }

  type LoggedInUser {
    id: String!
    balance: String!
    username: String
    walletAddress: String!
  }

  type DomainBalance {
    id: Int!
    domainId: Int!
    amount: String!
  }

  type Token {
    id: String! # token address
    address: String!
    decimals: Int!
    name: String!
    symbol: String!
    iconHash: String
    verified: Boolean!
    balance(walletAddress: String!): String!
    balances(colonyAddress: String!, domainIds: [Int!]): [DomainBalance!]!
  }

  type TaskFinalizedPayment {
    amount: String!
    tokenAddress: String!
    workerAddress: String!
    transactionHash: String!
  }

  extend type Colony {
    canMintNativeToken(address: String!): Boolean!
    canUnlockNativeToken(address: String!): Boolean!
    isInRecoveryMode(address: String!): Boolean!
    isNativeTokenLocked(address: String!): Boolean!
    nativeToken: Token!
    tokens(addresses: [String!]): [Token!]!
    version(address: String!): Int!
  }

  extend type TaskPayout {
    token: Token!
  }

  extend type Task {
    finalizedPayment: TaskFinalizedPayment
  }

  extend type User {
    tokens: [Token!]!
  }

  extend type Query {
    loggedInUser: LoggedInUser!
    colonyAddress(name: String!): String!
    colonyName(address: String!): String!
    token(address: String!): Token!
    userAddress(name: String!): String!
    username(address: String!): String!
  }

  extend type Mutation {
    setLoggedInUser(input: LoggedInUserInput): LoggedInUser!
    clearLoggedInUser: LoggedInUser!
  }
`;

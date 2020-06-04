import gql from 'graphql-tag';

export default gql`
  input LoggedInUserInput {
    balance: String
    username: String
    walletAddress: String
    ethereal: Boolean
  }

  type LoggedInUser {
    id: String!
    balance: String!
    username: String
    walletAddress: String!
    ethereal: Boolean!
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

  type DomainRoles {
    domainId: Int!
    roles: [Int!]!
  }

  type UserRoles {
    address: String!
    domains: [DomainRoles!]!
  }

  type Transaction {
    amount: String!
    colonyAddress: String!
    date: Int!
    from: String
    hash: String!
    incoming: Boolean!
    taskId: Int
    to: String
    token: String!
  }

  extend type Colony {
    canMintNativeToken: Boolean!
    canUnlockNativeToken: Boolean!
    isInRecoveryMode: Boolean!
    isNativeTokenLocked: Boolean!
    nativeToken: Token!
    roles: [UserRoles!]!
    tokens(addresses: [String!]): [Token!]!
    transactions: [Transaction!]!
    unclaimedTransfers: [Transaction!]!
    version: Int!
  }

  extend type TaskPayout {
    token: Token!
  }

  extend type Task {
    commentCount: Int!
    finalizedPayment: TaskFinalizedPayment
  }

  extend type User {
    reputation(colonyAddress: String!, domainId: Int): String!
    tokens: [Token!]!
    tokenTransfers: [Transaction!]!
  }

  extend type Query {
    loggedInUser: LoggedInUser!
    colonyAddress(name: String!): String!
    colonyName(address: String!): String!
    token(address: String!): Token!
    tokens(addresses: [String!]): [Token!]!
    userAddress(name: String!): String!
    userReputation(
      address: String!
      colonyAddress: String!
      domainId: Int
    ): String!
    username(address: String!): String!
  }

  extend type Mutation {
    setLoggedInUser(input: LoggedInUserInput): LoggedInUser!
    clearLoggedInUser: LoggedInUser!
  }
`;

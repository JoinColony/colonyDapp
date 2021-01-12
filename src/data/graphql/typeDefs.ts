import gql from 'graphql-tag';

export default gql`
  input LoggedInUserInput {
    balance: String
    username: String
    walletAddress: String
    ethereal: Boolean
    networkId: Int
  }

  type LoggedInUser {
    id: String!
    balance: String!
    username: String
    walletAddress: String!
    ethereal: Boolean!
    networkId: Int
  }

  type ParsedEvent {
    name: String!
    values: String!
    createdAt: Int!
    emmitedBy: String!
  }

  type ColonyAction {
    hash: String!
    actionInitiator: String!
    fromDomain: Int!
    toDomain: Int!
    recipient: String!
    status: Int!
    events: [ParsedEvent!]!
    createdAt: Int!
    actionType: String!
    amount: String!
    tokenAddress: String!
    annotationHash: String!
  }

  input NetworkContractsInput {
    version: String
    feeInverse: String
  }

  type NetworkContracts {
    version: String
    feeInverse: String
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

  type Transfer {
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

  type NetworkEvent {
    toAddress: String
    fromAddress: String
    createdAt: Int!
    hash: String!
    name: String!
    topic: String
    userAddress: String
    domainId: String
  }

  extend type Colony {
    canMintNativeToken: Boolean!
    canUnlockNativeToken: Boolean!
    isInRecoveryMode: Boolean!
    isNativeTokenLocked: Boolean!
    nativeToken: Token!
    roles: [UserRoles!]!
    tokens(addresses: [String!]): [Token!]!
    transfers: [Transfer!]!
    events: [NetworkEvent!]!
    unclaimedTransfers: [Transfer!]!
    version: Int!
  }

  extend type Domain {
    # TODO guarantee color (resolver will always return a color)
    color: Int
    description: String
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
    tokenTransfers: [Transfer!]!
  }

  extend type Query {
    loggedInUser: LoggedInUser!
    colonyAddress(name: String!): String!
    colonyName(address: String!): String!
    colonyMembersWithReputation(
      colonyAddress: String!
      domainId: Int
    ): [String!]
    token(address: String!): Token!
    tokens(addresses: [String!]): [Token!]!
    userAddress(name: String!): String!
    userReputation(
      address: String!
      colonyAddress: String!
      domainId: Int
    ): String!
    username(address: String!): String!
    networkContracts: NetworkContracts!
    colonyAction(
      transactionHash: String!
      colonyAddress: String!
    ): ColonyAction!
  }

  extend type Mutation {
    setLoggedInUser(input: LoggedInUserInput): LoggedInUser!
    clearLoggedInUser: LoggedInUser!
    setNetworkContracts(input: NetworkContractsInput): NetworkContracts!
    updateNetworkContracts: NetworkContracts!
  }

  # The Graph
  #
  #

  input ActionsFilter {
    payment_contains: String
  }

  input EventsFilter {
    associatedColony_contains: String
    name_in: [String!]
  }

  type SubgraphBlock {
    id: String!
    timestamp: String!
  }

  type SubgraphTransaction {
    id: String!
    block: SubgraphBlock!
  }

  type SubgraphToken {
    id: String!
    symbol: String!
    decimals: String!
  }

  type SubgraphDomain {
    domainChainId: String!
    name: String!
  }

  type SubgraphFundingPotPayout {
    id: String!
    amount: String!
    token: SubgraphToken!
  }

  type SubgraphFundingPot {
    id: String!
    fundingPotPayouts: [SubgraphFundingPotPayout!]!
  }

  type SubgraphPayment {
    to: String!
    domain: SubgraphDomain!
    fundingPot: SubgraphFundingPot!
  }

  type SubgraphColony {
    id: String!
    token: SubgraphToken!
    metadata: String!
    domains: [SubgraphDomain!]!
  }

  type SubgraphEvent {
    id: String!
    transaction: SubgraphTransaction!
    address: String!
    name: String!
    args: String!
    associatedColony: SubgraphColony!
  }

  type OneTxPayment {
    id: String!
    agent: String!
    transaction: SubgraphTransaction!
    payment: SubgraphPayment!
  }

  extend type Query {
    oneTxPayments(where: ActionsFilter!): [OneTxPayment!]!
    events(where: EventsFilter!): [SubgraphEvent!]!
  }
`;

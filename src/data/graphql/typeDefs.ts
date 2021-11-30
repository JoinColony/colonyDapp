import gql from 'graphql-tag';

/*
 * Split type defs into own /typedefs/*.ts file based on purpouse
 */

export default gql`
  input LoggedInUserInput {
    balance: String
    username: String
    walletAddress: String
    ethereal: Boolean
    networkId: Int
  }

  input ToBlockInput {
    number: Int
  }

  input EventsFilter {
    associatedColony_contains: String
    associatedColony: String
    name_in: [String!]
    name_contains: String
    args_contains: String
    address: String
  }

  type LoggedInUser {
    id: String!
    balance: String!
    username: String
    walletAddress: String!
    ethereal: Boolean!
    networkId: Int
  }

  type SugraphEventProcessedValues {
    agent: String!
    who: String!
    fromPot: String!
    fromDomain: String!
    toPot: String!
    toDomain: String!
    domainId: String!
    amount: String!
    token: String!
    metadata: String!
    user: String!
    role: String!
    setTo: String!
    oldVersion: String!
    newVersion: String!
    storageSlot: String!
    storageSlotValue: String!
  }

  type SubgraphEvent {
    id: String!
    transaction: SubgraphTransaction!
    address: String!
    name: String!
    args: String!
    timestamp: String!
    associatedColony: SubgraphColony!
    processedValues: SugraphEventProcessedValues!
  }

  type ParsedEvent {
    type: String!
    name: String!
    values: String!
    createdAt: Int!
    emmitedBy: String!
    blockNumber: Int
    transactionHash: String!
  }

  type SystemMessage {
    type: String!
    name: String!
    createdAt: Int!
  }

  type ColonyActionRoles {
    id: Int!
    setTo: Boolean!
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
    roles: [ColonyActionRoles!]!
    annotationHash: String
    oldVersion: String!
    newVersion: String!
    colonyDisplayName: String!
    colonyAvatarHash: String!
    colonyTokens: [String]!
    domainName: String!
    domainPurpose: String!
    domainColor: String!
    blockNumber: Int!
    motionState: String
    motionDomain: Int!
    rootHash: String
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
    balance: String!
    balances(colonyAddress: String!, domainIds: [Int!]): [DomainBalance!]!
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

  type UserToken {
    address: String!
    decimals: Int!
    name: String!
    symbol: String!
    iconHash: String
    verified: Boolean!
    balance: String!
  }

  type UserLock {
    balance: String!
    nativeToken: UserToken
    totalObligation: String!
    pendingBalance: String!
    activeTokens: String!
  }

  type ProcessedMetaColony {
    id: Int!
    colonyAddress: String!
    colonyName: String!
    displayName: String
    avatarHash: String
    avatarURL: String
  }

  type UserProfile {
    avatarHash: String
    displayName: String
    username: String
    walletAddress: String!
  }

  type User {
    id: String!
    profile: UserProfile!
  }

  extend type User {
    reputation(colonyAddress: String!, domainId: Int): String!
    tokens(walletAddress: String!): [Token!]!
    userLock(
      walletAddress: String!
      tokenAddress: String!
      colonyAddress: String!
    ): UserLock!
    tokenTransfers: [Transfer!]!
    processedColonies: [ProcessedColony!]!
  }

  type ActionThatNeedsAttention {
    transactionHash: String!
    needsAction: Boolean!
  }

  type UserDomainReputation {
    domainId: Int!
    reputationPercentage: String!
  }

  extend type Query {
    loggedInUser: LoggedInUser!
    colonyAddress(name: String!): String!
    colonyName(address: String!): String!
    colonyReputation(address: String!, domainId: Int): String
    colonyMembersWithReputation(
      colonyAddress: String!
      domainId: Int
    ): [String!]
    colonyDomain(colonyAddress: String!, domainId: Int!): ProcessedDomain!
    historicColonyRoles(
      colonyAddress: String!
      blockNumber: Int!
    ): [ProcessedRoles!]!
    token(address: String!): Token!
    tokens(addresses: [String!]): [Token!]!
    userAddress(name: String!): String!
    userReputation(
      address: String!
      colonyAddress: String!
      domainId: Int
      rootHash: String
    ): String!
    userReputationForTopDomains(
      address: String!
      colonyAddress: String!
    ): [UserDomainReputation!]!
    username(address: String!): String!
    networkContracts: NetworkContracts!
    colonyAction(
      transactionHash: String!
      colonyAddress: String!
    ): ColonyAction!
    processedMetaColony: ProcessedMetaColony
    actionsThatNeedAttention(
      colonyAddress: String!
      walletAddress: String!
    ): [ActionThatNeedsAttention]!
    domainBalance(
      colonyAddress: String!
      tokenAddress: String!
      domainId: Int!
    ): String!
  }

  extend type Mutation {
    setLoggedInUser(input: LoggedInUserInput): LoggedInUser!
    clearLoggedInUser: LoggedInUser!
    updateNetworkContracts: NetworkContracts!
  }

  # The Graph
  #
  #
  input ByColonyFilter {
    colonyAddress: String!
    domainChainId: Int
  }

  input ByColoniesAddressesFilter {
    id_in: [String!]!
  }

  type SubgraphToken {
    id: String!
    symbol: String!
    decimals: String!
  }

  type SubgraphDomainMetadata {
    id: String!
    metadata: String!
    transaction: SubgraphTransaction!
  }

  type SubgraphDomain {
    id: String!
    domainChainId: String!
    name: String!
    parent: SubgraphDomain
    colonyAddress: String!
    metadata: String
    metadataHistory: [SubgraphDomainMetadata]!
  }

  type SubgraphFundingPotPayout {
    id: String!
    tokenAddress: String!
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

  type SubgraphColonyMetadata {
    id: String!
    metadata: String!
    transaction: SubgraphTransaction!
  }

  type SubgraphColony {
    id: String!
    colonyChainId: String!
    address: String!
    ensName: String!
    metadata: String!
    metadataHistory: [SubgraphColonyMetadata!]!
    token: SubgraphToken!
    domains: [SubgraphDomain!]!
    extensions: [SubgraphColonyExtension!]
  }

  extend type Query {
    domains(where: ByColonyFilter!): [SubgraphDomain!]!
    colony(id: String!): SubgraphColony!
    colonies(
      where: ByColoniesAddressesFilter!
      orderBy: String!
      orderDirection: String!
    ): [SubgraphColony!]!
    processedColony(address: String!): ProcessedColony!
  }

  #
  # Processed Colony
  #

  type ProcessedDomain {
    id: String!
    color: Int!
    description: String
    ethDomainId: Int!
    name: String!
    ethParentDomainId: Int
  }

  type ProcessedRoleDomain {
    domainId: Int!
    roles: String!
  }

  type ProcessedRoles {
    address: String!
    domains: [ProcessedRoleDomain!]!
  }

  type ProcessedTokenBalances {
    domainId: Int!
    amount: String!
  }

  type ProcessedTokens {
    id: String!
    address: String!
    iconHash: String
    decimals: Int!
    name: String!
    symbol: String!
    processedBalances(colonyAddress: String!): [ProcessedTokenBalances!]!
  }

  type ProcessedColony {
    id: Int!
    colonyAddress: String!
    colonyName: String!
    displayName: String
    avatarHash: String
    avatarURL: String
    nativeTokenAddress: String!
    tokenAddresses: [String]!
    extensionAddresses: [String!]
    domains: [ProcessedDomain!]!
    roles: [ProcessedRoles!]!
    tokens: [ProcessedTokens!]!
    version: String!
    canUserMintNativeToken: Boolean!
    canColonyMintNativeToken: Boolean!
    canUnlockNativeToken: Boolean!
    isInRecoveryMode: Boolean!
    isNativeTokenLocked: Boolean!
    transfers: [Transfer!]!
    unclaimedTransfers: [Transfer!]!
    events: [NetworkEvent!]!
    isDeploymentFinished: Boolean!
    installedExtensions: [ColonyExtension!]!
  }
`;

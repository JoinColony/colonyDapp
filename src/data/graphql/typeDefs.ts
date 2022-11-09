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

  type SubgraphEventProcessedValues {
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
    txHash: String!
  }

  type SubgraphEvent {
    id: String!
    transaction: SubgraphTransaction!
    address: String!
    name: String!
    args: String!
    timestamp: String!
    associatedColony: SubgraphColony!
    processedValues: SubgraphEventProcessedValues!
  }

  type SubgraphMotion {
    fundamentalChainId: String!
    transaction: SubgraphTransaction!
    address: String!
    name: String!
    args: String!
    timestamp: String!
    associatedColony: SubgraphColony!
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

  # Type: UserProfile is being merged with a type of the
  # same name in ColonyServer.I only want these keys.
  type SimpleUserProfile {
    avatarHash: String
    displayName: String
    username: String
    walletAddress: String!
  }

  type SimpleUser {
    id: String!
    profile: SimpleUserProfile!
  }

  type NFT {
    id: String!
    profile: NFTProfile!
  }

  type NFTProfile {
    displayName: String!
    walletAddress: String!
  }

  # Note: excluding "metadata" since we're not using it and, given that it's
  # an arbitrary object, there's no easy way to represent its type.
  type NFTData {
    address: String!
    description: String
    id: String!
    imageUri: String
    logoUri: String!
    name: String
    tokenName: String!
    tokenSymbol: String!
    uri: String!
  }

  union SafeBalanceToken = ERC20Token | SafeNativeToken

  type ERC20Token {
    name: String!
    decimals: Int!
    symbol: String!
    logoUri: String!
    address: String!
  }

  type SafeNativeToken {
    name: String!
    decimals: Int!
    symbol: String!
    address: String!
    networkName: String!
  }

  type FunctionParamType {
    name: String!
    type: String!
  }

  type SafeTransaction {
    transactionType: String!
    tokenAddress: String
    tokenData: SafeBalanceToken
    amount: String
    rawAmount: String
    recipient: SimpleUser
    data: String!
    contract: SimpleUser
    abi: String!
    contractFunction: String!
    nft: NFT
    nftData: NFTData
    functionParamTypes: [FunctionParamType!]
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
    annotationMessage: String
    oldVersion: String!
    newVersion: String!
    colonyDisplayName: String!
    colonyAvatarHash: String!
    colonyTokens: [String!]!
    domainName: String!
    domainPurpose: String!
    domainColor: String!
    blockNumber: Int!
    motionState: String
    motionDomain: Int!
    rootHash: String
    reputationChange: String!
    isWhitelistActivated: Boolean!
    verifiedAddresses: [String!]!
    colonySafes: [ColonySafe!]!
    safeData: SafeData
    safeTransactions: [SafeTransaction!]!
    transactionsTitle: String!
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

  type ColonyContributor {
    id: String!
    directRoles: [Int!]!
    roles: [Int!]!
    banned: Boolean!
    profile: UserProfile!
    isWhitelisted: Boolean!
    userReputation: String!
  }

  type ColonyWatcher {
    id: String!
    profile: UserProfile!
    banned: Boolean!
    isWhitelisted: Boolean!
  }

  type ContributorsAndWatchers {
    contributors: [ColonyContributor!]!
    watchers: [ColonyWatcher!]!
  }

  extend type Query {
    loggedInUser: LoggedInUser!
    colonyAddress(name: String!): String!
    colonyName(address: String!): String!
    colonyReputation(address: String!, domainId: Int): String
    contributorsAndWatchers(
      colonyAddress: String!
      colonyName: String!
      domainId: Int
    ): ContributorsAndWatchers
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
    verifiedUsers(verifiedAddresses: [String!]!): [User!]!
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

  type ColonySafe {
    safeName: String!
    contractAddress: String!
    chainId: String!
    moduleContractAddress: String!
  }

  type SafeData {
    chainId: String!
    contractAddress: String!
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
    safes: [ColonySafe!]!
    domains: [ProcessedDomain!]!
    roles: [ProcessedRoles!]!
    tokens: [ProcessedTokens!]!
    version: String!
    canColonyMintNativeToken: Boolean!
    canColonyUnlockNativeToken: Boolean!
    isInRecoveryMode: Boolean!
    isNativeTokenLocked: Boolean!
    transfers: [Transfer!]!
    unclaimedTransfers: [Transfer!]!
    events: [NetworkEvent!]!
    isDeploymentFinished: Boolean!
    installedExtensions: [ColonyExtension!]!
    whitelistedAddresses: [String!]!
    isWhitelistActivated: Boolean!
  }
`;

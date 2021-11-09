import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

      export interface IntrospectionResultData {
        __schema: {
          types: {
            kind: string;
            name: string;
            possibleTypes: {
              name: string;
            }[];
          }[];
        };
      }
      const result: IntrospectionResultData = {
  "__schema": {
    "types": [
      {
        "kind": "INTERFACE",
        "name": "ColonyEvent",
        "possibleTypes": [
          {
            "name": "CreateDomainEvent"
          }
        ]
      },
      {
        "kind": "UNION",
        "name": "EventContext",
        "possibleTypes": [
          {
            "name": "CreateDomainEvent"
          },
          {
            "name": "NewUserEvent"
          },
          {
            "name": "TransactionMessageEvent"
          }
        ]
      }
    ]
  }
};
      export default result;
    
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type ColonyEvent = {
  type: EventType;
  colonyAddress?: Maybe<Scalars['String']>;
};

export type CreateDomainEvent = ColonyEvent & {
  type: EventType;
  ethDomainId: Scalars['Int'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type NewUserEvent = {
  type: EventType;
};

export type TransactionMessageEvent = {
  type: EventType;
  transactionHash: Scalars['String'];
  message: Scalars['String'];
  colonyAddress: Scalars['String'];
};

export type EventContext = CreateDomainEvent | NewUserEvent | TransactionMessageEvent;

export type Event = {
  id: Scalars['String'];
  type: EventType;
  createdAt: Scalars['DateTime'];
  initiator?: Maybe<User>;
  initiatorAddress: Scalars['String'];
  sourceId: Scalars['String'];
  sourceType: Scalars['String'];
  context: EventContext;
};

export type Notification = {
  id: Scalars['String'];
  event: Event;
  read: Scalars['Boolean'];
};

export type CreateUserInput = {
  username: Scalars['String'];
};

export type EditUserInput = {
  avatarHash?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
};

export type CreateWorkRequestInput = {
  id: Scalars['String'];
};

export type SendWorkInviteInput = {
  id: Scalars['String'];
  workerAddress: Scalars['String'];
};

export type AssignWorkerInput = {
  id: Scalars['String'];
  workerAddress: Scalars['String'];
};

export type UnassignWorkerInput = {
  id: Scalars['String'];
  workerAddress: Scalars['String'];
};

export type SubscribeToColonyInput = {
  colonyAddress: Scalars['String'];
};

export type UnsubscribeFromColonyInput = {
  colonyAddress: Scalars['String'];
};

export type MarkNotificationAsReadInput = {
  id: Scalars['String'];
};

export type EditDomainNameInput = {
  colonyAddress: Scalars['String'];
  ethDomainId: Scalars['Int'];
  name: Scalars['String'];
};

export type SetUserTokensInput = {
  tokenAddresses: Array<Scalars['String']>;
};

export type CreateSuggestionInput = {
  colonyAddress: Scalars['String'];
  ethDomainId: Scalars['Int'];
  title: Scalars['String'];
};

export type SetSuggestionStatusInput = {
  id: Scalars['String'];
  status: SuggestionStatus;
};

export type AddUpvoteToSuggestionInput = {
  id: Scalars['String'];
};

export type RemoveUpvoteFromSuggestionInput = {
  id: Scalars['String'];
};

export type Payout = {
  amount: Scalars['String'];
  tokenAddress: Scalars['String'];
};

export type SendTransactionMessageInput = {
  transactionHash: Scalars['String'];
  message: Scalars['String'];
  colonyAddress: Scalars['String'];
};

export type Mutation = {
  addUpvoteToSuggestion?: Maybe<Suggestion>;
  clearLoggedInUser: LoggedInUser;
  createSuggestion?: Maybe<Suggestion>;
  createUser?: Maybe<User>;
  editUser?: Maybe<User>;
  markAllNotificationsAsRead: Scalars['Boolean'];
  markNotificationAsRead: Scalars['Boolean'];
  removeUpvoteFromSuggestion?: Maybe<Suggestion>;
  sendTransactionMessage: Scalars['Boolean'];
  setLoggedInUser: LoggedInUser;
  setSuggestionStatus?: Maybe<Suggestion>;
  setUserTokens?: Maybe<User>;
  subscribeToColony?: Maybe<User>;
  unsubscribeFromColony?: Maybe<User>;
  updateNetworkContracts: NetworkContracts;
};


export type MutationAddUpvoteToSuggestionArgs = {
  input: AddUpvoteToSuggestionInput;
};


export type MutationCreateSuggestionArgs = {
  input: CreateSuggestionInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationEditUserArgs = {
  input: EditUserInput;
};


export type MutationMarkNotificationAsReadArgs = {
  input: MarkNotificationAsReadInput;
};


export type MutationRemoveUpvoteFromSuggestionArgs = {
  input: RemoveUpvoteFromSuggestionInput;
};


export type MutationSendTransactionMessageArgs = {
  input: SendTransactionMessageInput;
};


export type MutationSetLoggedInUserArgs = {
  input?: Maybe<LoggedInUserInput>;
};


export type MutationSetSuggestionStatusArgs = {
  input: SetSuggestionStatusInput;
};


export type MutationSetUserTokensArgs = {
  input: SetUserTokensInput;
};


export type MutationSubscribeToColonyArgs = {
  input: SubscribeToColonyInput;
};


export type MutationUnsubscribeFromColonyArgs = {
  input: UnsubscribeFromColonyInput;
};

export type Query = {
  actionsThatNeedAttention: Array<Maybe<ActionThatNeedsAttention>>;
  colonies: Array<SubgraphColony>;
  colony: SubgraphColony;
  colonyAction: ColonyAction;
  colonyAddress: Scalars['String'];
  colonyDomain: ProcessedDomain;
  colonyExtension?: Maybe<ColonyExtension>;
  colonyMembersWithReputation?: Maybe<Array<Scalars['String']>>;
  colonyName: Scalars['String'];
  colonyReputation?: Maybe<Scalars['String']>;
  domainBalance: Scalars['String'];
  domains: Array<SubgraphDomain>;
  events: Array<SubgraphEvent>;
  eventsForMotion: Array<ParsedEvent>;
  getRecoveryRequiredApprovals: Scalars['Int'];
  getRecoveryStorageSlot: Scalars['String'];
  hasKycPolicy: Scalars['Boolean'];
  historicColonyRoles: Array<ProcessedRoles>;
  legacyNumberOfRecoveryRoles: Scalars['Int'];
  loggedInUser: LoggedInUser;
  motionCurrentUserVoted: Scalars['Boolean'];
  motionFinalized: Scalars['Boolean'];
  motionObjectionAnnotation: MotionObjectionAnnotation;
  motionStakerReward: MotionStakerRewards;
  motionStakes: MotionStakes;
  motionStatus: Scalars['String'];
  motionTimeoutPeriods: MotionTimeoutPeriods;
  motionUserVoteRevealed: MotionVoteReveal;
  motionVoteResults: MotionVoteResults;
  motionVoterReward: MotionVoterReward;
  motionsSystemMessages: Array<SystemMessage>;
  networkContracts: NetworkContracts;
  networkExtensionVersion: Array<Maybe<ColonyExtensionVersion>>;
  processedColony: ProcessedColony;
  processedMetaColony?: Maybe<ProcessedMetaColony>;
  recoveryAllEnteredEvents: Array<ParsedEvent>;
  recoveryEventsForSession: Array<ParsedEvent>;
  recoveryRolesAndApprovalsForSession: Array<UsersAndRecoveryApprovals>;
  recoveryRolesUsers: Array<User>;
  recoverySystemMessagesForSession: Array<SystemMessage>;
  stakeAmountsForMotion: StakeAmounts;
  subscribedUsers: Array<User>;
  systemInfo: SystemInfo;
  token: Token;
  tokenInfo: TokenInfo;
  tokens: Array<Token>;
  transactionMessages: TransactionMessages;
  transactionMessagesCount: TransactionMessagesCount;
  user: User;
  userAddress: Scalars['String'];
  userReputation: Scalars['String'];
  userReputationForTopDomains: Array<UserDomainReputation>;
  username: Scalars['String'];
  votingState: VotingState;
  whitelistAgreement: Scalars['String'];
  whitelistAgreementHash?: Maybe<Scalars['String']>;
  whitelistedUsers: Array<User>;
};


export type QueryActionsThatNeedAttentionArgs = {
  colonyAddress: Scalars['String'];
  walletAddress: Scalars['String'];
};


export type QueryColoniesArgs = {
  where: ByColoniesAddressesFilter;
  orderBy: Scalars['String'];
  orderDirection: Scalars['String'];
};


export type QueryColonyArgs = {
  id: Scalars['String'];
};


export type QueryColonyActionArgs = {
  transactionHash: Scalars['String'];
  colonyAddress: Scalars['String'];
};


export type QueryColonyAddressArgs = {
  name: Scalars['String'];
};


export type QueryColonyDomainArgs = {
  colonyAddress: Scalars['String'];
  domainId: Scalars['Int'];
};


export type QueryColonyExtensionArgs = {
  colonyAddress: Scalars['String'];
  extensionId: Scalars['String'];
};


export type QueryColonyMembersWithReputationArgs = {
  colonyAddress: Scalars['String'];
  domainId?: Maybe<Scalars['Int']>;
};


export type QueryColonyNameArgs = {
  address: Scalars['String'];
};


export type QueryColonyReputationArgs = {
  address: Scalars['String'];
  domainId?: Maybe<Scalars['Int']>;
};


export type QueryDomainBalanceArgs = {
  colonyAddress: Scalars['String'];
  tokenAddress: Scalars['String'];
  domainId: Scalars['Int'];
};


export type QueryDomainsArgs = {
  where: ByColonyFilter;
};


export type QueryEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  where?: Maybe<EventsFilter>;
  orderDirection?: Maybe<Scalars['String']>;
};


export type QueryEventsForMotionArgs = {
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
};


export type QueryGetRecoveryRequiredApprovalsArgs = {
  blockNumber: Scalars['Int'];
  colonyAddress: Scalars['String'];
};


export type QueryGetRecoveryStorageSlotArgs = {
  colonyAddress: Scalars['String'];
  storageSlot: Scalars['String'];
};


export type QueryHasKycPolicyArgs = {
  colonyAddress: Scalars['String'];
};


export type QueryHistoricColonyRolesArgs = {
  colonyAddress: Scalars['String'];
  blockNumber: Scalars['Int'];
};


export type QueryLegacyNumberOfRecoveryRolesArgs = {
  colonyAddress: Scalars['String'];
};


export type QueryMotionCurrentUserVotedArgs = {
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
  userAddress: Scalars['String'];
};


export type QueryMotionFinalizedArgs = {
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
};


export type QueryMotionObjectionAnnotationArgs = {
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
};


export type QueryMotionStakerRewardArgs = {
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
  userAddress: Scalars['String'];
};


export type QueryMotionStakesArgs = {
  colonyAddress: Scalars['String'];
  userAddress: Scalars['String'];
  motionId: Scalars['Int'];
};


export type QueryMotionStatusArgs = {
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
};


export type QueryMotionTimeoutPeriodsArgs = {
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
};


export type QueryMotionUserVoteRevealedArgs = {
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
  userAddress: Scalars['String'];
};


export type QueryMotionVoteResultsArgs = {
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
  userAddress: Scalars['String'];
};


export type QueryMotionVoterRewardArgs = {
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
  userAddress: Scalars['String'];
};


export type QueryMotionsSystemMessagesArgs = {
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
};


export type QueryNetworkExtensionVersionArgs = {
  extensionId?: Maybe<Scalars['String']>;
};


export type QueryProcessedColonyArgs = {
  address: Scalars['String'];
};


export type QueryRecoveryAllEnteredEventsArgs = {
  colonyAddress: Scalars['String'];
};


export type QueryRecoveryEventsForSessionArgs = {
  blockNumber: Scalars['Int'];
  colonyAddress: Scalars['String'];
};


export type QueryRecoveryRolesAndApprovalsForSessionArgs = {
  blockNumber: Scalars['Int'];
  colonyAddress: Scalars['String'];
};


export type QueryRecoveryRolesUsersArgs = {
  colonyAddress: Scalars['String'];
  endBlockNumber?: Maybe<Scalars['Int']>;
};


export type QueryRecoverySystemMessagesForSessionArgs = {
  blockNumber: Scalars['Int'];
  colonyAddress: Scalars['String'];
};


export type QueryStakeAmountsForMotionArgs = {
  colonyAddress: Scalars['String'];
  userAddress: Scalars['String'];
  motionId: Scalars['Int'];
};


export type QuerySubscribedUsersArgs = {
  colonyAddress: Scalars['String'];
};


export type QueryTokenArgs = {
  address: Scalars['String'];
};


export type QueryTokenInfoArgs = {
  address: Scalars['String'];
};


export type QueryTokensArgs = {
  addresses?: Maybe<Array<Scalars['String']>>;
};


export type QueryTransactionMessagesArgs = {
  transactionHash: Scalars['String'];
};


export type QueryTransactionMessagesCountArgs = {
  colonyAddress: Scalars['String'];
};


export type QueryUserArgs = {
  address: Scalars['String'];
};


export type QueryUserAddressArgs = {
  name: Scalars['String'];
};


export type QueryUserReputationArgs = {
  address: Scalars['String'];
  colonyAddress: Scalars['String'];
  domainId?: Maybe<Scalars['Int']>;
  rootHash?: Maybe<Scalars['String']>;
};


export type QueryUserReputationForTopDomainsArgs = {
  address: Scalars['String'];
  colonyAddress: Scalars['String'];
};


export type QueryUsernameArgs = {
  address: Scalars['String'];
};


export type QueryVotingStateArgs = {
  colonyAddress: Scalars['String'];
  motionId: Scalars['Int'];
};


export type QueryWhitelistAgreementArgs = {
  agreementHash: Scalars['String'];
};


export type QueryWhitelistAgreementHashArgs = {
  colonyAddress: Scalars['String'];
};


export type QueryWhitelistedUsersArgs = {
  colonyAddress: Scalars['String'];
};

export type Subscription = {
  events: Array<SubgraphEvent>;
  motions: Array<SubscriptionMotion>;
  oneTxPayments: Array<OneTxPayment>;
  subscribedUsers: Array<User>;
  transactionMessages: TransactionMessages;
  transactionMessagesCount: TransactionMessagesCount;
};


export type SubscriptionEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  where?: Maybe<EventsFilter>;
};


export type SubscriptionMotionsArgs = {
  skip: Scalars['Int'];
  first: Scalars['Int'];
  where: MotionsFilter;
};


export type SubscriptionOneTxPaymentsArgs = {
  skip: Scalars['Int'];
  first: Scalars['Int'];
  where: ActionsFilter;
};


export type SubscriptionSubscribedUsersArgs = {
  colonyAddress: Scalars['String'];
};


export type SubscriptionTransactionMessagesArgs = {
  transactionHash: Scalars['String'];
};


export type SubscriptionTransactionMessagesCountArgs = {
  colonyAddress: Scalars['String'];
};

export enum SuggestionStatus {
  Open = 'Open',
  NotPlanned = 'NotPlanned',
  Accepted = 'Accepted',
  Deleted = 'Deleted'
}

export type Suggestion = {
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  colonyAddress: Scalars['String'];
  creatorAddress: Scalars['String'];
  creator: User;
  ethDomainId: Scalars['Int'];
  status: SuggestionStatus;
  title: Scalars['String'];
  upvotes: Array<Scalars['String']>;
};

export type TokenInfo = {
  id: Scalars['String'];
  address: Scalars['String'];
  iconHash?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  decimals: Scalars['Int'];
  symbol: Scalars['String'];
  verified: Scalars['Boolean'];
};

export type SystemInfo = {
  version: Scalars['String'];
};

export type User = {
  colonyAddresses: Array<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  notifications: Array<Notification>;
  processedColonies: Array<ProcessedColony>;
  profile: UserProfile;
  reputation: Scalars['String'];
  tokenAddresses: Array<Scalars['String']>;
  tokenTransfers: Array<Transfer>;
  tokens: Array<Token>;
  userLock: UserLock;
};


export type UserNotificationsArgs = {
  read?: Maybe<Scalars['Boolean']>;
};


export type UserReputationArgs = {
  colonyAddress: Scalars['String'];
  domainId?: Maybe<Scalars['Int']>;
};


export type UserTokensArgs = {
  walletAddress: Scalars['String'];
};


export type UserUserLockArgs = {
  walletAddress: Scalars['String'];
  tokenAddress: Scalars['String'];
  colonyAddress: Scalars['String'];
};

export type UserProfile = {
  avatarHash?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  walletAddress: Scalars['String'];
  website?: Maybe<Scalars['String']>;
};


export enum EventType {
  AssignWorker = 'AssignWorker',
  CreateDomain = 'CreateDomain',
  CreateWorkRequest = 'CreateWorkRequest',
  NewUser = 'NewUser',
  SendWorkInvite = 'SendWorkInvite',
  UnassignWorker = 'UnassignWorker',
  TransactionMessage = 'TransactionMessage'
}

export type TransactionMessages = {
  transactionHash: Scalars['String'];
  messages: Array<Event>;
};

export type TransactionCount = {
  transactionHash: Scalars['String'];
  count: Scalars['Int'];
};

export type TransactionMessagesCount = {
  colonyTransactionMessages: Array<TransactionCount>;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type LoggedInUserInput = {
  balance?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  walletAddress?: Maybe<Scalars['String']>;
  ethereal?: Maybe<Scalars['Boolean']>;
  networkId?: Maybe<Scalars['Int']>;
};

export type EventsFilter = {
  associatedColony_contains?: Maybe<Scalars['String']>;
  associatedColony?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Scalars['String']>>;
  name_contains?: Maybe<Scalars['String']>;
  args_contains?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
};

export type LoggedInUser = {
  id: Scalars['String'];
  balance: Scalars['String'];
  username?: Maybe<Scalars['String']>;
  walletAddress: Scalars['String'];
  ethereal: Scalars['Boolean'];
  networkId?: Maybe<Scalars['Int']>;
};

export type SugraphEventProcessedValues = {
  agent: Scalars['String'];
  who: Scalars['String'];
  fromPot: Scalars['String'];
  fromDomain: Scalars['String'];
  toPot: Scalars['String'];
  toDomain: Scalars['String'];
  domainId: Scalars['String'];
  amount: Scalars['String'];
  token: Scalars['String'];
  metadata: Scalars['String'];
  user: Scalars['String'];
  role: Scalars['String'];
  setTo: Scalars['String'];
  oldVersion: Scalars['String'];
  newVersion: Scalars['String'];
  storageSlot: Scalars['String'];
  storageSlotValue: Scalars['String'];
};

export type SubgraphEvent = {
  id: Scalars['String'];
  transaction: SubgraphTransaction;
  address: Scalars['String'];
  name: Scalars['String'];
  args: Scalars['String'];
  associatedColony: SubgraphColony;
  processedValues: SugraphEventProcessedValues;
};

export type ParsedEvent = {
  type: Scalars['String'];
  name: Scalars['String'];
  values: Scalars['String'];
  createdAt: Scalars['Int'];
  emmitedBy: Scalars['String'];
  blockNumber?: Maybe<Scalars['Int']>;
  transactionHash: Scalars['String'];
};

export type SystemMessage = {
  type: Scalars['String'];
  name: Scalars['String'];
  createdAt: Scalars['Int'];
};

export type ColonyActionRoles = {
  id: Scalars['Int'];
  setTo: Scalars['Boolean'];
};

export type ColonyAction = {
  hash: Scalars['String'];
  actionInitiator: Scalars['String'];
  fromDomain: Scalars['Int'];
  toDomain: Scalars['Int'];
  recipient: Scalars['String'];
  status: Scalars['Int'];
  events: Array<ParsedEvent>;
  createdAt: Scalars['Int'];
  actionType: Scalars['String'];
  amount: Scalars['String'];
  tokenAddress: Scalars['String'];
  roles: Array<ColonyActionRoles>;
  annotationHash?: Maybe<Scalars['String']>;
  oldVersion: Scalars['String'];
  newVersion: Scalars['String'];
  colonyDisplayName: Scalars['String'];
  colonyAvatarHash: Scalars['String'];
  colonyTokens: Array<Maybe<Scalars['String']>>;
  domainName: Scalars['String'];
  domainPurpose: Scalars['String'];
  domainColor: Scalars['String'];
  blockNumber: Scalars['Int'];
  motionState?: Maybe<Scalars['String']>;
  motionDomain: Scalars['Int'];
  rootHash?: Maybe<Scalars['String']>;
  reputationChange: Scalars['String'];
};

export type NetworkContractsInput = {
  version?: Maybe<Scalars['String']>;
  feeInverse?: Maybe<Scalars['String']>;
};

export type NetworkContracts = {
  version?: Maybe<Scalars['String']>;
  feeInverse?: Maybe<Scalars['String']>;
};

export type DomainBalance = {
  id: Scalars['Int'];
  domainId: Scalars['Int'];
  amount: Scalars['String'];
};

export type Token = {
  id: Scalars['String'];
  address: Scalars['String'];
  decimals: Scalars['Int'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  iconHash?: Maybe<Scalars['String']>;
  verified: Scalars['Boolean'];
  balance: Scalars['String'];
  balances: Array<DomainBalance>;
};


export type TokenBalancesArgs = {
  colonyAddress: Scalars['String'];
  domainIds?: Maybe<Array<Scalars['Int']>>;
};

export type DomainRoles = {
  domainId: Scalars['Int'];
  roles: Array<Scalars['Int']>;
};

export type UserRoles = {
  address: Scalars['String'];
  domains: Array<DomainRoles>;
};

export type Transfer = {
  amount: Scalars['String'];
  colonyAddress: Scalars['String'];
  date: Scalars['Int'];
  from?: Maybe<Scalars['String']>;
  hash: Scalars['String'];
  incoming: Scalars['Boolean'];
  taskId?: Maybe<Scalars['Int']>;
  to?: Maybe<Scalars['String']>;
  token: Scalars['String'];
};

export type NetworkEvent = {
  toAddress?: Maybe<Scalars['String']>;
  fromAddress?: Maybe<Scalars['String']>;
  createdAt: Scalars['Int'];
  hash: Scalars['String'];
  name: Scalars['String'];
  topic?: Maybe<Scalars['String']>;
  userAddress?: Maybe<Scalars['String']>;
  domainId?: Maybe<Scalars['String']>;
};

export type UserToken = {
  address: Scalars['String'];
  decimals: Scalars['Int'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  iconHash?: Maybe<Scalars['String']>;
  verified: Scalars['Boolean'];
  balance: Scalars['String'];
};

export type UserLock = {
  balance: Scalars['String'];
  nativeToken?: Maybe<UserToken>;
  totalObligation: Scalars['String'];
  pendingBalance: Scalars['String'];
  activeTokens: Scalars['String'];
};

export type ProcessedMetaColony = {
  id: Scalars['Int'];
  colonyAddress: Scalars['String'];
  colonyName: Scalars['String'];
  displayName?: Maybe<Scalars['String']>;
  avatarHash?: Maybe<Scalars['String']>;
  avatarURL?: Maybe<Scalars['String']>;
};

export type MotionStakes = {
  totalNAYStakes: Scalars['String'];
  remainingToFullyYayStaked: Scalars['String'];
  remainingToFullyNayStaked: Scalars['String'];
  maxUserStake: Scalars['String'];
  minUserStake: Scalars['String'];
};

export type UsersAndRecoveryApprovals = {
  id: Scalars['String'];
  profile: UserProfile;
  approvedRecoveryExit: Scalars['Boolean'];
};

export type ActionThatNeedsAttention = {
  transactionHash: Scalars['String'];
  needsAction: Scalars['Boolean'];
};

export type MotionVoteReveal = {
  revealed: Scalars['Boolean'];
  vote: Scalars['Int'];
};

export type MotionVoteResults = {
  currentUserVoteSide: Scalars['Int'];
  yayVotes: Scalars['String'];
  yayVoters: Array<Scalars['String']>;
  nayVotes: Scalars['String'];
  nayVoters: Array<Scalars['String']>;
};

export type MotionStakerRewards = {
  stakingRewardYay: Scalars['String'];
  stakingRewardNay: Scalars['String'];
  stakesYay: Scalars['String'];
  stakesNay: Scalars['String'];
  claimedReward: Scalars['Boolean'];
};

export type StakeSidesAmounts = {
  YAY: Scalars['String'];
  NAY: Scalars['String'];
};

export type StakeAmounts = {
  totalStaked: StakeSidesAmounts;
  userStake: StakeSidesAmounts;
  requiredStake: Scalars['String'];
};

export type MotionObjectionAnnotation = {
  address: Scalars['String'];
  metadata: Scalars['String'];
};

export type VotingState = {
  thresholdValue: Scalars['String'];
  totalVotedReputation: Scalars['String'];
  skillRep: Scalars['String'];
};

export type MotionVoterReward = {
  reward: Scalars['String'];
  minReward: Scalars['String'];
  maxReward: Scalars['String'];
};

export type UserDomainReputation = {
  domainId: Scalars['Int'];
  reputationPercentage: Scalars['String'];
};

export type ByColonyFilter = {
  colonyAddress: Scalars['String'];
  domainChainId?: Maybe<Scalars['Int']>;
};

export type ByColoniesAddressesFilter = {
  id_in: Array<Scalars['String']>;
};

export type SubgraphBlock = {
  id: Scalars['String'];
  timestamp: Scalars['String'];
};

export type SubgraphTransaction = {
  id: Scalars['String'];
  block: SubgraphBlock;
};

export type SubgraphToken = {
  id: Scalars['String'];
  symbol: Scalars['String'];
  decimals: Scalars['String'];
};

export type SubgraphDomainMetadata = {
  id: Scalars['String'];
  metadata: Scalars['String'];
  transaction: SubgraphTransaction;
};

export type SubgraphDomain = {
  id: Scalars['String'];
  domainChainId: Scalars['String'];
  name: Scalars['String'];
  parent?: Maybe<SubgraphDomain>;
  colonyAddress: Scalars['String'];
  metadata?: Maybe<Scalars['String']>;
  metadataHistory: Array<Maybe<SubgraphDomainMetadata>>;
};

export type SubgraphFundingPotPayout = {
  id: Scalars['String'];
  tokenAddress: Scalars['String'];
  amount: Scalars['String'];
  token: SubgraphToken;
};

export type SubgraphFundingPot = {
  id: Scalars['String'];
  fundingPotPayouts: Array<SubgraphFundingPotPayout>;
};

export type SubgraphPayment = {
  to: Scalars['String'];
  domain: SubgraphDomain;
  fundingPot: SubgraphFundingPot;
};

export type SubgraphColonyMetadata = {
  id: Scalars['String'];
  metadata: Scalars['String'];
  transaction: SubgraphTransaction;
};

export type SubgraphColony = {
  id: Scalars['String'];
  colonyChainId: Scalars['String'];
  address: Scalars['String'];
  ensName: Scalars['String'];
  metadata: Scalars['String'];
  metadataHistory: Array<SubgraphColonyMetadata>;
  token: SubgraphToken;
  domains: Array<SubgraphDomain>;
  extensions?: Maybe<Array<SubgraphColonyExtension>>;
};

export type ProcessedDomain = {
  id: Scalars['String'];
  color: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  ethDomainId: Scalars['Int'];
  name: Scalars['String'];
  ethParentDomainId?: Maybe<Scalars['Int']>;
};

export type ProcessedRoleDomain = {
  domainId: Scalars['Int'];
  roles: Scalars['String'];
};

export type ProcessedRoles = {
  address: Scalars['String'];
  domains: Array<ProcessedRoleDomain>;
};

export type ProcessedTokenBalances = {
  domainId: Scalars['Int'];
  amount: Scalars['String'];
};

export type ProcessedTokens = {
  id: Scalars['String'];
  address: Scalars['String'];
  iconHash?: Maybe<Scalars['String']>;
  decimals: Scalars['Int'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  processedBalances: Array<ProcessedTokenBalances>;
};


export type ProcessedTokensProcessedBalancesArgs = {
  colonyAddress: Scalars['String'];
};

export type ProcessedColony = {
  id: Scalars['Int'];
  colonyAddress: Scalars['String'];
  colonyName: Scalars['String'];
  displayName?: Maybe<Scalars['String']>;
  avatarHash?: Maybe<Scalars['String']>;
  avatarURL?: Maybe<Scalars['String']>;
  nativeTokenAddress: Scalars['String'];
  tokenAddresses: Array<Maybe<Scalars['String']>>;
  extensionAddresses?: Maybe<Array<Scalars['String']>>;
  domains: Array<ProcessedDomain>;
  roles: Array<ProcessedRoles>;
  tokens: Array<ProcessedTokens>;
  version: Scalars['String'];
  canMintNativeToken: Scalars['Boolean'];
  canUnlockNativeToken: Scalars['Boolean'];
  isInRecoveryMode: Scalars['Boolean'];
  isNativeTokenLocked: Scalars['Boolean'];
  transfers: Array<Transfer>;
  unclaimedTransfers: Array<Transfer>;
  events: Array<NetworkEvent>;
  isDeploymentFinished: Scalars['Boolean'];
  installedExtensions: Array<ColonyExtension>;
};

export type MotionTimeoutPeriods = {
  timeLeftToEscalate: Scalars['Int'];
  timeLeftToReveal: Scalars['Int'];
  timeLeftToStake: Scalars['Int'];
  timeLeftToSubmit: Scalars['Int'];
};

export type ColonyExtension = {
  address: Scalars['String'];
  id: Scalars['String'];
  extensionId: Scalars['String'];
  details: ColonyExtensionDetails;
};


export type ColonyExtensionDetailsArgs = {
  colonyAddress: Scalars['String'];
};

export type ColonyExtensionVersion = {
  extensionHash: Scalars['String'];
  version: Scalars['Int'];
};

export type ColonyExtensionDetails = {
  deprecated: Scalars['Boolean'];
  initialized: Scalars['Boolean'];
  installedBy: Scalars['String'];
  installedAt: Scalars['Int'];
  missingPermissions: Array<Scalars['Int']>;
  version: Scalars['Int'];
};

export type SubgraphColonyExtension = {
  id: Scalars['String'];
  hash: Scalars['String'];
};

export type ActionsFilter = {
  payment_contains?: Maybe<Scalars['String']>;
};

export type MotionsFilter = {
  associatedColony?: Maybe<Scalars['String']>;
  extensionAddress?: Maybe<Scalars['String']>;
};

export type OneTxPayment = {
  id: Scalars['String'];
  agent: Scalars['String'];
  transaction: SubgraphTransaction;
  payment: SubgraphPayment;
};

export type SubscriptionMotion = {
  id: Scalars['String'];
  fundamentalChainId: Scalars['String'];
  transaction: SubgraphTransaction;
  associatedColony: SubgraphColony;
  domain: SubgraphDomain;
  extensionAddress: Scalars['String'];
  agent: Scalars['String'];
  stakes: Array<Scalars['String']>;
  requiredStake: Scalars['String'];
  escalated: Scalars['Boolean'];
  state: Scalars['String'];
  action: Scalars['String'];
  type: Scalars['String'];
  args: SubscriptionMotionArguments;
  timeoutPeriods: MotionTimeoutPeriods;
};

export type SubscriptionMotionArguments = {
  amount: Scalars['String'];
  token: SubgraphToken;
};

export type TokensFragment = (
  Pick<ProcessedColony, 'nativeTokenAddress' | 'tokenAddresses'>
  & { tokens: Array<(
    Pick<ProcessedTokens, 'id' | 'address' | 'iconHash' | 'decimals' | 'name' | 'symbol'>
    & { processedBalances: Array<Pick<ProcessedTokenBalances, 'domainId' | 'amount'>> }
  )> }
);

export type DomainFieldsFragment = Pick<ProcessedDomain, 'id' | 'color' | 'description' | 'ethDomainId' | 'name' | 'ethParentDomainId'>;

export type ColonyProfileFragment = Pick<ProcessedColony, 'id' | 'colonyAddress' | 'colonyName' | 'displayName' | 'avatarHash' | 'avatarURL' | 'extensionAddresses'>;

export type FullColonyFragment = (
  Pick<ProcessedColony, 'version' | 'canMintNativeToken' | 'canUnlockNativeToken' | 'isInRecoveryMode' | 'isNativeTokenLocked' | 'isDeploymentFinished'>
  & { domains: Array<DomainFieldsFragment>, roles: Array<(
    Pick<ProcessedRoles, 'address'>
    & { domains: Array<Pick<ProcessedRoleDomain, 'domainId' | 'roles'>> }
  )> }
  & ColonyProfileFragment
  & TokensFragment
);

export type EventFieldsFragment = (
  Pick<Event, 'createdAt' | 'initiatorAddress' | 'sourceId' | 'sourceType' | 'type'>
  & { initiator?: Maybe<(
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
  )> }
);

export type EventContextFragment = { context: Pick<CreateDomainEvent, 'type' | 'ethDomainId' | 'colonyAddress'> };

export type FullNetworkEventFragment = Pick<NetworkEvent, 'fromAddress' | 'toAddress' | 'createdAt' | 'name' | 'hash' | 'topic' | 'userAddress' | 'domainId'>;

export type TransactionEventContextFragment = { context: Pick<TransactionMessageEvent, 'type' | 'transactionHash' | 'message' | 'colonyAddress'> };

export type TransactionMessageFragment = (
  EventFieldsFragment
  & TransactionEventContextFragment
);

export type SetLoggedInUserMutationVariables = Exact<{
  input: LoggedInUserInput;
}>;


export type SetLoggedInUserMutation = { setLoggedInUser: Pick<LoggedInUser, 'id'> };

export type ClearLoggedInUserMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearLoggedInUserMutation = { clearLoggedInUser: Pick<LoggedInUser, 'id'> };

export type CreateUserMutationVariables = Exact<{
  createUserInput: CreateUserInput;
  loggedInUserInput: LoggedInUserInput;
}>;


export type CreateUserMutation = { createUser?: Maybe<Pick<User, 'id'>>, setLoggedInUser: Pick<LoggedInUser, 'id'> };

export type EditUserMutationVariables = Exact<{
  input: EditUserInput;
}>;


export type EditUserMutation = { editUser?: Maybe<(
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'avatarHash' | 'bio' | 'displayName' | 'location' | 'website'> }
  )> };

export type SetUserTokensMutationVariables = Exact<{
  input: SetUserTokensInput;
}>;


export type SetUserTokensMutation = { setUserTokens?: Maybe<Pick<User, 'id' | 'tokenAddresses'>> };

export type MarkNotificationAsReadMutationVariables = Exact<{
  input: MarkNotificationAsReadInput;
}>;


export type MarkNotificationAsReadMutation = Pick<Mutation, 'markNotificationAsRead'>;

export type MarkAllNotificationsAsReadMutationVariables = Exact<{ [key: string]: never; }>;


export type MarkAllNotificationsAsReadMutation = Pick<Mutation, 'markAllNotificationsAsRead'>;

export type SubscribeToColonyMutationVariables = Exact<{
  input: SubscribeToColonyInput;
}>;


export type SubscribeToColonyMutation = { subscribeToColony?: Maybe<Pick<User, 'id' | 'colonyAddresses'>> };

export type UnsubscribeFromColonyMutationVariables = Exact<{
  input: UnsubscribeFromColonyInput;
}>;


export type UnsubscribeFromColonyMutation = { unsubscribeFromColony?: Maybe<Pick<User, 'id' | 'colonyAddresses'>> };

export type SendTransactionMessageMutationVariables = Exact<{
  input: SendTransactionMessageInput;
}>;


export type SendTransactionMessageMutation = Pick<Mutation, 'sendTransactionMessage'>;

export type UpdateNetworkContractsMutationVariables = Exact<{ [key: string]: never; }>;


export type UpdateNetworkContractsMutation = { updateNetworkContracts: Pick<NetworkContracts, 'version' | 'feeInverse'> };

export type LoggedInUserQueryVariables = Exact<{ [key: string]: never; }>;


export type LoggedInUserQuery = { loggedInUser: Pick<LoggedInUser, 'walletAddress' | 'balance' | 'username' | 'ethereal' | 'networkId'> };

export type UserQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type UserQuery = { user: (
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'username' | 'walletAddress' | 'displayName' | 'bio' | 'location' | 'website' | 'avatarHash'> }
  ) };

export type UserWithReputationQueryVariables = Exact<{
  address: Scalars['String'];
  colonyAddress: Scalars['String'];
  domainId?: Maybe<Scalars['Int']>;
}>;


export type UserWithReputationQuery = { user: (
    Pick<User, 'id' | 'reputation'>
    & { profile: Pick<UserProfile, 'username' | 'walletAddress' | 'displayName' | 'bio' | 'location' | 'website' | 'avatarHash'> }
  ) };

export type UserReputationQueryVariables = Exact<{
  address: Scalars['String'];
  colonyAddress: Scalars['String'];
  domainId?: Maybe<Scalars['Int']>;
  rootHash?: Maybe<Scalars['String']>;
}>;


export type UserReputationQuery = Pick<Query, 'userReputation'>;

export type UserReputationForTopDomainsQueryVariables = Exact<{
  address: Scalars['String'];
  colonyAddress: Scalars['String'];
}>;


export type UserReputationForTopDomainsQuery = { userReputationForTopDomains: Array<Pick<UserDomainReputation, 'domainId' | 'reputationPercentage'>> };

export type UserTokensQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type UserTokensQuery = { user: (
    Pick<User, 'id' | 'tokenAddresses'>
    & { tokens: Array<Pick<Token, 'id' | 'address' | 'iconHash' | 'decimals' | 'name' | 'symbol' | 'balance'>> }
  ) };

export type UserBalanceWithLockQueryVariables = Exact<{
  address: Scalars['String'];
  tokenAddress: Scalars['String'];
  colonyAddress: Scalars['String'];
}>;


export type UserBalanceWithLockQuery = { user: (
    Pick<User, 'id'>
    & { userLock: (
      Pick<UserLock, 'balance' | 'totalObligation' | 'pendingBalance' | 'activeTokens'>
      & { nativeToken?: Maybe<Pick<UserToken, 'decimals' | 'name' | 'symbol' | 'balance' | 'address' | 'verified'>> }
    ) }
  ) };

export type UsernameQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type UsernameQuery = Pick<Query, 'username'>;

export type UserAddressQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type UserAddressQuery = Pick<Query, 'userAddress'>;

export type WhitelistedUsersQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type WhitelistedUsersQuery = { whitelistedUsers: Array<(
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'walletAddress'> }
  )> };

export type TokenBalancesForDomainsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  tokenAddresses: Array<Scalars['String']>;
  domainIds?: Maybe<Array<Scalars['Int']>>;
}>;


export type TokenBalancesForDomainsQuery = { tokens: Array<(
    Pick<Token, 'id' | 'address' | 'iconHash' | 'decimals' | 'name' | 'symbol'>
    & { balances: Array<Pick<DomainBalance, 'domainId' | 'amount'>> }
  )> };

export type DomainBalanceQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  tokenAddress: Scalars['String'];
  domainId: Scalars['Int'];
}>;


export type DomainBalanceQuery = Pick<Query, 'domainBalance'>;

export type UserColoniesQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type UserColoniesQuery = { user: (
    Pick<User, 'id' | 'colonyAddresses'>
    & { processedColonies: Array<Pick<ProcessedColony, 'id' | 'avatarHash' | 'avatarURL' | 'colonyAddress' | 'colonyName' | 'displayName'>> }
  ) };

export type UserColonyAddressesQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type UserColonyAddressesQuery = { user: Pick<User, 'id' | 'colonyAddresses'> };

export type TokenQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type TokenQuery = { token: Pick<Token, 'id' | 'address' | 'iconHash' | 'decimals' | 'name' | 'symbol'> };

export type TokenInfoQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type TokenInfoQuery = { tokenInfo: Pick<TokenInfo, 'decimals' | 'name' | 'symbol' | 'iconHash'> };

export type UserNotificationsQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type UserNotificationsQuery = { user: (
    Pick<User, 'id'>
    & { notifications: Array<(
      Pick<Notification, 'id' | 'read'>
      & { event: (
        Pick<Event, 'id' | 'type' | 'createdAt' | 'initiatorAddress' | 'sourceId' | 'sourceType'>
        & EventContextFragment
      ) }
    )> }
  ) };

export type SystemInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type SystemInfoQuery = { systemInfo: Pick<SystemInfo, 'version'> };

export type NetworkContractsQueryVariables = Exact<{ [key: string]: never; }>;


export type NetworkContractsQuery = { networkContracts: Pick<NetworkContracts, 'version' | 'feeInverse'> };

export type ColonyActionQueryVariables = Exact<{
  transactionHash: Scalars['String'];
  colonyAddress: Scalars['String'];
}>;


export type ColonyActionQuery = { colonyAction: (
    Pick<ColonyAction, 'hash' | 'actionInitiator' | 'fromDomain' | 'toDomain' | 'recipient' | 'status' | 'createdAt' | 'actionType' | 'amount' | 'tokenAddress' | 'annotationHash' | 'newVersion' | 'oldVersion' | 'colonyDisplayName' | 'colonyAvatarHash' | 'colonyTokens' | 'domainName' | 'domainPurpose' | 'domainColor' | 'motionState' | 'motionDomain' | 'blockNumber' | 'rootHash' | 'reputationChange'>
    & { events: Array<Pick<ParsedEvent, 'type' | 'name' | 'values' | 'createdAt' | 'emmitedBy' | 'transactionHash'>>, roles: Array<Pick<ColonyActionRoles, 'id' | 'setTo'>> }
  ) };

export type MetaColonyQueryVariables = Exact<{ [key: string]: never; }>;


export type MetaColonyQuery = { processedMetaColony?: Maybe<Pick<ProcessedMetaColony, 'id' | 'colonyAddress' | 'colonyName' | 'displayName' | 'avatarHash' | 'avatarURL'>> };

export type ActionsThatNeedAttentionQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  walletAddress: Scalars['String'];
}>;


export type ActionsThatNeedAttentionQuery = { actionsThatNeedAttention: Array<Maybe<Pick<ActionThatNeedsAttention, 'transactionHash' | 'needsAction'>>> };

export type EventsForMotionQueryVariables = Exact<{
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type EventsForMotionQuery = { eventsForMotion: Array<Pick<ParsedEvent, 'type' | 'name' | 'values' | 'createdAt' | 'emmitedBy' | 'blockNumber' | 'transactionHash'>> };

export type RecoveryEventsForSessionQueryVariables = Exact<{
  blockNumber: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type RecoveryEventsForSessionQuery = { recoveryEventsForSession: Array<Pick<ParsedEvent, 'type' | 'name' | 'values' | 'createdAt' | 'emmitedBy' | 'blockNumber' | 'transactionHash'>> };

export type RecoverySystemMessagesForSessionQueryVariables = Exact<{
  blockNumber: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type RecoverySystemMessagesForSessionQuery = { recoverySystemMessagesForSession: Array<Pick<SystemMessage, 'type' | 'name' | 'createdAt'>> };

export type GetRecoveryStorageSlotQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  storageSlot: Scalars['String'];
}>;


export type GetRecoveryStorageSlotQuery = Pick<Query, 'getRecoveryStorageSlot'>;

export type RecoveryRolesUsersQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  endBlockNumber?: Maybe<Scalars['Int']>;
}>;


export type RecoveryRolesUsersQuery = { recoveryRolesUsers: Array<(
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
  )> };

export type RecoveryRolesAndApprovalsForSessionQueryVariables = Exact<{
  blockNumber: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type RecoveryRolesAndApprovalsForSessionQuery = { recoveryRolesAndApprovalsForSession: Array<(
    Pick<UsersAndRecoveryApprovals, 'id' | 'approvedRecoveryExit'>
    & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
  )> };

export type GetRecoveryRequiredApprovalsQueryVariables = Exact<{
  blockNumber: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type GetRecoveryRequiredApprovalsQuery = Pick<Query, 'getRecoveryRequiredApprovals'>;

export type RecoveryAllEnteredEventsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type RecoveryAllEnteredEventsQuery = { recoveryAllEnteredEvents: Array<Pick<ParsedEvent, 'type' | 'name' | 'values' | 'createdAt' | 'emmitedBy' | 'blockNumber' | 'transactionHash'>> };

export type LegacyNumberOfRecoveryRolesQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type LegacyNumberOfRecoveryRolesQuery = Pick<Query, 'legacyNumberOfRecoveryRoles'>;

export type MotionStakesQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  userAddress: Scalars['String'];
  motionId: Scalars['Int'];
}>;


export type MotionStakesQuery = { motionStakes: Pick<MotionStakes, 'totalNAYStakes' | 'remainingToFullyYayStaked' | 'remainingToFullyNayStaked' | 'maxUserStake' | 'minUserStake'> };

export type MotionsSystemMessagesQueryVariables = Exact<{
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type MotionsSystemMessagesQuery = { motionsSystemMessages: Array<Pick<SystemMessage, 'type' | 'name' | 'createdAt'>> };

export type MotionVoterRewardQueryVariables = Exact<{
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
  userAddress: Scalars['String'];
}>;


export type MotionVoterRewardQuery = { motionVoterReward: Pick<MotionVoterReward, 'reward' | 'minReward' | 'maxReward'> };

export type MotionUserVoteRevealedQueryVariables = Exact<{
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
  userAddress: Scalars['String'];
}>;


export type MotionUserVoteRevealedQuery = { motionUserVoteRevealed: Pick<MotionVoteReveal, 'revealed' | 'vote'> };

export type MotionVoteResultsQueryVariables = Exact<{
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
  userAddress: Scalars['String'];
}>;


export type MotionVoteResultsQuery = { motionVoteResults: Pick<MotionVoteResults, 'currentUserVoteSide' | 'yayVotes' | 'yayVoters' | 'nayVotes' | 'nayVoters'> };

export type VotingStateQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  motionId: Scalars['Int'];
}>;


export type VotingStateQuery = { votingState: Pick<VotingState, 'thresholdValue' | 'totalVotedReputation' | 'skillRep'> };

export type MotionCurrentUserVotedQueryVariables = Exact<{
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
  userAddress: Scalars['String'];
}>;


export type MotionCurrentUserVotedQuery = Pick<Query, 'motionCurrentUserVoted'>;

export type MotionFinalizedQueryVariables = Exact<{
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type MotionFinalizedQuery = Pick<Query, 'motionFinalized'>;

export type MotionStakerRewardQueryVariables = Exact<{
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
  userAddress: Scalars['String'];
}>;


export type MotionStakerRewardQuery = { motionStakerReward: Pick<MotionStakerRewards, 'stakingRewardYay' | 'stakingRewardNay' | 'stakesYay' | 'stakesNay' | 'claimedReward'> };

export type StakeAmountsForMotionQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  userAddress: Scalars['String'];
  motionId: Scalars['Int'];
}>;


export type StakeAmountsForMotionQuery = { stakeAmountsForMotion: (
    Pick<StakeAmounts, 'requiredStake'>
    & { totalStaked: Pick<StakeSidesAmounts, 'YAY' | 'NAY'>, userStake: Pick<StakeSidesAmounts, 'YAY' | 'NAY'> }
  ) };

export type MotionObjectionAnnotationQueryVariables = Exact<{
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type MotionObjectionAnnotationQuery = { motionObjectionAnnotation: Pick<MotionObjectionAnnotation, 'address' | 'metadata'> };

export type MotionStatusQueryVariables = Exact<{
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type MotionStatusQuery = Pick<Query, 'motionStatus'>;

export type MotionTimeoutPeriodsQueryVariables = Exact<{
  motionId: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type MotionTimeoutPeriodsQuery = { motionTimeoutPeriods: Pick<MotionTimeoutPeriods, 'timeLeftToStake' | 'timeLeftToSubmit' | 'timeLeftToReveal' | 'timeLeftToEscalate'> };

export type SubgraphDomainsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type SubgraphDomainsQuery = { domains: Array<(
    Pick<SubgraphDomain, 'id' | 'domainChainId' | 'name' | 'colonyAddress' | 'metadata'>
    & { parent?: Maybe<Pick<SubgraphDomain, 'id' | 'domainChainId'>>, metadataHistory: Array<Maybe<Pick<SubgraphDomainMetadata, 'id' | 'metadata'>>> }
  )> };

export type SubgraphDomainMetadataQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  domainId: Scalars['Int'];
}>;


export type SubgraphDomainMetadataQuery = { domains: Array<(
    Pick<SubgraphDomain, 'id' | 'domainChainId' | 'metadata'>
    & { metadataHistory: Array<Maybe<(
      Pick<SubgraphDomainMetadata, 'id' | 'metadata'>
      & { transaction: (
        Pick<SubgraphTransaction, 'id'>
        & { block: Pick<SubgraphBlock, 'timestamp'> }
      ) }
    )>> }
  )> };

export type SubgraphSingleDomainQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  domainId: Scalars['Int'];
}>;


export type SubgraphSingleDomainQuery = { domains: Array<(
    Pick<SubgraphDomain, 'id' | 'domainChainId' | 'name' | 'colonyAddress' | 'metadata'>
    & { parent?: Maybe<Pick<SubgraphDomain, 'id' | 'domainChainId'>>, metadataHistory: Array<Maybe<Pick<SubgraphDomainMetadata, 'id' | 'metadata'>>> }
  )> };

export type ColonyNameQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ColonyNameQuery = Pick<Query, 'colonyName'>;

export type ColonyAddressQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type ColonyAddressQuery = Pick<Query, 'colonyAddress'>;

export type SubgraphColonyQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type SubgraphColonyQuery = { colony: (
    Pick<SubgraphColony, 'id' | 'colonyChainId' | 'ensName' | 'metadata'>
    & { metadataHistory: Array<Pick<SubgraphColonyMetadata, 'id' | 'metadata'>>, token: (
      Pick<SubgraphToken, 'decimals' | 'symbol'>
      & { tokenAddress: SubgraphToken['id'] }
    ), extensions?: Maybe<Array<(
      Pick<SubgraphColonyExtension, 'hash'>
      & { address: SubgraphColonyExtension['id'] }
    )>> }
  ) };

export type SubgraphColoniesQueryVariables = Exact<{
  colonyAddresses: Array<Scalars['String']>;
}>;


export type SubgraphColoniesQuery = { colonies: Array<(
    Pick<SubgraphColony, 'id' | 'colonyChainId' | 'ensName' | 'metadata'>
    & { metadataHistory: Array<Pick<SubgraphColonyMetadata, 'id' | 'metadata'>>, token: (
      Pick<SubgraphToken, 'decimals' | 'symbol'>
      & { tokenAddress: SubgraphToken['id'] }
    ) }
  )> };

export type SubgraphColonyMetadataQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type SubgraphColonyMetadataQuery = { colony: (
    Pick<SubgraphColony, 'id' | 'colonyChainId' | 'metadata'>
    & { metadataHistory: Array<(
      Pick<SubgraphColonyMetadata, 'id' | 'metadata'>
      & { transaction: (
        Pick<SubgraphTransaction, 'id'>
        & { block: Pick<SubgraphBlock, 'timestamp'> }
      ) }
    )> }
  ) };

export type ColonyFromNameQueryVariables = Exact<{
  name: Scalars['String'];
  address: Scalars['String'];
}>;


export type ColonyFromNameQuery = (
  Pick<Query, 'colonyAddress'>
  & { processedColony: FullColonyFragment }
);

export type ColonyDomainsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type ColonyDomainsQuery = { processedColony: (
    Pick<ProcessedColony, 'id'>
    & { domains: Array<DomainFieldsFragment> }
  ) };

export type ColonySingleDomainQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  domainId: Scalars['Int'];
}>;


export type ColonySingleDomainQuery = { colonyDomain: DomainFieldsFragment };

export type ProcessedColonyQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ProcessedColonyQuery = { processedColony: FullColonyFragment };

export type ColonyNativeTokenQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ColonyNativeTokenQuery = { processedColony: Pick<ProcessedColony, 'id' | 'nativeTokenAddress'> };

export type ColonyTransfersQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ColonyTransfersQuery = { processedColony: (
    Pick<ProcessedColony, 'id' | 'colonyAddress'>
    & { transfers: Array<Pick<Transfer, 'amount' | 'hash' | 'colonyAddress' | 'date' | 'from' | 'incoming' | 'to' | 'token'>>, unclaimedTransfers: Array<Pick<Transfer, 'amount' | 'hash' | 'colonyAddress' | 'date' | 'from' | 'incoming' | 'to' | 'token'>> }
  ) };

export type ColonyProfileQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ColonyProfileQuery = { processedColony: ColonyProfileFragment };

export type ColonyMembersWithReputationQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  domainId?: Maybe<Scalars['Int']>;
}>;


export type ColonyMembersWithReputationQuery = Pick<Query, 'colonyMembersWithReputation'>;

export type ColonyReputationQueryVariables = Exact<{
  address: Scalars['String'];
  domainId?: Maybe<Scalars['Int']>;
}>;


export type ColonyReputationQuery = Pick<Query, 'colonyReputation'>;

export type ColonyHistoricRolesQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  blockNumber: Scalars['Int'];
}>;


export type ColonyHistoricRolesQuery = { historicColonyRoles: Array<(
    Pick<ProcessedRoles, 'address'>
    & { domains: Array<Pick<ProcessedRoleDomain, 'domainId' | 'roles'>> }
  )> };

export type WhitelistAgreementQueryVariables = Exact<{
  agreementHash: Scalars['String'];
}>;


export type WhitelistAgreementQuery = Pick<Query, 'whitelistAgreement'>;

export type WhitelistAgreementHashQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type WhitelistAgreementHashQuery = Pick<Query, 'whitelistAgreementHash'>;

export type HasKycPolicyQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type HasKycPolicyQuery = Pick<Query, 'hasKycPolicy'>;

export type TransactionMessagesQueryVariables = Exact<{
  transactionHash: Scalars['String'];
}>;


export type TransactionMessagesQuery = { transactionMessages: (
    Pick<TransactionMessages, 'transactionHash'>
    & { messages: Array<TransactionMessageFragment> }
  ) };

export type TransactionMessagesCountQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type TransactionMessagesCountQuery = { transactionMessagesCount: { colonyTransactionMessages: Array<Pick<TransactionCount, 'transactionHash' | 'count'>> } };

export type ColonyExtensionsQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ColonyExtensionsQuery = { processedColony: (
    Pick<ProcessedColony, 'id' | 'colonyAddress'>
    & { installedExtensions: Array<(
      Pick<ColonyExtension, 'id' | 'extensionId' | 'address'>
      & { details: Pick<ColonyExtensionDetails, 'deprecated' | 'initialized' | 'installedBy' | 'installedAt' | 'missingPermissions' | 'version'> }
    )> }
  ) };

export type ColonyExtensionQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  extensionId: Scalars['String'];
}>;


export type ColonyExtensionQuery = { colonyExtension?: Maybe<(
    Pick<ColonyExtension, 'id' | 'address' | 'extensionId'>
    & { details: Pick<ColonyExtensionDetails, 'deprecated' | 'initialized' | 'installedBy' | 'installedAt' | 'missingPermissions' | 'version'> }
  )> };

export type NetworkExtensionVersionQueryVariables = Exact<{
  extensionId?: Maybe<Scalars['String']>;
}>;


export type NetworkExtensionVersionQuery = Pick<Query, 'networkExtensionVersion'>;

export type SubgraphExtensionVersionDeployedEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type SubgraphExtensionVersionDeployedEventsQuery = { extensionVersionDeployedEvents: Array<(
    Pick<SubgraphEvent, 'id' | 'address' | 'name' | 'args'>
    & { transaction: (
      Pick<SubgraphTransaction, 'id'>
      & { transactionHash: SubgraphTransaction['id'] }
      & { block: (
        Pick<SubgraphBlock, 'id' | 'timestamp'>
        & { number: SubgraphBlock['id'] }
      ) }
    ) }
  )> };

export type SubgraphExtensionEventsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  extensionAddress: Scalars['String'];
}>;


export type SubgraphExtensionEventsQuery = { extensionInstalledEvents: Array<(
    Pick<SubgraphEvent, 'id' | 'address' | 'name' | 'args'>
    & { transaction: (
      Pick<SubgraphTransaction, 'id'>
      & { transactionHash: SubgraphTransaction['id'] }
      & { block: (
        Pick<SubgraphBlock, 'id' | 'timestamp'>
        & { number: SubgraphBlock['id'] }
      ) }
    ) }
  )>, extensionInitialisedEvents: Array<(
    Pick<SubgraphEvent, 'id' | 'address' | 'name' | 'args'>
    & { transaction: (
      Pick<SubgraphTransaction, 'id'>
      & { transactionHash: SubgraphTransaction['id'] }
      & { block: (
        Pick<SubgraphBlock, 'id' | 'timestamp'>
        & { number: SubgraphBlock['id'] }
      ) }
    ) }
  )> };

export type ColonyMembersQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type ColonyMembersQuery = { subscribedUsers: Array<(
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
  )> };

export type SubgraphMotionEventsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  motionId: Scalars['String'];
}>;


export type SubgraphMotionEventsQuery = { motionEvents: Array<(
    Pick<SubgraphEvent, 'id' | 'address' | 'name' | 'args'>
    & { transaction: (
      Pick<SubgraphTransaction, 'id'>
      & { transactionHash: SubgraphTransaction['id'] }
      & { block: (
        Pick<SubgraphBlock, 'id' | 'timestamp'>
        & { number: SubgraphBlock['id'] }
      ) }
    ) }
  )> };

export type SubgraphMotionSystemEventsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  motionId: Scalars['String'];
}>;


export type SubgraphMotionSystemEventsQuery = { motionSystemEvents: Array<(
    Pick<SubgraphEvent, 'id' | 'address' | 'name' | 'args'>
    & { transaction: (
      Pick<SubgraphTransaction, 'id'>
      & { transactionHash: SubgraphTransaction['id'] }
      & { block: (
        Pick<SubgraphBlock, 'id' | 'timestamp'>
        & { number: SubgraphBlock['id'] }
      ) }
    ) }
  )> };

export type SubgraphMotionVoteSubmittedEventsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  motionId: Scalars['String'];
}>;


export type SubgraphMotionVoteSubmittedEventsQuery = { motionVoteSubmittedEvents: Array<(
    Pick<SubgraphEvent, 'id' | 'address' | 'name' | 'args'>
    & { transaction: (
      Pick<SubgraphTransaction, 'id'>
      & { transactionHash: SubgraphTransaction['id'] }
      & { block: (
        Pick<SubgraphBlock, 'id' | 'timestamp'>
        & { number: SubgraphBlock['id'] }
      ) }
    ) }
  )> };

export type SubgraphMotionVoteRevealedEventsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  motionId: Scalars['String'];
}>;


export type SubgraphMotionVoteRevealedEventsQuery = { motionVoteRevealedEvents: Array<(
    Pick<SubgraphEvent, 'id' | 'address' | 'name' | 'args'>
    & { transaction: (
      Pick<SubgraphTransaction, 'id'>
      & { transactionHash: SubgraphTransaction['id'] }
      & { block: (
        Pick<SubgraphBlock, 'id' | 'timestamp'>
        & { number: SubgraphBlock['id'] }
      ) }
    ) }
  )> };

export type SubgraphMotionStakedEventsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  motionId: Scalars['String'];
}>;


export type SubgraphMotionStakedEventsQuery = { motionStakedEvents: Array<(
    Pick<SubgraphEvent, 'id' | 'address' | 'name' | 'args'>
    & { transaction: (
      Pick<SubgraphTransaction, 'id'>
      & { transactionHash: SubgraphTransaction['id'] }
      & { block: (
        Pick<SubgraphBlock, 'id' | 'timestamp'>
        & { number: SubgraphBlock['id'] }
      ) }
    ) }
  )> };

export type SubgraphUserMotionStakedEventsQueryVariables = Exact<{
  walletAddress: Scalars['String'];
}>;


export type SubgraphUserMotionStakedEventsQuery = { motionStakedEvents: Array<(
    Pick<SubgraphEvent, 'id' | 'address' | 'name' | 'args'>
    & { transaction: (
      Pick<SubgraphTransaction, 'id'>
      & { transactionHash: SubgraphTransaction['id'] }
      & { block: (
        Pick<SubgraphBlock, 'id' | 'timestamp'>
        & { number: SubgraphBlock['id'] }
      ) }
    ) }
  )> };

export type SubgraphUserMotionRewardClaimedEventsQueryVariables = Exact<{
  walletAddress: Scalars['String'];
}>;


export type SubgraphUserMotionRewardClaimedEventsQuery = { motionRewardClaimedEvents: Array<(
    Pick<SubgraphEvent, 'id' | 'name' | 'args' | 'address'>
    & { transaction: (
      Pick<SubgraphTransaction, 'id'>
      & { transactionHash: SubgraphTransaction['id'] }
      & { block: (
        Pick<SubgraphBlock, 'id' | 'timestamp'>
        & { number: SubgraphBlock['id'] }
      ) }
    ) }
  )> };

export type SubgraphMotionRewardClaimedEventsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  motionId: Scalars['String'];
}>;


export type SubgraphMotionRewardClaimedEventsQuery = { motionRewardClaimedEvents: Array<(
    Pick<SubgraphEvent, 'id' | 'name' | 'args' | 'address'>
    & { transaction: (
      Pick<SubgraphTransaction, 'id'>
      & { transactionHash: SubgraphTransaction['id'] }
      & { block: (
        Pick<SubgraphBlock, 'id' | 'timestamp'>
        & { number: SubgraphBlock['id'] }
      ) }
    ) }
  )> };

export type SubgraphRoleEventsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type SubgraphRoleEventsQuery = { colonyRoleSetEvents: Array<(
    Pick<SubgraphEvent, 'id' | 'address' | 'name' | 'args'>
    & { transaction: (
      Pick<SubgraphTransaction, 'id'>
      & { transactionHash: SubgraphTransaction['id'] }
      & { block: (
        Pick<SubgraphBlock, 'id' | 'timestamp'>
        & { number: SubgraphBlock['id'] }
      ) }
    ) }
  )>, recoveryRoleSetEvents: Array<(
    Pick<SubgraphEvent, 'id' | 'address' | 'name' | 'args'>
    & { transaction: (
      Pick<SubgraphTransaction, 'id'>
      & { transactionHash: SubgraphTransaction['id'] }
      & { block: (
        Pick<SubgraphBlock, 'id' | 'timestamp'>
        & { number: SubgraphBlock['id'] }
      ) }
    ) }
  )> };

export type SubgraphColonyFundsClaimedEventsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type SubgraphColonyFundsClaimedEventsQuery = { colonyFundsClaimedEvents: Array<(
    Pick<SubgraphEvent, 'id' | 'name' | 'args' | 'address'>
    & { transaction: (
      Pick<SubgraphTransaction, 'id'>
      & { transactionHash: SubgraphTransaction['id'] }
      & { block: (
        Pick<SubgraphBlock, 'id' | 'timestamp'>
        & { number: SubgraphBlock['id'] }
      ) }
    ) }
  )> };

export type SubgraphPayoutClaimedEventsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type SubgraphPayoutClaimedEventsQuery = { payoutClaimedEvents: Array<(
    Pick<SubgraphEvent, 'id' | 'name' | 'args' | 'address'>
    & { transaction: (
      Pick<SubgraphTransaction, 'id'>
      & { transactionHash: SubgraphTransaction['id'] }
      & { block: (
        Pick<SubgraphBlock, 'id' | 'timestamp'>
        & { number: SubgraphBlock['id'] }
      ) }
    ) }
  )> };

export type SubgraphEventsSubscriptionVariables = Exact<{
  skip: Scalars['Int'];
  first: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type SubgraphEventsSubscription = { events: Array<(
    Pick<SubgraphEvent, 'id' | 'address' | 'name' | 'args'>
    & { associatedColony: (
      { colonyAddress: SubgraphColony['id'], id: SubgraphColony['colonyChainId'] }
      & { token: (
        Pick<SubgraphToken, 'decimals' | 'symbol'>
        & { address: SubgraphToken['id'] }
      ) }
    ), transaction: (
      { hash: SubgraphTransaction['id'] }
      & { block: Pick<SubgraphBlock, 'id' | 'timestamp'> }
    ) }
  )> };

export type SubgraphOneTxSubscriptionVariables = Exact<{
  skip: Scalars['Int'];
  first: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type SubgraphOneTxSubscription = { oneTxPayments: Array<(
    Pick<OneTxPayment, 'id' | 'agent'>
    & { transaction: (
      { hash: SubgraphTransaction['id'] }
      & { block: Pick<SubgraphBlock, 'id' | 'timestamp'> }
    ), payment: (
      Pick<SubgraphPayment, 'to'>
      & { domain: (
        Pick<SubgraphDomain, 'name'>
        & { ethDomainId: SubgraphDomain['domainChainId'] }
      ), fundingPot: { fundingPotPayouts: Array<(
          Pick<SubgraphFundingPotPayout, 'id' | 'amount'>
          & { token: (
            Pick<SubgraphToken, 'symbol' | 'decimals'>
            & { address: SubgraphToken['id'] }
          ) }
        )> } }
    ) }
  )> };

export type SubgraphEventsThatAreActionsSubscriptionVariables = Exact<{
  skip: Scalars['Int'];
  first: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type SubgraphEventsThatAreActionsSubscription = { events: Array<(
    Pick<SubgraphEvent, 'id' | 'address' | 'name' | 'args'>
    & { associatedColony: (
      { colonyAddress: SubgraphColony['id'], id: SubgraphColony['colonyChainId'] }
      & { token: (
        Pick<SubgraphToken, 'decimals' | 'symbol'>
        & { address: SubgraphToken['id'] }
      ) }
    ), transaction: (
      { hash: SubgraphTransaction['id'] }
      & { block: Pick<SubgraphBlock, 'id' | 'timestamp'> }
    ), processedValues: Pick<SugraphEventProcessedValues, 'agent' | 'who' | 'fromPot' | 'fromDomain' | 'toPot' | 'toDomain' | 'domainId' | 'amount' | 'token' | 'metadata' | 'user' | 'oldVersion' | 'newVersion' | 'storageSlot' | 'storageSlotValue'> }
  )> };

export type SubgraphMotionsSubscriptionVariables = Exact<{
  skip: Scalars['Int'];
  first: Scalars['Int'];
  colonyAddress: Scalars['String'];
  extensionAddress: Scalars['String'];
}>;


export type SubgraphMotionsSubscription = { motions: Array<(
    Pick<SubscriptionMotion, 'id' | 'fundamentalChainId' | 'extensionAddress' | 'agent' | 'stakes' | 'requiredStake' | 'escalated' | 'action' | 'state' | 'type'>
    & { associatedColony: (
      { colonyAddress: SubgraphColony['id'], id: SubgraphColony['colonyChainId'] }
      & { token: (
        Pick<SubgraphToken, 'decimals' | 'symbol'>
        & { address: SubgraphToken['id'] }
      ) }
    ), transaction: (
      { hash: SubgraphTransaction['id'] }
      & { block: Pick<SubgraphBlock, 'id' | 'timestamp'> }
    ), domain: (
      Pick<SubgraphDomain, 'name'>
      & { ethDomainId: SubgraphDomain['domainChainId'] }
    ), args: (
      Pick<SubscriptionMotionArguments, 'amount'>
      & { token: (
        Pick<SubgraphToken, 'symbol' | 'decimals'>
        & { address: SubgraphToken['id'] }
      ) }
    ), timeoutPeriods: Pick<MotionTimeoutPeriods, 'timeLeftToStake' | 'timeLeftToSubmit' | 'timeLeftToReveal' | 'timeLeftToEscalate'> }
  )> };

export type SubgraphAnnotationEventsQueryVariables = Exact<{
  transactionHash: Scalars['String'];
}>;


export type SubgraphAnnotationEventsQuery = { annotationEvents: Array<(
    Pick<SubgraphEvent, 'id' | 'address' | 'name' | 'args'>
    & { transaction: (
      Pick<SubgraphTransaction, 'id'>
      & { transactionHash: SubgraphTransaction['id'] }
      & { block: (
        Pick<SubgraphBlock, 'id' | 'timestamp'>
        & { number: SubgraphBlock['id'] }
      ) }
    ) }
  )> };

export type CommentCountSubscriptionVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type CommentCountSubscription = { transactionMessagesCount: { colonyTransactionMessages: Array<Pick<TransactionCount, 'transactionHash' | 'count'>> } };

export type CommentsSubscriptionVariables = Exact<{
  transactionHash: Scalars['String'];
}>;


export type CommentsSubscription = { transactionMessages: (
    Pick<TransactionMessages, 'transactionHash'>
    & { messages: Array<TransactionMessageFragment> }
  ) };

export type MembersSubscriptionVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type MembersSubscription = { subscribedUsers: Array<(
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
  )> };

export const ColonyProfileFragmentDoc = gql`
    fragment ColonyProfile on ProcessedColony {
  id
  colonyAddress
  colonyName
  displayName
  avatarHash
  avatarURL
  extensionAddresses
}
    `;
export const TokensFragmentDoc = gql`
    fragment Tokens on ProcessedColony {
  nativeTokenAddress
  tokenAddresses
  tokens @client {
    id
    address
    iconHash
    decimals
    name
    symbol
    processedBalances(colonyAddress: $address) {
      domainId
      amount
    }
  }
}
    `;
export const DomainFieldsFragmentDoc = gql`
    fragment DomainFields on ProcessedDomain {
  id
  color
  description
  ethDomainId
  name
  ethParentDomainId
}
    `;
export const FullColonyFragmentDoc = gql`
    fragment FullColony on ProcessedColony {
  ...ColonyProfile
  ...Tokens
  domains @client {
    ...DomainFields
  }
  roles @client {
    address
    domains {
      domainId
      roles
    }
  }
  version @client
  canMintNativeToken @client
  canUnlockNativeToken @client
  isInRecoveryMode @client
  isNativeTokenLocked @client
  isDeploymentFinished @client
}
    ${ColonyProfileFragmentDoc}
${TokensFragmentDoc}
${DomainFieldsFragmentDoc}`;
export const EventContextFragmentDoc = gql`
    fragment EventContext on Event {
  context {
    ... on CreateDomainEvent {
      type
      ethDomainId
      colonyAddress
    }
  }
}
    `;
export const FullNetworkEventFragmentDoc = gql`
    fragment FullNetworkEvent on NetworkEvent {
  fromAddress
  toAddress
  createdAt
  name
  hash
  topic
  userAddress
  domainId
}
    `;
export const EventFieldsFragmentDoc = gql`
    fragment EventFields on Event {
  createdAt
  initiator {
    id
    profile {
      avatarHash
      displayName
      username
      walletAddress
    }
  }
  initiatorAddress
  sourceId
  sourceType
  type
}
    `;
export const TransactionEventContextFragmentDoc = gql`
    fragment TransactionEventContext on Event {
  context {
    ... on TransactionMessageEvent {
      type
      transactionHash
      message
      colonyAddress
    }
  }
}
    `;
export const TransactionMessageFragmentDoc = gql`
    fragment TransactionMessage on Event {
  ...EventFields
  ...TransactionEventContext
}
    ${EventFieldsFragmentDoc}
${TransactionEventContextFragmentDoc}`;
export const SetLoggedInUserDocument = gql`
    mutation SetLoggedInUser($input: LoggedInUserInput!) {
  setLoggedInUser(input: $input) @client {
    id
  }
}
    `;
export type SetLoggedInUserMutationFn = Apollo.MutationFunction<SetLoggedInUserMutation, SetLoggedInUserMutationVariables>;

/**
 * __useSetLoggedInUserMutation__
 *
 * To run a mutation, you first call `useSetLoggedInUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetLoggedInUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setLoggedInUserMutation, { data, loading, error }] = useSetLoggedInUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetLoggedInUserMutation(baseOptions?: Apollo.MutationHookOptions<SetLoggedInUserMutation, SetLoggedInUserMutationVariables>) {
        return Apollo.useMutation<SetLoggedInUserMutation, SetLoggedInUserMutationVariables>(SetLoggedInUserDocument, baseOptions);
      }
export type SetLoggedInUserMutationHookResult = ReturnType<typeof useSetLoggedInUserMutation>;
export type SetLoggedInUserMutationResult = Apollo.MutationResult<SetLoggedInUserMutation>;
export type SetLoggedInUserMutationOptions = Apollo.BaseMutationOptions<SetLoggedInUserMutation, SetLoggedInUserMutationVariables>;
export const ClearLoggedInUserDocument = gql`
    mutation ClearLoggedInUser {
  clearLoggedInUser @client {
    id
  }
}
    `;
export type ClearLoggedInUserMutationFn = Apollo.MutationFunction<ClearLoggedInUserMutation, ClearLoggedInUserMutationVariables>;

/**
 * __useClearLoggedInUserMutation__
 *
 * To run a mutation, you first call `useClearLoggedInUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClearLoggedInUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [clearLoggedInUserMutation, { data, loading, error }] = useClearLoggedInUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useClearLoggedInUserMutation(baseOptions?: Apollo.MutationHookOptions<ClearLoggedInUserMutation, ClearLoggedInUserMutationVariables>) {
        return Apollo.useMutation<ClearLoggedInUserMutation, ClearLoggedInUserMutationVariables>(ClearLoggedInUserDocument, baseOptions);
      }
export type ClearLoggedInUserMutationHookResult = ReturnType<typeof useClearLoggedInUserMutation>;
export type ClearLoggedInUserMutationResult = Apollo.MutationResult<ClearLoggedInUserMutation>;
export type ClearLoggedInUserMutationOptions = Apollo.BaseMutationOptions<ClearLoggedInUserMutation, ClearLoggedInUserMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($createUserInput: CreateUserInput!, $loggedInUserInput: LoggedInUserInput!) {
  createUser(input: $createUserInput) {
    id
  }
  setLoggedInUser(input: $loggedInUserInput) @client {
    id
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      createUserInput: // value for 'createUserInput'
 *      loggedInUserInput: // value for 'loggedInUserInput'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, baseOptions);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const EditUserDocument = gql`
    mutation EditUser($input: EditUserInput!) {
  editUser(input: $input) {
    id
    profile {
      avatarHash
      bio
      displayName
      location
      website
    }
  }
}
    `;
export type EditUserMutationFn = Apollo.MutationFunction<EditUserMutation, EditUserMutationVariables>;

/**
 * __useEditUserMutation__
 *
 * To run a mutation, you first call `useEditUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editUserMutation, { data, loading, error }] = useEditUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditUserMutation(baseOptions?: Apollo.MutationHookOptions<EditUserMutation, EditUserMutationVariables>) {
        return Apollo.useMutation<EditUserMutation, EditUserMutationVariables>(EditUserDocument, baseOptions);
      }
export type EditUserMutationHookResult = ReturnType<typeof useEditUserMutation>;
export type EditUserMutationResult = Apollo.MutationResult<EditUserMutation>;
export type EditUserMutationOptions = Apollo.BaseMutationOptions<EditUserMutation, EditUserMutationVariables>;
export const SetUserTokensDocument = gql`
    mutation SetUserTokens($input: SetUserTokensInput!) {
  setUserTokens(input: $input) {
    id
    tokenAddresses
  }
}
    `;
export type SetUserTokensMutationFn = Apollo.MutationFunction<SetUserTokensMutation, SetUserTokensMutationVariables>;

/**
 * __useSetUserTokensMutation__
 *
 * To run a mutation, you first call `useSetUserTokensMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetUserTokensMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setUserTokensMutation, { data, loading, error }] = useSetUserTokensMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetUserTokensMutation(baseOptions?: Apollo.MutationHookOptions<SetUserTokensMutation, SetUserTokensMutationVariables>) {
        return Apollo.useMutation<SetUserTokensMutation, SetUserTokensMutationVariables>(SetUserTokensDocument, baseOptions);
      }
export type SetUserTokensMutationHookResult = ReturnType<typeof useSetUserTokensMutation>;
export type SetUserTokensMutationResult = Apollo.MutationResult<SetUserTokensMutation>;
export type SetUserTokensMutationOptions = Apollo.BaseMutationOptions<SetUserTokensMutation, SetUserTokensMutationVariables>;
export const MarkNotificationAsReadDocument = gql`
    mutation MarkNotificationAsRead($input: MarkNotificationAsReadInput!) {
  markNotificationAsRead(input: $input)
}
    `;
export type MarkNotificationAsReadMutationFn = Apollo.MutationFunction<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>;

/**
 * __useMarkNotificationAsReadMutation__
 *
 * To run a mutation, you first call `useMarkNotificationAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkNotificationAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markNotificationAsReadMutation, { data, loading, error }] = useMarkNotificationAsReadMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMarkNotificationAsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>) {
        return Apollo.useMutation<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>(MarkNotificationAsReadDocument, baseOptions);
      }
export type MarkNotificationAsReadMutationHookResult = ReturnType<typeof useMarkNotificationAsReadMutation>;
export type MarkNotificationAsReadMutationResult = Apollo.MutationResult<MarkNotificationAsReadMutation>;
export type MarkNotificationAsReadMutationOptions = Apollo.BaseMutationOptions<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>;
export const MarkAllNotificationsAsReadDocument = gql`
    mutation MarkAllNotificationsAsRead {
  markAllNotificationsAsRead
}
    `;
export type MarkAllNotificationsAsReadMutationFn = Apollo.MutationFunction<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>;

/**
 * __useMarkAllNotificationsAsReadMutation__
 *
 * To run a mutation, you first call `useMarkAllNotificationsAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkAllNotificationsAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markAllNotificationsAsReadMutation, { data, loading, error }] = useMarkAllNotificationsAsReadMutation({
 *   variables: {
 *   },
 * });
 */
export function useMarkAllNotificationsAsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>) {
        return Apollo.useMutation<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>(MarkAllNotificationsAsReadDocument, baseOptions);
      }
export type MarkAllNotificationsAsReadMutationHookResult = ReturnType<typeof useMarkAllNotificationsAsReadMutation>;
export type MarkAllNotificationsAsReadMutationResult = Apollo.MutationResult<MarkAllNotificationsAsReadMutation>;
export type MarkAllNotificationsAsReadMutationOptions = Apollo.BaseMutationOptions<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>;
export const SubscribeToColonyDocument = gql`
    mutation SubscribeToColony($input: SubscribeToColonyInput!) {
  subscribeToColony(input: $input) {
    id
    colonyAddresses
  }
}
    `;
export type SubscribeToColonyMutationFn = Apollo.MutationFunction<SubscribeToColonyMutation, SubscribeToColonyMutationVariables>;

/**
 * __useSubscribeToColonyMutation__
 *
 * To run a mutation, you first call `useSubscribeToColonyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToColonyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [subscribeToColonyMutation, { data, loading, error }] = useSubscribeToColonyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSubscribeToColonyMutation(baseOptions?: Apollo.MutationHookOptions<SubscribeToColonyMutation, SubscribeToColonyMutationVariables>) {
        return Apollo.useMutation<SubscribeToColonyMutation, SubscribeToColonyMutationVariables>(SubscribeToColonyDocument, baseOptions);
      }
export type SubscribeToColonyMutationHookResult = ReturnType<typeof useSubscribeToColonyMutation>;
export type SubscribeToColonyMutationResult = Apollo.MutationResult<SubscribeToColonyMutation>;
export type SubscribeToColonyMutationOptions = Apollo.BaseMutationOptions<SubscribeToColonyMutation, SubscribeToColonyMutationVariables>;
export const UnsubscribeFromColonyDocument = gql`
    mutation UnsubscribeFromColony($input: UnsubscribeFromColonyInput!) {
  unsubscribeFromColony(input: $input) {
    id
    colonyAddresses
  }
}
    `;
export type UnsubscribeFromColonyMutationFn = Apollo.MutationFunction<UnsubscribeFromColonyMutation, UnsubscribeFromColonyMutationVariables>;

/**
 * __useUnsubscribeFromColonyMutation__
 *
 * To run a mutation, you first call `useUnsubscribeFromColonyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnsubscribeFromColonyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unsubscribeFromColonyMutation, { data, loading, error }] = useUnsubscribeFromColonyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUnsubscribeFromColonyMutation(baseOptions?: Apollo.MutationHookOptions<UnsubscribeFromColonyMutation, UnsubscribeFromColonyMutationVariables>) {
        return Apollo.useMutation<UnsubscribeFromColonyMutation, UnsubscribeFromColonyMutationVariables>(UnsubscribeFromColonyDocument, baseOptions);
      }
export type UnsubscribeFromColonyMutationHookResult = ReturnType<typeof useUnsubscribeFromColonyMutation>;
export type UnsubscribeFromColonyMutationResult = Apollo.MutationResult<UnsubscribeFromColonyMutation>;
export type UnsubscribeFromColonyMutationOptions = Apollo.BaseMutationOptions<UnsubscribeFromColonyMutation, UnsubscribeFromColonyMutationVariables>;
export const SendTransactionMessageDocument = gql`
    mutation SendTransactionMessage($input: SendTransactionMessageInput!) {
  sendTransactionMessage(input: $input)
}
    `;
export type SendTransactionMessageMutationFn = Apollo.MutationFunction<SendTransactionMessageMutation, SendTransactionMessageMutationVariables>;

/**
 * __useSendTransactionMessageMutation__
 *
 * To run a mutation, you first call `useSendTransactionMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendTransactionMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendTransactionMessageMutation, { data, loading, error }] = useSendTransactionMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendTransactionMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendTransactionMessageMutation, SendTransactionMessageMutationVariables>) {
        return Apollo.useMutation<SendTransactionMessageMutation, SendTransactionMessageMutationVariables>(SendTransactionMessageDocument, baseOptions);
      }
export type SendTransactionMessageMutationHookResult = ReturnType<typeof useSendTransactionMessageMutation>;
export type SendTransactionMessageMutationResult = Apollo.MutationResult<SendTransactionMessageMutation>;
export type SendTransactionMessageMutationOptions = Apollo.BaseMutationOptions<SendTransactionMessageMutation, SendTransactionMessageMutationVariables>;
export const UpdateNetworkContractsDocument = gql`
    mutation UpdateNetworkContracts {
  updateNetworkContracts @client {
    version
    feeInverse
  }
}
    `;
export type UpdateNetworkContractsMutationFn = Apollo.MutationFunction<UpdateNetworkContractsMutation, UpdateNetworkContractsMutationVariables>;

/**
 * __useUpdateNetworkContractsMutation__
 *
 * To run a mutation, you first call `useUpdateNetworkContractsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNetworkContractsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNetworkContractsMutation, { data, loading, error }] = useUpdateNetworkContractsMutation({
 *   variables: {
 *   },
 * });
 */
export function useUpdateNetworkContractsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNetworkContractsMutation, UpdateNetworkContractsMutationVariables>) {
        return Apollo.useMutation<UpdateNetworkContractsMutation, UpdateNetworkContractsMutationVariables>(UpdateNetworkContractsDocument, baseOptions);
      }
export type UpdateNetworkContractsMutationHookResult = ReturnType<typeof useUpdateNetworkContractsMutation>;
export type UpdateNetworkContractsMutationResult = Apollo.MutationResult<UpdateNetworkContractsMutation>;
export type UpdateNetworkContractsMutationOptions = Apollo.BaseMutationOptions<UpdateNetworkContractsMutation, UpdateNetworkContractsMutationVariables>;
export const LoggedInUserDocument = gql`
    query LoggedInUser {
  loggedInUser @client {
    walletAddress
    balance
    username
    ethereal
    networkId
  }
}
    `;

/**
 * __useLoggedInUserQuery__
 *
 * To run a query within a React component, call `useLoggedInUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoggedInUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoggedInUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useLoggedInUserQuery(baseOptions?: Apollo.QueryHookOptions<LoggedInUserQuery, LoggedInUserQueryVariables>) {
        return Apollo.useQuery<LoggedInUserQuery, LoggedInUserQueryVariables>(LoggedInUserDocument, baseOptions);
      }
export function useLoggedInUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoggedInUserQuery, LoggedInUserQueryVariables>) {
          return Apollo.useLazyQuery<LoggedInUserQuery, LoggedInUserQueryVariables>(LoggedInUserDocument, baseOptions);
        }
export type LoggedInUserQueryHookResult = ReturnType<typeof useLoggedInUserQuery>;
export type LoggedInUserLazyQueryHookResult = ReturnType<typeof useLoggedInUserLazyQuery>;
export type LoggedInUserQueryResult = Apollo.QueryResult<LoggedInUserQuery, LoggedInUserQueryVariables>;
export const UserDocument = gql`
    query User($address: String!) {
  user(address: $address) {
    id
    profile {
      username
      walletAddress
      displayName
      bio
      location
      website
      avatarHash
    }
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useUserQuery(baseOptions?: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UserWithReputationDocument = gql`
    query UserWithReputation($address: String!, $colonyAddress: String!, $domainId: Int) {
  user(address: $address) {
    id
    profile {
      username
      walletAddress
      displayName
      bio
      location
      website
      avatarHash
    }
    reputation(colonyAddress: $colonyAddress, domainId: $domainId) @client
  }
}
    `;

/**
 * __useUserWithReputationQuery__
 *
 * To run a query within a React component, call `useUserWithReputationQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserWithReputationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserWithReputationQuery({
 *   variables: {
 *      address: // value for 'address'
 *      colonyAddress: // value for 'colonyAddress'
 *      domainId: // value for 'domainId'
 *   },
 * });
 */
export function useUserWithReputationQuery(baseOptions?: Apollo.QueryHookOptions<UserWithReputationQuery, UserWithReputationQueryVariables>) {
        return Apollo.useQuery<UserWithReputationQuery, UserWithReputationQueryVariables>(UserWithReputationDocument, baseOptions);
      }
export function useUserWithReputationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserWithReputationQuery, UserWithReputationQueryVariables>) {
          return Apollo.useLazyQuery<UserWithReputationQuery, UserWithReputationQueryVariables>(UserWithReputationDocument, baseOptions);
        }
export type UserWithReputationQueryHookResult = ReturnType<typeof useUserWithReputationQuery>;
export type UserWithReputationLazyQueryHookResult = ReturnType<typeof useUserWithReputationLazyQuery>;
export type UserWithReputationQueryResult = Apollo.QueryResult<UserWithReputationQuery, UserWithReputationQueryVariables>;
export const UserReputationDocument = gql`
    query UserReputation($address: String!, $colonyAddress: String!, $domainId: Int, $rootHash: String) {
  userReputation(address: $address, colonyAddress: $colonyAddress, domainId: $domainId, rootHash: $rootHash) @client
}
    `;

/**
 * __useUserReputationQuery__
 *
 * To run a query within a React component, call `useUserReputationQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserReputationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserReputationQuery({
 *   variables: {
 *      address: // value for 'address'
 *      colonyAddress: // value for 'colonyAddress'
 *      domainId: // value for 'domainId'
 *      rootHash: // value for 'rootHash'
 *   },
 * });
 */
export function useUserReputationQuery(baseOptions?: Apollo.QueryHookOptions<UserReputationQuery, UserReputationQueryVariables>) {
        return Apollo.useQuery<UserReputationQuery, UserReputationQueryVariables>(UserReputationDocument, baseOptions);
      }
export function useUserReputationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserReputationQuery, UserReputationQueryVariables>) {
          return Apollo.useLazyQuery<UserReputationQuery, UserReputationQueryVariables>(UserReputationDocument, baseOptions);
        }
export type UserReputationQueryHookResult = ReturnType<typeof useUserReputationQuery>;
export type UserReputationLazyQueryHookResult = ReturnType<typeof useUserReputationLazyQuery>;
export type UserReputationQueryResult = Apollo.QueryResult<UserReputationQuery, UserReputationQueryVariables>;
export const UserReputationForTopDomainsDocument = gql`
    query UserReputationForTopDomains($address: String!, $colonyAddress: String!) {
  userReputationForTopDomains(address: $address, colonyAddress: $colonyAddress) @client {
    domainId
    reputationPercentage
  }
}
    `;

/**
 * __useUserReputationForTopDomainsQuery__
 *
 * To run a query within a React component, call `useUserReputationForTopDomainsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserReputationForTopDomainsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserReputationForTopDomainsQuery({
 *   variables: {
 *      address: // value for 'address'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useUserReputationForTopDomainsQuery(baseOptions?: Apollo.QueryHookOptions<UserReputationForTopDomainsQuery, UserReputationForTopDomainsQueryVariables>) {
        return Apollo.useQuery<UserReputationForTopDomainsQuery, UserReputationForTopDomainsQueryVariables>(UserReputationForTopDomainsDocument, baseOptions);
      }
export function useUserReputationForTopDomainsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserReputationForTopDomainsQuery, UserReputationForTopDomainsQueryVariables>) {
          return Apollo.useLazyQuery<UserReputationForTopDomainsQuery, UserReputationForTopDomainsQueryVariables>(UserReputationForTopDomainsDocument, baseOptions);
        }
export type UserReputationForTopDomainsQueryHookResult = ReturnType<typeof useUserReputationForTopDomainsQuery>;
export type UserReputationForTopDomainsLazyQueryHookResult = ReturnType<typeof useUserReputationForTopDomainsLazyQuery>;
export type UserReputationForTopDomainsQueryResult = Apollo.QueryResult<UserReputationForTopDomainsQuery, UserReputationForTopDomainsQueryVariables>;
export const UserTokensDocument = gql`
    query UserTokens($address: String!) {
  user(address: $address) {
    id
    tokenAddresses
    tokens(walletAddress: $address) @client {
      id
      address
      iconHash
      decimals
      name
      symbol
      balance
    }
  }
}
    `;

/**
 * __useUserTokensQuery__
 *
 * To run a query within a React component, call `useUserTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserTokensQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useUserTokensQuery(baseOptions?: Apollo.QueryHookOptions<UserTokensQuery, UserTokensQueryVariables>) {
        return Apollo.useQuery<UserTokensQuery, UserTokensQueryVariables>(UserTokensDocument, baseOptions);
      }
export function useUserTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserTokensQuery, UserTokensQueryVariables>) {
          return Apollo.useLazyQuery<UserTokensQuery, UserTokensQueryVariables>(UserTokensDocument, baseOptions);
        }
export type UserTokensQueryHookResult = ReturnType<typeof useUserTokensQuery>;
export type UserTokensLazyQueryHookResult = ReturnType<typeof useUserTokensLazyQuery>;
export type UserTokensQueryResult = Apollo.QueryResult<UserTokensQuery, UserTokensQueryVariables>;
export const UserBalanceWithLockDocument = gql`
    query UserBalanceWithLock($address: String!, $tokenAddress: String!, $colonyAddress: String!) {
  user(address: $address) {
    id
    userLock(walletAddress: $address, tokenAddress: $tokenAddress, colonyAddress: $colonyAddress) @client {
      balance
      nativeToken {
        decimals
        name
        symbol
        balance
        address
        verified
      }
      totalObligation
      pendingBalance
      activeTokens
    }
  }
}
    `;

/**
 * __useUserBalanceWithLockQuery__
 *
 * To run a query within a React component, call `useUserBalanceWithLockQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserBalanceWithLockQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserBalanceWithLockQuery({
 *   variables: {
 *      address: // value for 'address'
 *      tokenAddress: // value for 'tokenAddress'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useUserBalanceWithLockQuery(baseOptions?: Apollo.QueryHookOptions<UserBalanceWithLockQuery, UserBalanceWithLockQueryVariables>) {
        return Apollo.useQuery<UserBalanceWithLockQuery, UserBalanceWithLockQueryVariables>(UserBalanceWithLockDocument, baseOptions);
      }
export function useUserBalanceWithLockLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserBalanceWithLockQuery, UserBalanceWithLockQueryVariables>) {
          return Apollo.useLazyQuery<UserBalanceWithLockQuery, UserBalanceWithLockQueryVariables>(UserBalanceWithLockDocument, baseOptions);
        }
export type UserBalanceWithLockQueryHookResult = ReturnType<typeof useUserBalanceWithLockQuery>;
export type UserBalanceWithLockLazyQueryHookResult = ReturnType<typeof useUserBalanceWithLockLazyQuery>;
export type UserBalanceWithLockQueryResult = Apollo.QueryResult<UserBalanceWithLockQuery, UserBalanceWithLockQueryVariables>;
export const UsernameDocument = gql`
    query Username($address: String!) {
  username(address: $address) @client
}
    `;

/**
 * __useUsernameQuery__
 *
 * To run a query within a React component, call `useUsernameQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsernameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsernameQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useUsernameQuery(baseOptions?: Apollo.QueryHookOptions<UsernameQuery, UsernameQueryVariables>) {
        return Apollo.useQuery<UsernameQuery, UsernameQueryVariables>(UsernameDocument, baseOptions);
      }
export function useUsernameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsernameQuery, UsernameQueryVariables>) {
          return Apollo.useLazyQuery<UsernameQuery, UsernameQueryVariables>(UsernameDocument, baseOptions);
        }
export type UsernameQueryHookResult = ReturnType<typeof useUsernameQuery>;
export type UsernameLazyQueryHookResult = ReturnType<typeof useUsernameLazyQuery>;
export type UsernameQueryResult = Apollo.QueryResult<UsernameQuery, UsernameQueryVariables>;
export const UserAddressDocument = gql`
    query UserAddress($name: String!) {
  userAddress(name: $name) @client
}
    `;

/**
 * __useUserAddressQuery__
 *
 * To run a query within a React component, call `useUserAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserAddressQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUserAddressQuery(baseOptions?: Apollo.QueryHookOptions<UserAddressQuery, UserAddressQueryVariables>) {
        return Apollo.useQuery<UserAddressQuery, UserAddressQueryVariables>(UserAddressDocument, baseOptions);
      }
export function useUserAddressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserAddressQuery, UserAddressQueryVariables>) {
          return Apollo.useLazyQuery<UserAddressQuery, UserAddressQueryVariables>(UserAddressDocument, baseOptions);
        }
export type UserAddressQueryHookResult = ReturnType<typeof useUserAddressQuery>;
export type UserAddressLazyQueryHookResult = ReturnType<typeof useUserAddressLazyQuery>;
export type UserAddressQueryResult = Apollo.QueryResult<UserAddressQuery, UserAddressQueryVariables>;
export const WhitelistedUsersDocument = gql`
    query WhitelistedUsers($colonyAddress: String!) {
  whitelistedUsers(colonyAddress: $colonyAddress) @client {
    id
    profile {
      walletAddress
    }
  }
}
    `;

/**
 * __useWhitelistedUsersQuery__
 *
 * To run a query within a React component, call `useWhitelistedUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useWhitelistedUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWhitelistedUsersQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useWhitelistedUsersQuery(baseOptions?: Apollo.QueryHookOptions<WhitelistedUsersQuery, WhitelistedUsersQueryVariables>) {
        return Apollo.useQuery<WhitelistedUsersQuery, WhitelistedUsersQueryVariables>(WhitelistedUsersDocument, baseOptions);
      }
export function useWhitelistedUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WhitelistedUsersQuery, WhitelistedUsersQueryVariables>) {
          return Apollo.useLazyQuery<WhitelistedUsersQuery, WhitelistedUsersQueryVariables>(WhitelistedUsersDocument, baseOptions);
        }
export type WhitelistedUsersQueryHookResult = ReturnType<typeof useWhitelistedUsersQuery>;
export type WhitelistedUsersLazyQueryHookResult = ReturnType<typeof useWhitelistedUsersLazyQuery>;
export type WhitelistedUsersQueryResult = Apollo.QueryResult<WhitelistedUsersQuery, WhitelistedUsersQueryVariables>;
export const TokenBalancesForDomainsDocument = gql`
    query TokenBalancesForDomains($colonyAddress: String!, $tokenAddresses: [String!]!, $domainIds: [Int!]) {
  tokens(addresses: $tokenAddresses) @client {
    id
    address
    iconHash
    decimals
    name
    symbol
    balances(colonyAddress: $colonyAddress, domainIds: $domainIds) {
      domainId
      amount
    }
  }
}
    `;

/**
 * __useTokenBalancesForDomainsQuery__
 *
 * To run a query within a React component, call `useTokenBalancesForDomainsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenBalancesForDomainsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenBalancesForDomainsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      tokenAddresses: // value for 'tokenAddresses'
 *      domainIds: // value for 'domainIds'
 *   },
 * });
 */
export function useTokenBalancesForDomainsQuery(baseOptions?: Apollo.QueryHookOptions<TokenBalancesForDomainsQuery, TokenBalancesForDomainsQueryVariables>) {
        return Apollo.useQuery<TokenBalancesForDomainsQuery, TokenBalancesForDomainsQueryVariables>(TokenBalancesForDomainsDocument, baseOptions);
      }
export function useTokenBalancesForDomainsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenBalancesForDomainsQuery, TokenBalancesForDomainsQueryVariables>) {
          return Apollo.useLazyQuery<TokenBalancesForDomainsQuery, TokenBalancesForDomainsQueryVariables>(TokenBalancesForDomainsDocument, baseOptions);
        }
export type TokenBalancesForDomainsQueryHookResult = ReturnType<typeof useTokenBalancesForDomainsQuery>;
export type TokenBalancesForDomainsLazyQueryHookResult = ReturnType<typeof useTokenBalancesForDomainsLazyQuery>;
export type TokenBalancesForDomainsQueryResult = Apollo.QueryResult<TokenBalancesForDomainsQuery, TokenBalancesForDomainsQueryVariables>;
export const DomainBalanceDocument = gql`
    query DomainBalance($colonyAddress: String!, $tokenAddress: String!, $domainId: Int!) {
  domainBalance(colonyAddress: $colonyAddress, tokenAddress: $tokenAddress, domainId: $domainId) @client
}
    `;

/**
 * __useDomainBalanceQuery__
 *
 * To run a query within a React component, call `useDomainBalanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useDomainBalanceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDomainBalanceQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      tokenAddress: // value for 'tokenAddress'
 *      domainId: // value for 'domainId'
 *   },
 * });
 */
export function useDomainBalanceQuery(baseOptions?: Apollo.QueryHookOptions<DomainBalanceQuery, DomainBalanceQueryVariables>) {
        return Apollo.useQuery<DomainBalanceQuery, DomainBalanceQueryVariables>(DomainBalanceDocument, baseOptions);
      }
export function useDomainBalanceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DomainBalanceQuery, DomainBalanceQueryVariables>) {
          return Apollo.useLazyQuery<DomainBalanceQuery, DomainBalanceQueryVariables>(DomainBalanceDocument, baseOptions);
        }
export type DomainBalanceQueryHookResult = ReturnType<typeof useDomainBalanceQuery>;
export type DomainBalanceLazyQueryHookResult = ReturnType<typeof useDomainBalanceLazyQuery>;
export type DomainBalanceQueryResult = Apollo.QueryResult<DomainBalanceQuery, DomainBalanceQueryVariables>;
export const UserColoniesDocument = gql`
    query UserColonies($address: String!) {
  user(address: $address) {
    id
    processedColonies @client {
      id
      avatarHash
      avatarURL
      colonyAddress
      colonyName
      displayName
    }
    colonyAddresses
  }
}
    `;

/**
 * __useUserColoniesQuery__
 *
 * To run a query within a React component, call `useUserColoniesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserColoniesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserColoniesQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useUserColoniesQuery(baseOptions?: Apollo.QueryHookOptions<UserColoniesQuery, UserColoniesQueryVariables>) {
        return Apollo.useQuery<UserColoniesQuery, UserColoniesQueryVariables>(UserColoniesDocument, baseOptions);
      }
export function useUserColoniesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserColoniesQuery, UserColoniesQueryVariables>) {
          return Apollo.useLazyQuery<UserColoniesQuery, UserColoniesQueryVariables>(UserColoniesDocument, baseOptions);
        }
export type UserColoniesQueryHookResult = ReturnType<typeof useUserColoniesQuery>;
export type UserColoniesLazyQueryHookResult = ReturnType<typeof useUserColoniesLazyQuery>;
export type UserColoniesQueryResult = Apollo.QueryResult<UserColoniesQuery, UserColoniesQueryVariables>;
export const UserColonyAddressesDocument = gql`
    query UserColonyAddresses($address: String!) {
  user(address: $address) {
    id
    colonyAddresses
  }
}
    `;

/**
 * __useUserColonyAddressesQuery__
 *
 * To run a query within a React component, call `useUserColonyAddressesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserColonyAddressesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserColonyAddressesQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useUserColonyAddressesQuery(baseOptions?: Apollo.QueryHookOptions<UserColonyAddressesQuery, UserColonyAddressesQueryVariables>) {
        return Apollo.useQuery<UserColonyAddressesQuery, UserColonyAddressesQueryVariables>(UserColonyAddressesDocument, baseOptions);
      }
export function useUserColonyAddressesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserColonyAddressesQuery, UserColonyAddressesQueryVariables>) {
          return Apollo.useLazyQuery<UserColonyAddressesQuery, UserColonyAddressesQueryVariables>(UserColonyAddressesDocument, baseOptions);
        }
export type UserColonyAddressesQueryHookResult = ReturnType<typeof useUserColonyAddressesQuery>;
export type UserColonyAddressesLazyQueryHookResult = ReturnType<typeof useUserColonyAddressesLazyQuery>;
export type UserColonyAddressesQueryResult = Apollo.QueryResult<UserColonyAddressesQuery, UserColonyAddressesQueryVariables>;
export const TokenDocument = gql`
    query Token($address: String!) {
  token(address: $address) @client {
    id
    address
    iconHash
    decimals
    name
    symbol
  }
}
    `;

/**
 * __useTokenQuery__
 *
 * To run a query within a React component, call `useTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTokenQuery(baseOptions?: Apollo.QueryHookOptions<TokenQuery, TokenQueryVariables>) {
        return Apollo.useQuery<TokenQuery, TokenQueryVariables>(TokenDocument, baseOptions);
      }
export function useTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenQuery, TokenQueryVariables>) {
          return Apollo.useLazyQuery<TokenQuery, TokenQueryVariables>(TokenDocument, baseOptions);
        }
export type TokenQueryHookResult = ReturnType<typeof useTokenQuery>;
export type TokenLazyQueryHookResult = ReturnType<typeof useTokenLazyQuery>;
export type TokenQueryResult = Apollo.QueryResult<TokenQuery, TokenQueryVariables>;
export const TokenInfoDocument = gql`
    query TokenInfo($address: String!) {
  tokenInfo(address: $address) {
    decimals
    name
    symbol
    iconHash
  }
}
    `;

/**
 * __useTokenInfoQuery__
 *
 * To run a query within a React component, call `useTokenInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenInfoQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useTokenInfoQuery(baseOptions?: Apollo.QueryHookOptions<TokenInfoQuery, TokenInfoQueryVariables>) {
        return Apollo.useQuery<TokenInfoQuery, TokenInfoQueryVariables>(TokenInfoDocument, baseOptions);
      }
export function useTokenInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokenInfoQuery, TokenInfoQueryVariables>) {
          return Apollo.useLazyQuery<TokenInfoQuery, TokenInfoQueryVariables>(TokenInfoDocument, baseOptions);
        }
export type TokenInfoQueryHookResult = ReturnType<typeof useTokenInfoQuery>;
export type TokenInfoLazyQueryHookResult = ReturnType<typeof useTokenInfoLazyQuery>;
export type TokenInfoQueryResult = Apollo.QueryResult<TokenInfoQuery, TokenInfoQueryVariables>;
export const UserNotificationsDocument = gql`
    query UserNotifications($address: String!) {
  user(address: $address) {
    id
    notifications {
      id
      event {
        id
        type
        createdAt
        initiatorAddress
        sourceId
        sourceType
        ...EventContext
      }
      read
    }
  }
}
    ${EventContextFragmentDoc}`;

/**
 * __useUserNotificationsQuery__
 *
 * To run a query within a React component, call `useUserNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserNotificationsQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useUserNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<UserNotificationsQuery, UserNotificationsQueryVariables>) {
        return Apollo.useQuery<UserNotificationsQuery, UserNotificationsQueryVariables>(UserNotificationsDocument, baseOptions);
      }
export function useUserNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserNotificationsQuery, UserNotificationsQueryVariables>) {
          return Apollo.useLazyQuery<UserNotificationsQuery, UserNotificationsQueryVariables>(UserNotificationsDocument, baseOptions);
        }
export type UserNotificationsQueryHookResult = ReturnType<typeof useUserNotificationsQuery>;
export type UserNotificationsLazyQueryHookResult = ReturnType<typeof useUserNotificationsLazyQuery>;
export type UserNotificationsQueryResult = Apollo.QueryResult<UserNotificationsQuery, UserNotificationsQueryVariables>;
export const SystemInfoDocument = gql`
    query SystemInfo {
  systemInfo {
    version
  }
}
    `;

/**
 * __useSystemInfoQuery__
 *
 * To run a query within a React component, call `useSystemInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useSystemInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSystemInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useSystemInfoQuery(baseOptions?: Apollo.QueryHookOptions<SystemInfoQuery, SystemInfoQueryVariables>) {
        return Apollo.useQuery<SystemInfoQuery, SystemInfoQueryVariables>(SystemInfoDocument, baseOptions);
      }
export function useSystemInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SystemInfoQuery, SystemInfoQueryVariables>) {
          return Apollo.useLazyQuery<SystemInfoQuery, SystemInfoQueryVariables>(SystemInfoDocument, baseOptions);
        }
export type SystemInfoQueryHookResult = ReturnType<typeof useSystemInfoQuery>;
export type SystemInfoLazyQueryHookResult = ReturnType<typeof useSystemInfoLazyQuery>;
export type SystemInfoQueryResult = Apollo.QueryResult<SystemInfoQuery, SystemInfoQueryVariables>;
export const NetworkContractsDocument = gql`
    query NetworkContracts {
  networkContracts @client {
    version
    feeInverse
  }
}
    `;

/**
 * __useNetworkContractsQuery__
 *
 * To run a query within a React component, call `useNetworkContractsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNetworkContractsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNetworkContractsQuery({
 *   variables: {
 *   },
 * });
 */
export function useNetworkContractsQuery(baseOptions?: Apollo.QueryHookOptions<NetworkContractsQuery, NetworkContractsQueryVariables>) {
        return Apollo.useQuery<NetworkContractsQuery, NetworkContractsQueryVariables>(NetworkContractsDocument, baseOptions);
      }
export function useNetworkContractsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NetworkContractsQuery, NetworkContractsQueryVariables>) {
          return Apollo.useLazyQuery<NetworkContractsQuery, NetworkContractsQueryVariables>(NetworkContractsDocument, baseOptions);
        }
export type NetworkContractsQueryHookResult = ReturnType<typeof useNetworkContractsQuery>;
export type NetworkContractsLazyQueryHookResult = ReturnType<typeof useNetworkContractsLazyQuery>;
export type NetworkContractsQueryResult = Apollo.QueryResult<NetworkContractsQuery, NetworkContractsQueryVariables>;
export const ColonyActionDocument = gql`
    query ColonyAction($transactionHash: String!, $colonyAddress: String!) {
  colonyAction(transactionHash: $transactionHash, colonyAddress: $colonyAddress) @client {
    hash
    actionInitiator
    fromDomain
    toDomain
    recipient
    status
    events {
      type
      name
      values
      createdAt
      emmitedBy
      transactionHash
    }
    createdAt
    actionType
    amount
    tokenAddress
    annotationHash
    newVersion
    oldVersion
    colonyDisplayName
    colonyAvatarHash
    colonyTokens
    domainName
    domainPurpose
    domainColor
    motionState
    motionDomain
    roles {
      id
      setTo
    }
    blockNumber
    rootHash
    reputationChange
  }
}
    `;

/**
 * __useColonyActionQuery__
 *
 * To run a query within a React component, call `useColonyActionQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyActionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyActionQuery({
 *   variables: {
 *      transactionHash: // value for 'transactionHash'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useColonyActionQuery(baseOptions?: Apollo.QueryHookOptions<ColonyActionQuery, ColonyActionQueryVariables>) {
        return Apollo.useQuery<ColonyActionQuery, ColonyActionQueryVariables>(ColonyActionDocument, baseOptions);
      }
export function useColonyActionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyActionQuery, ColonyActionQueryVariables>) {
          return Apollo.useLazyQuery<ColonyActionQuery, ColonyActionQueryVariables>(ColonyActionDocument, baseOptions);
        }
export type ColonyActionQueryHookResult = ReturnType<typeof useColonyActionQuery>;
export type ColonyActionLazyQueryHookResult = ReturnType<typeof useColonyActionLazyQuery>;
export type ColonyActionQueryResult = Apollo.QueryResult<ColonyActionQuery, ColonyActionQueryVariables>;
export const MetaColonyDocument = gql`
    query MetaColony {
  processedMetaColony @client {
    id
    colonyAddress
    colonyName
    displayName
    avatarHash
    avatarURL
  }
}
    `;

/**
 * __useMetaColonyQuery__
 *
 * To run a query within a React component, call `useMetaColonyQuery` and pass it any options that fit your needs.
 * When your component renders, `useMetaColonyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMetaColonyQuery({
 *   variables: {
 *   },
 * });
 */
export function useMetaColonyQuery(baseOptions?: Apollo.QueryHookOptions<MetaColonyQuery, MetaColonyQueryVariables>) {
        return Apollo.useQuery<MetaColonyQuery, MetaColonyQueryVariables>(MetaColonyDocument, baseOptions);
      }
export function useMetaColonyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MetaColonyQuery, MetaColonyQueryVariables>) {
          return Apollo.useLazyQuery<MetaColonyQuery, MetaColonyQueryVariables>(MetaColonyDocument, baseOptions);
        }
export type MetaColonyQueryHookResult = ReturnType<typeof useMetaColonyQuery>;
export type MetaColonyLazyQueryHookResult = ReturnType<typeof useMetaColonyLazyQuery>;
export type MetaColonyQueryResult = Apollo.QueryResult<MetaColonyQuery, MetaColonyQueryVariables>;
export const ActionsThatNeedAttentionDocument = gql`
    query ActionsThatNeedAttention($colonyAddress: String!, $walletAddress: String!) {
  actionsThatNeedAttention(colonyAddress: $colonyAddress, walletAddress: $walletAddress) @client {
    transactionHash
    needsAction
  }
}
    `;

/**
 * __useActionsThatNeedAttentionQuery__
 *
 * To run a query within a React component, call `useActionsThatNeedAttentionQuery` and pass it any options that fit your needs.
 * When your component renders, `useActionsThatNeedAttentionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActionsThatNeedAttentionQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      walletAddress: // value for 'walletAddress'
 *   },
 * });
 */
export function useActionsThatNeedAttentionQuery(baseOptions?: Apollo.QueryHookOptions<ActionsThatNeedAttentionQuery, ActionsThatNeedAttentionQueryVariables>) {
        return Apollo.useQuery<ActionsThatNeedAttentionQuery, ActionsThatNeedAttentionQueryVariables>(ActionsThatNeedAttentionDocument, baseOptions);
      }
export function useActionsThatNeedAttentionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ActionsThatNeedAttentionQuery, ActionsThatNeedAttentionQueryVariables>) {
          return Apollo.useLazyQuery<ActionsThatNeedAttentionQuery, ActionsThatNeedAttentionQueryVariables>(ActionsThatNeedAttentionDocument, baseOptions);
        }
export type ActionsThatNeedAttentionQueryHookResult = ReturnType<typeof useActionsThatNeedAttentionQuery>;
export type ActionsThatNeedAttentionLazyQueryHookResult = ReturnType<typeof useActionsThatNeedAttentionLazyQuery>;
export type ActionsThatNeedAttentionQueryResult = Apollo.QueryResult<ActionsThatNeedAttentionQuery, ActionsThatNeedAttentionQueryVariables>;
export const EventsForMotionDocument = gql`
    query EventsForMotion($motionId: Int!, $colonyAddress: String!) {
  eventsForMotion(motionId: $motionId, colonyAddress: $colonyAddress) @client {
    type
    name
    values
    createdAt
    emmitedBy
    blockNumber
    transactionHash
  }
}
    `;

/**
 * __useEventsForMotionQuery__
 *
 * To run a query within a React component, call `useEventsForMotionQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventsForMotionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventsForMotionQuery({
 *   variables: {
 *      motionId: // value for 'motionId'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useEventsForMotionQuery(baseOptions?: Apollo.QueryHookOptions<EventsForMotionQuery, EventsForMotionQueryVariables>) {
        return Apollo.useQuery<EventsForMotionQuery, EventsForMotionQueryVariables>(EventsForMotionDocument, baseOptions);
      }
export function useEventsForMotionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventsForMotionQuery, EventsForMotionQueryVariables>) {
          return Apollo.useLazyQuery<EventsForMotionQuery, EventsForMotionQueryVariables>(EventsForMotionDocument, baseOptions);
        }
export type EventsForMotionQueryHookResult = ReturnType<typeof useEventsForMotionQuery>;
export type EventsForMotionLazyQueryHookResult = ReturnType<typeof useEventsForMotionLazyQuery>;
export type EventsForMotionQueryResult = Apollo.QueryResult<EventsForMotionQuery, EventsForMotionQueryVariables>;
export const RecoveryEventsForSessionDocument = gql`
    query RecoveryEventsForSession($blockNumber: Int!, $colonyAddress: String!) {
  recoveryEventsForSession(blockNumber: $blockNumber, colonyAddress: $colonyAddress) @client {
    type
    name
    values
    createdAt
    emmitedBy
    blockNumber
    transactionHash
  }
}
    `;

/**
 * __useRecoveryEventsForSessionQuery__
 *
 * To run a query within a React component, call `useRecoveryEventsForSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecoveryEventsForSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecoveryEventsForSessionQuery({
 *   variables: {
 *      blockNumber: // value for 'blockNumber'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useRecoveryEventsForSessionQuery(baseOptions?: Apollo.QueryHookOptions<RecoveryEventsForSessionQuery, RecoveryEventsForSessionQueryVariables>) {
        return Apollo.useQuery<RecoveryEventsForSessionQuery, RecoveryEventsForSessionQueryVariables>(RecoveryEventsForSessionDocument, baseOptions);
      }
export function useRecoveryEventsForSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecoveryEventsForSessionQuery, RecoveryEventsForSessionQueryVariables>) {
          return Apollo.useLazyQuery<RecoveryEventsForSessionQuery, RecoveryEventsForSessionQueryVariables>(RecoveryEventsForSessionDocument, baseOptions);
        }
export type RecoveryEventsForSessionQueryHookResult = ReturnType<typeof useRecoveryEventsForSessionQuery>;
export type RecoveryEventsForSessionLazyQueryHookResult = ReturnType<typeof useRecoveryEventsForSessionLazyQuery>;
export type RecoveryEventsForSessionQueryResult = Apollo.QueryResult<RecoveryEventsForSessionQuery, RecoveryEventsForSessionQueryVariables>;
export const RecoverySystemMessagesForSessionDocument = gql`
    query RecoverySystemMessagesForSession($blockNumber: Int!, $colonyAddress: String!) {
  recoverySystemMessagesForSession(blockNumber: $blockNumber, colonyAddress: $colonyAddress) @client {
    type
    name
    createdAt
  }
}
    `;

/**
 * __useRecoverySystemMessagesForSessionQuery__
 *
 * To run a query within a React component, call `useRecoverySystemMessagesForSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecoverySystemMessagesForSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecoverySystemMessagesForSessionQuery({
 *   variables: {
 *      blockNumber: // value for 'blockNumber'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useRecoverySystemMessagesForSessionQuery(baseOptions?: Apollo.QueryHookOptions<RecoverySystemMessagesForSessionQuery, RecoverySystemMessagesForSessionQueryVariables>) {
        return Apollo.useQuery<RecoverySystemMessagesForSessionQuery, RecoverySystemMessagesForSessionQueryVariables>(RecoverySystemMessagesForSessionDocument, baseOptions);
      }
export function useRecoverySystemMessagesForSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecoverySystemMessagesForSessionQuery, RecoverySystemMessagesForSessionQueryVariables>) {
          return Apollo.useLazyQuery<RecoverySystemMessagesForSessionQuery, RecoverySystemMessagesForSessionQueryVariables>(RecoverySystemMessagesForSessionDocument, baseOptions);
        }
export type RecoverySystemMessagesForSessionQueryHookResult = ReturnType<typeof useRecoverySystemMessagesForSessionQuery>;
export type RecoverySystemMessagesForSessionLazyQueryHookResult = ReturnType<typeof useRecoverySystemMessagesForSessionLazyQuery>;
export type RecoverySystemMessagesForSessionQueryResult = Apollo.QueryResult<RecoverySystemMessagesForSessionQuery, RecoverySystemMessagesForSessionQueryVariables>;
export const GetRecoveryStorageSlotDocument = gql`
    query GetRecoveryStorageSlot($colonyAddress: String!, $storageSlot: String!) {
  getRecoveryStorageSlot(colonyAddress: $colonyAddress, storageSlot: $storageSlot) @client
}
    `;

/**
 * __useGetRecoveryStorageSlotQuery__
 *
 * To run a query within a React component, call `useGetRecoveryStorageSlotQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecoveryStorageSlotQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecoveryStorageSlotQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      storageSlot: // value for 'storageSlot'
 *   },
 * });
 */
export function useGetRecoveryStorageSlotQuery(baseOptions?: Apollo.QueryHookOptions<GetRecoveryStorageSlotQuery, GetRecoveryStorageSlotQueryVariables>) {
        return Apollo.useQuery<GetRecoveryStorageSlotQuery, GetRecoveryStorageSlotQueryVariables>(GetRecoveryStorageSlotDocument, baseOptions);
      }
export function useGetRecoveryStorageSlotLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecoveryStorageSlotQuery, GetRecoveryStorageSlotQueryVariables>) {
          return Apollo.useLazyQuery<GetRecoveryStorageSlotQuery, GetRecoveryStorageSlotQueryVariables>(GetRecoveryStorageSlotDocument, baseOptions);
        }
export type GetRecoveryStorageSlotQueryHookResult = ReturnType<typeof useGetRecoveryStorageSlotQuery>;
export type GetRecoveryStorageSlotLazyQueryHookResult = ReturnType<typeof useGetRecoveryStorageSlotLazyQuery>;
export type GetRecoveryStorageSlotQueryResult = Apollo.QueryResult<GetRecoveryStorageSlotQuery, GetRecoveryStorageSlotQueryVariables>;
export const RecoveryRolesUsersDocument = gql`
    query RecoveryRolesUsers($colonyAddress: String!, $endBlockNumber: Int) {
  recoveryRolesUsers(colonyAddress: $colonyAddress, endBlockNumber: $endBlockNumber) @client {
    id
    profile {
      avatarHash
      displayName
      username
      walletAddress
    }
  }
}
    `;

/**
 * __useRecoveryRolesUsersQuery__
 *
 * To run a query within a React component, call `useRecoveryRolesUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecoveryRolesUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecoveryRolesUsersQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      endBlockNumber: // value for 'endBlockNumber'
 *   },
 * });
 */
export function useRecoveryRolesUsersQuery(baseOptions?: Apollo.QueryHookOptions<RecoveryRolesUsersQuery, RecoveryRolesUsersQueryVariables>) {
        return Apollo.useQuery<RecoveryRolesUsersQuery, RecoveryRolesUsersQueryVariables>(RecoveryRolesUsersDocument, baseOptions);
      }
export function useRecoveryRolesUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecoveryRolesUsersQuery, RecoveryRolesUsersQueryVariables>) {
          return Apollo.useLazyQuery<RecoveryRolesUsersQuery, RecoveryRolesUsersQueryVariables>(RecoveryRolesUsersDocument, baseOptions);
        }
export type RecoveryRolesUsersQueryHookResult = ReturnType<typeof useRecoveryRolesUsersQuery>;
export type RecoveryRolesUsersLazyQueryHookResult = ReturnType<typeof useRecoveryRolesUsersLazyQuery>;
export type RecoveryRolesUsersQueryResult = Apollo.QueryResult<RecoveryRolesUsersQuery, RecoveryRolesUsersQueryVariables>;
export const RecoveryRolesAndApprovalsForSessionDocument = gql`
    query RecoveryRolesAndApprovalsForSession($blockNumber: Int!, $colonyAddress: String!) {
  recoveryRolesAndApprovalsForSession(blockNumber: $blockNumber, colonyAddress: $colonyAddress) @client {
    id
    profile {
      avatarHash
      displayName
      username
      walletAddress
    }
    approvedRecoveryExit
  }
}
    `;

/**
 * __useRecoveryRolesAndApprovalsForSessionQuery__
 *
 * To run a query within a React component, call `useRecoveryRolesAndApprovalsForSessionQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecoveryRolesAndApprovalsForSessionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecoveryRolesAndApprovalsForSessionQuery({
 *   variables: {
 *      blockNumber: // value for 'blockNumber'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useRecoveryRolesAndApprovalsForSessionQuery(baseOptions?: Apollo.QueryHookOptions<RecoveryRolesAndApprovalsForSessionQuery, RecoveryRolesAndApprovalsForSessionQueryVariables>) {
        return Apollo.useQuery<RecoveryRolesAndApprovalsForSessionQuery, RecoveryRolesAndApprovalsForSessionQueryVariables>(RecoveryRolesAndApprovalsForSessionDocument, baseOptions);
      }
export function useRecoveryRolesAndApprovalsForSessionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecoveryRolesAndApprovalsForSessionQuery, RecoveryRolesAndApprovalsForSessionQueryVariables>) {
          return Apollo.useLazyQuery<RecoveryRolesAndApprovalsForSessionQuery, RecoveryRolesAndApprovalsForSessionQueryVariables>(RecoveryRolesAndApprovalsForSessionDocument, baseOptions);
        }
export type RecoveryRolesAndApprovalsForSessionQueryHookResult = ReturnType<typeof useRecoveryRolesAndApprovalsForSessionQuery>;
export type RecoveryRolesAndApprovalsForSessionLazyQueryHookResult = ReturnType<typeof useRecoveryRolesAndApprovalsForSessionLazyQuery>;
export type RecoveryRolesAndApprovalsForSessionQueryResult = Apollo.QueryResult<RecoveryRolesAndApprovalsForSessionQuery, RecoveryRolesAndApprovalsForSessionQueryVariables>;
export const GetRecoveryRequiredApprovalsDocument = gql`
    query GetRecoveryRequiredApprovals($blockNumber: Int!, $colonyAddress: String!) {
  getRecoveryRequiredApprovals(blockNumber: $blockNumber, colonyAddress: $colonyAddress) @client
}
    `;

/**
 * __useGetRecoveryRequiredApprovalsQuery__
 *
 * To run a query within a React component, call `useGetRecoveryRequiredApprovalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecoveryRequiredApprovalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecoveryRequiredApprovalsQuery({
 *   variables: {
 *      blockNumber: // value for 'blockNumber'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useGetRecoveryRequiredApprovalsQuery(baseOptions?: Apollo.QueryHookOptions<GetRecoveryRequiredApprovalsQuery, GetRecoveryRequiredApprovalsQueryVariables>) {
        return Apollo.useQuery<GetRecoveryRequiredApprovalsQuery, GetRecoveryRequiredApprovalsQueryVariables>(GetRecoveryRequiredApprovalsDocument, baseOptions);
      }
export function useGetRecoveryRequiredApprovalsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecoveryRequiredApprovalsQuery, GetRecoveryRequiredApprovalsQueryVariables>) {
          return Apollo.useLazyQuery<GetRecoveryRequiredApprovalsQuery, GetRecoveryRequiredApprovalsQueryVariables>(GetRecoveryRequiredApprovalsDocument, baseOptions);
        }
export type GetRecoveryRequiredApprovalsQueryHookResult = ReturnType<typeof useGetRecoveryRequiredApprovalsQuery>;
export type GetRecoveryRequiredApprovalsLazyQueryHookResult = ReturnType<typeof useGetRecoveryRequiredApprovalsLazyQuery>;
export type GetRecoveryRequiredApprovalsQueryResult = Apollo.QueryResult<GetRecoveryRequiredApprovalsQuery, GetRecoveryRequiredApprovalsQueryVariables>;
export const RecoveryAllEnteredEventsDocument = gql`
    query RecoveryAllEnteredEvents($colonyAddress: String!) {
  recoveryAllEnteredEvents(colonyAddress: $colonyAddress) @client {
    type
    name
    values
    createdAt
    emmitedBy
    blockNumber
    transactionHash
  }
}
    `;

/**
 * __useRecoveryAllEnteredEventsQuery__
 *
 * To run a query within a React component, call `useRecoveryAllEnteredEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecoveryAllEnteredEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecoveryAllEnteredEventsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useRecoveryAllEnteredEventsQuery(baseOptions?: Apollo.QueryHookOptions<RecoveryAllEnteredEventsQuery, RecoveryAllEnteredEventsQueryVariables>) {
        return Apollo.useQuery<RecoveryAllEnteredEventsQuery, RecoveryAllEnteredEventsQueryVariables>(RecoveryAllEnteredEventsDocument, baseOptions);
      }
export function useRecoveryAllEnteredEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecoveryAllEnteredEventsQuery, RecoveryAllEnteredEventsQueryVariables>) {
          return Apollo.useLazyQuery<RecoveryAllEnteredEventsQuery, RecoveryAllEnteredEventsQueryVariables>(RecoveryAllEnteredEventsDocument, baseOptions);
        }
export type RecoveryAllEnteredEventsQueryHookResult = ReturnType<typeof useRecoveryAllEnteredEventsQuery>;
export type RecoveryAllEnteredEventsLazyQueryHookResult = ReturnType<typeof useRecoveryAllEnteredEventsLazyQuery>;
export type RecoveryAllEnteredEventsQueryResult = Apollo.QueryResult<RecoveryAllEnteredEventsQuery, RecoveryAllEnteredEventsQueryVariables>;
export const LegacyNumberOfRecoveryRolesDocument = gql`
    query LegacyNumberOfRecoveryRoles($colonyAddress: String!) {
  legacyNumberOfRecoveryRoles(colonyAddress: $colonyAddress) @client
}
    `;

/**
 * __useLegacyNumberOfRecoveryRolesQuery__
 *
 * To run a query within a React component, call `useLegacyNumberOfRecoveryRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useLegacyNumberOfRecoveryRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLegacyNumberOfRecoveryRolesQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useLegacyNumberOfRecoveryRolesQuery(baseOptions?: Apollo.QueryHookOptions<LegacyNumberOfRecoveryRolesQuery, LegacyNumberOfRecoveryRolesQueryVariables>) {
        return Apollo.useQuery<LegacyNumberOfRecoveryRolesQuery, LegacyNumberOfRecoveryRolesQueryVariables>(LegacyNumberOfRecoveryRolesDocument, baseOptions);
      }
export function useLegacyNumberOfRecoveryRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LegacyNumberOfRecoveryRolesQuery, LegacyNumberOfRecoveryRolesQueryVariables>) {
          return Apollo.useLazyQuery<LegacyNumberOfRecoveryRolesQuery, LegacyNumberOfRecoveryRolesQueryVariables>(LegacyNumberOfRecoveryRolesDocument, baseOptions);
        }
export type LegacyNumberOfRecoveryRolesQueryHookResult = ReturnType<typeof useLegacyNumberOfRecoveryRolesQuery>;
export type LegacyNumberOfRecoveryRolesLazyQueryHookResult = ReturnType<typeof useLegacyNumberOfRecoveryRolesLazyQuery>;
export type LegacyNumberOfRecoveryRolesQueryResult = Apollo.QueryResult<LegacyNumberOfRecoveryRolesQuery, LegacyNumberOfRecoveryRolesQueryVariables>;
export const MotionStakesDocument = gql`
    query MotionStakes($colonyAddress: String!, $userAddress: String!, $motionId: Int!) {
  motionStakes(colonyAddress: $colonyAddress, userAddress: $userAddress, motionId: $motionId) @client {
    totalNAYStakes
    remainingToFullyYayStaked
    remainingToFullyNayStaked
    maxUserStake
    minUserStake
  }
}
    `;

/**
 * __useMotionStakesQuery__
 *
 * To run a query within a React component, call `useMotionStakesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMotionStakesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMotionStakesQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      userAddress: // value for 'userAddress'
 *      motionId: // value for 'motionId'
 *   },
 * });
 */
export function useMotionStakesQuery(baseOptions?: Apollo.QueryHookOptions<MotionStakesQuery, MotionStakesQueryVariables>) {
        return Apollo.useQuery<MotionStakesQuery, MotionStakesQueryVariables>(MotionStakesDocument, baseOptions);
      }
export function useMotionStakesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MotionStakesQuery, MotionStakesQueryVariables>) {
          return Apollo.useLazyQuery<MotionStakesQuery, MotionStakesQueryVariables>(MotionStakesDocument, baseOptions);
        }
export type MotionStakesQueryHookResult = ReturnType<typeof useMotionStakesQuery>;
export type MotionStakesLazyQueryHookResult = ReturnType<typeof useMotionStakesLazyQuery>;
export type MotionStakesQueryResult = Apollo.QueryResult<MotionStakesQuery, MotionStakesQueryVariables>;
export const MotionsSystemMessagesDocument = gql`
    query MotionsSystemMessages($motionId: Int!, $colonyAddress: String!) {
  motionsSystemMessages(motionId: $motionId, colonyAddress: $colonyAddress) @client {
    type
    name
    createdAt
  }
}
    `;

/**
 * __useMotionsSystemMessagesQuery__
 *
 * To run a query within a React component, call `useMotionsSystemMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMotionsSystemMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMotionsSystemMessagesQuery({
 *   variables: {
 *      motionId: // value for 'motionId'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useMotionsSystemMessagesQuery(baseOptions?: Apollo.QueryHookOptions<MotionsSystemMessagesQuery, MotionsSystemMessagesQueryVariables>) {
        return Apollo.useQuery<MotionsSystemMessagesQuery, MotionsSystemMessagesQueryVariables>(MotionsSystemMessagesDocument, baseOptions);
      }
export function useMotionsSystemMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MotionsSystemMessagesQuery, MotionsSystemMessagesQueryVariables>) {
          return Apollo.useLazyQuery<MotionsSystemMessagesQuery, MotionsSystemMessagesQueryVariables>(MotionsSystemMessagesDocument, baseOptions);
        }
export type MotionsSystemMessagesQueryHookResult = ReturnType<typeof useMotionsSystemMessagesQuery>;
export type MotionsSystemMessagesLazyQueryHookResult = ReturnType<typeof useMotionsSystemMessagesLazyQuery>;
export type MotionsSystemMessagesQueryResult = Apollo.QueryResult<MotionsSystemMessagesQuery, MotionsSystemMessagesQueryVariables>;
export const MotionVoterRewardDocument = gql`
    query MotionVoterReward($motionId: Int!, $colonyAddress: String!, $userAddress: String!) {
  motionVoterReward(motionId: $motionId, colonyAddress: $colonyAddress, userAddress: $userAddress) @client {
    reward
    minReward
    maxReward
  }
}
    `;

/**
 * __useMotionVoterRewardQuery__
 *
 * To run a query within a React component, call `useMotionVoterRewardQuery` and pass it any options that fit your needs.
 * When your component renders, `useMotionVoterRewardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMotionVoterRewardQuery({
 *   variables: {
 *      motionId: // value for 'motionId'
 *      colonyAddress: // value for 'colonyAddress'
 *      userAddress: // value for 'userAddress'
 *   },
 * });
 */
export function useMotionVoterRewardQuery(baseOptions?: Apollo.QueryHookOptions<MotionVoterRewardQuery, MotionVoterRewardQueryVariables>) {
        return Apollo.useQuery<MotionVoterRewardQuery, MotionVoterRewardQueryVariables>(MotionVoterRewardDocument, baseOptions);
      }
export function useMotionVoterRewardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MotionVoterRewardQuery, MotionVoterRewardQueryVariables>) {
          return Apollo.useLazyQuery<MotionVoterRewardQuery, MotionVoterRewardQueryVariables>(MotionVoterRewardDocument, baseOptions);
        }
export type MotionVoterRewardQueryHookResult = ReturnType<typeof useMotionVoterRewardQuery>;
export type MotionVoterRewardLazyQueryHookResult = ReturnType<typeof useMotionVoterRewardLazyQuery>;
export type MotionVoterRewardQueryResult = Apollo.QueryResult<MotionVoterRewardQuery, MotionVoterRewardQueryVariables>;
export const MotionUserVoteRevealedDocument = gql`
    query MotionUserVoteRevealed($motionId: Int!, $colonyAddress: String!, $userAddress: String!) {
  motionUserVoteRevealed(motionId: $motionId, colonyAddress: $colonyAddress, userAddress: $userAddress) @client {
    revealed
    vote
  }
}
    `;

/**
 * __useMotionUserVoteRevealedQuery__
 *
 * To run a query within a React component, call `useMotionUserVoteRevealedQuery` and pass it any options that fit your needs.
 * When your component renders, `useMotionUserVoteRevealedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMotionUserVoteRevealedQuery({
 *   variables: {
 *      motionId: // value for 'motionId'
 *      colonyAddress: // value for 'colonyAddress'
 *      userAddress: // value for 'userAddress'
 *   },
 * });
 */
export function useMotionUserVoteRevealedQuery(baseOptions?: Apollo.QueryHookOptions<MotionUserVoteRevealedQuery, MotionUserVoteRevealedQueryVariables>) {
        return Apollo.useQuery<MotionUserVoteRevealedQuery, MotionUserVoteRevealedQueryVariables>(MotionUserVoteRevealedDocument, baseOptions);
      }
export function useMotionUserVoteRevealedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MotionUserVoteRevealedQuery, MotionUserVoteRevealedQueryVariables>) {
          return Apollo.useLazyQuery<MotionUserVoteRevealedQuery, MotionUserVoteRevealedQueryVariables>(MotionUserVoteRevealedDocument, baseOptions);
        }
export type MotionUserVoteRevealedQueryHookResult = ReturnType<typeof useMotionUserVoteRevealedQuery>;
export type MotionUserVoteRevealedLazyQueryHookResult = ReturnType<typeof useMotionUserVoteRevealedLazyQuery>;
export type MotionUserVoteRevealedQueryResult = Apollo.QueryResult<MotionUserVoteRevealedQuery, MotionUserVoteRevealedQueryVariables>;
export const MotionVoteResultsDocument = gql`
    query MotionVoteResults($motionId: Int!, $colonyAddress: String!, $userAddress: String!) {
  motionVoteResults(motionId: $motionId, colonyAddress: $colonyAddress, userAddress: $userAddress) @client {
    currentUserVoteSide
    yayVotes
    yayVoters
    nayVotes
    nayVoters
  }
}
    `;

/**
 * __useMotionVoteResultsQuery__
 *
 * To run a query within a React component, call `useMotionVoteResultsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMotionVoteResultsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMotionVoteResultsQuery({
 *   variables: {
 *      motionId: // value for 'motionId'
 *      colonyAddress: // value for 'colonyAddress'
 *      userAddress: // value for 'userAddress'
 *   },
 * });
 */
export function useMotionVoteResultsQuery(baseOptions?: Apollo.QueryHookOptions<MotionVoteResultsQuery, MotionVoteResultsQueryVariables>) {
        return Apollo.useQuery<MotionVoteResultsQuery, MotionVoteResultsQueryVariables>(MotionVoteResultsDocument, baseOptions);
      }
export function useMotionVoteResultsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MotionVoteResultsQuery, MotionVoteResultsQueryVariables>) {
          return Apollo.useLazyQuery<MotionVoteResultsQuery, MotionVoteResultsQueryVariables>(MotionVoteResultsDocument, baseOptions);
        }
export type MotionVoteResultsQueryHookResult = ReturnType<typeof useMotionVoteResultsQuery>;
export type MotionVoteResultsLazyQueryHookResult = ReturnType<typeof useMotionVoteResultsLazyQuery>;
export type MotionVoteResultsQueryResult = Apollo.QueryResult<MotionVoteResultsQuery, MotionVoteResultsQueryVariables>;
export const VotingStateDocument = gql`
    query VotingState($colonyAddress: String!, $motionId: Int!) {
  votingState(colonyAddress: $colonyAddress, motionId: $motionId) @client {
    thresholdValue
    totalVotedReputation
    skillRep
  }
}
    `;

/**
 * __useVotingStateQuery__
 *
 * To run a query within a React component, call `useVotingStateQuery` and pass it any options that fit your needs.
 * When your component renders, `useVotingStateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVotingStateQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      motionId: // value for 'motionId'
 *   },
 * });
 */
export function useVotingStateQuery(baseOptions?: Apollo.QueryHookOptions<VotingStateQuery, VotingStateQueryVariables>) {
        return Apollo.useQuery<VotingStateQuery, VotingStateQueryVariables>(VotingStateDocument, baseOptions);
      }
export function useVotingStateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VotingStateQuery, VotingStateQueryVariables>) {
          return Apollo.useLazyQuery<VotingStateQuery, VotingStateQueryVariables>(VotingStateDocument, baseOptions);
        }
export type VotingStateQueryHookResult = ReturnType<typeof useVotingStateQuery>;
export type VotingStateLazyQueryHookResult = ReturnType<typeof useVotingStateLazyQuery>;
export type VotingStateQueryResult = Apollo.QueryResult<VotingStateQuery, VotingStateQueryVariables>;
export const MotionCurrentUserVotedDocument = gql`
    query MotionCurrentUserVoted($motionId: Int!, $colonyAddress: String!, $userAddress: String!) {
  motionCurrentUserVoted(motionId: $motionId, colonyAddress: $colonyAddress, userAddress: $userAddress) @client
}
    `;

/**
 * __useMotionCurrentUserVotedQuery__
 *
 * To run a query within a React component, call `useMotionCurrentUserVotedQuery` and pass it any options that fit your needs.
 * When your component renders, `useMotionCurrentUserVotedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMotionCurrentUserVotedQuery({
 *   variables: {
 *      motionId: // value for 'motionId'
 *      colonyAddress: // value for 'colonyAddress'
 *      userAddress: // value for 'userAddress'
 *   },
 * });
 */
export function useMotionCurrentUserVotedQuery(baseOptions?: Apollo.QueryHookOptions<MotionCurrentUserVotedQuery, MotionCurrentUserVotedQueryVariables>) {
        return Apollo.useQuery<MotionCurrentUserVotedQuery, MotionCurrentUserVotedQueryVariables>(MotionCurrentUserVotedDocument, baseOptions);
      }
export function useMotionCurrentUserVotedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MotionCurrentUserVotedQuery, MotionCurrentUserVotedQueryVariables>) {
          return Apollo.useLazyQuery<MotionCurrentUserVotedQuery, MotionCurrentUserVotedQueryVariables>(MotionCurrentUserVotedDocument, baseOptions);
        }
export type MotionCurrentUserVotedQueryHookResult = ReturnType<typeof useMotionCurrentUserVotedQuery>;
export type MotionCurrentUserVotedLazyQueryHookResult = ReturnType<typeof useMotionCurrentUserVotedLazyQuery>;
export type MotionCurrentUserVotedQueryResult = Apollo.QueryResult<MotionCurrentUserVotedQuery, MotionCurrentUserVotedQueryVariables>;
export const MotionFinalizedDocument = gql`
    query MotionFinalized($motionId: Int!, $colonyAddress: String!) {
  motionFinalized(motionId: $motionId, colonyAddress: $colonyAddress) @client
}
    `;

/**
 * __useMotionFinalizedQuery__
 *
 * To run a query within a React component, call `useMotionFinalizedQuery` and pass it any options that fit your needs.
 * When your component renders, `useMotionFinalizedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMotionFinalizedQuery({
 *   variables: {
 *      motionId: // value for 'motionId'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useMotionFinalizedQuery(baseOptions?: Apollo.QueryHookOptions<MotionFinalizedQuery, MotionFinalizedQueryVariables>) {
        return Apollo.useQuery<MotionFinalizedQuery, MotionFinalizedQueryVariables>(MotionFinalizedDocument, baseOptions);
      }
export function useMotionFinalizedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MotionFinalizedQuery, MotionFinalizedQueryVariables>) {
          return Apollo.useLazyQuery<MotionFinalizedQuery, MotionFinalizedQueryVariables>(MotionFinalizedDocument, baseOptions);
        }
export type MotionFinalizedQueryHookResult = ReturnType<typeof useMotionFinalizedQuery>;
export type MotionFinalizedLazyQueryHookResult = ReturnType<typeof useMotionFinalizedLazyQuery>;
export type MotionFinalizedQueryResult = Apollo.QueryResult<MotionFinalizedQuery, MotionFinalizedQueryVariables>;
export const MotionStakerRewardDocument = gql`
    query MotionStakerReward($motionId: Int!, $colonyAddress: String!, $userAddress: String!) {
  motionStakerReward(motionId: $motionId, colonyAddress: $colonyAddress, userAddress: $userAddress) @client {
    stakingRewardYay
    stakingRewardNay
    stakesYay
    stakesNay
    claimedReward
  }
}
    `;

/**
 * __useMotionStakerRewardQuery__
 *
 * To run a query within a React component, call `useMotionStakerRewardQuery` and pass it any options that fit your needs.
 * When your component renders, `useMotionStakerRewardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMotionStakerRewardQuery({
 *   variables: {
 *      motionId: // value for 'motionId'
 *      colonyAddress: // value for 'colonyAddress'
 *      userAddress: // value for 'userAddress'
 *   },
 * });
 */
export function useMotionStakerRewardQuery(baseOptions?: Apollo.QueryHookOptions<MotionStakerRewardQuery, MotionStakerRewardQueryVariables>) {
        return Apollo.useQuery<MotionStakerRewardQuery, MotionStakerRewardQueryVariables>(MotionStakerRewardDocument, baseOptions);
      }
export function useMotionStakerRewardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MotionStakerRewardQuery, MotionStakerRewardQueryVariables>) {
          return Apollo.useLazyQuery<MotionStakerRewardQuery, MotionStakerRewardQueryVariables>(MotionStakerRewardDocument, baseOptions);
        }
export type MotionStakerRewardQueryHookResult = ReturnType<typeof useMotionStakerRewardQuery>;
export type MotionStakerRewardLazyQueryHookResult = ReturnType<typeof useMotionStakerRewardLazyQuery>;
export type MotionStakerRewardQueryResult = Apollo.QueryResult<MotionStakerRewardQuery, MotionStakerRewardQueryVariables>;
export const StakeAmountsForMotionDocument = gql`
    query StakeAmountsForMotion($colonyAddress: String!, $userAddress: String!, $motionId: Int!) {
  stakeAmountsForMotion(colonyAddress: $colonyAddress, userAddress: $userAddress, motionId: $motionId) @client {
    totalStaked {
      YAY
      NAY
    }
    userStake {
      YAY
      NAY
    }
    requiredStake
  }
}
    `;

/**
 * __useStakeAmountsForMotionQuery__
 *
 * To run a query within a React component, call `useStakeAmountsForMotionQuery` and pass it any options that fit your needs.
 * When your component renders, `useStakeAmountsForMotionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStakeAmountsForMotionQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      userAddress: // value for 'userAddress'
 *      motionId: // value for 'motionId'
 *   },
 * });
 */
export function useStakeAmountsForMotionQuery(baseOptions?: Apollo.QueryHookOptions<StakeAmountsForMotionQuery, StakeAmountsForMotionQueryVariables>) {
        return Apollo.useQuery<StakeAmountsForMotionQuery, StakeAmountsForMotionQueryVariables>(StakeAmountsForMotionDocument, baseOptions);
      }
export function useStakeAmountsForMotionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StakeAmountsForMotionQuery, StakeAmountsForMotionQueryVariables>) {
          return Apollo.useLazyQuery<StakeAmountsForMotionQuery, StakeAmountsForMotionQueryVariables>(StakeAmountsForMotionDocument, baseOptions);
        }
export type StakeAmountsForMotionQueryHookResult = ReturnType<typeof useStakeAmountsForMotionQuery>;
export type StakeAmountsForMotionLazyQueryHookResult = ReturnType<typeof useStakeAmountsForMotionLazyQuery>;
export type StakeAmountsForMotionQueryResult = Apollo.QueryResult<StakeAmountsForMotionQuery, StakeAmountsForMotionQueryVariables>;
export const MotionObjectionAnnotationDocument = gql`
    query MotionObjectionAnnotation($motionId: Int!, $colonyAddress: String!) {
  motionObjectionAnnotation(motionId: $motionId, colonyAddress: $colonyAddress) @client {
    address
    metadata
  }
}
    `;

/**
 * __useMotionObjectionAnnotationQuery__
 *
 * To run a query within a React component, call `useMotionObjectionAnnotationQuery` and pass it any options that fit your needs.
 * When your component renders, `useMotionObjectionAnnotationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMotionObjectionAnnotationQuery({
 *   variables: {
 *      motionId: // value for 'motionId'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useMotionObjectionAnnotationQuery(baseOptions?: Apollo.QueryHookOptions<MotionObjectionAnnotationQuery, MotionObjectionAnnotationQueryVariables>) {
        return Apollo.useQuery<MotionObjectionAnnotationQuery, MotionObjectionAnnotationQueryVariables>(MotionObjectionAnnotationDocument, baseOptions);
      }
export function useMotionObjectionAnnotationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MotionObjectionAnnotationQuery, MotionObjectionAnnotationQueryVariables>) {
          return Apollo.useLazyQuery<MotionObjectionAnnotationQuery, MotionObjectionAnnotationQueryVariables>(MotionObjectionAnnotationDocument, baseOptions);
        }
export type MotionObjectionAnnotationQueryHookResult = ReturnType<typeof useMotionObjectionAnnotationQuery>;
export type MotionObjectionAnnotationLazyQueryHookResult = ReturnType<typeof useMotionObjectionAnnotationLazyQuery>;
export type MotionObjectionAnnotationQueryResult = Apollo.QueryResult<MotionObjectionAnnotationQuery, MotionObjectionAnnotationQueryVariables>;
export const MotionStatusDocument = gql`
    query MotionStatus($motionId: Int!, $colonyAddress: String!) {
  motionStatus(motionId: $motionId, colonyAddress: $colonyAddress) @client
}
    `;

/**
 * __useMotionStatusQuery__
 *
 * To run a query within a React component, call `useMotionStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useMotionStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMotionStatusQuery({
 *   variables: {
 *      motionId: // value for 'motionId'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useMotionStatusQuery(baseOptions?: Apollo.QueryHookOptions<MotionStatusQuery, MotionStatusQueryVariables>) {
        return Apollo.useQuery<MotionStatusQuery, MotionStatusQueryVariables>(MotionStatusDocument, baseOptions);
      }
export function useMotionStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MotionStatusQuery, MotionStatusQueryVariables>) {
          return Apollo.useLazyQuery<MotionStatusQuery, MotionStatusQueryVariables>(MotionStatusDocument, baseOptions);
        }
export type MotionStatusQueryHookResult = ReturnType<typeof useMotionStatusQuery>;
export type MotionStatusLazyQueryHookResult = ReturnType<typeof useMotionStatusLazyQuery>;
export type MotionStatusQueryResult = Apollo.QueryResult<MotionStatusQuery, MotionStatusQueryVariables>;
export const MotionTimeoutPeriodsDocument = gql`
    query MotionTimeoutPeriods($motionId: Int!, $colonyAddress: String!) {
  motionTimeoutPeriods(motionId: $motionId, colonyAddress: $colonyAddress) @client {
    timeLeftToStake
    timeLeftToSubmit
    timeLeftToReveal
    timeLeftToEscalate
  }
}
    `;

/**
 * __useMotionTimeoutPeriodsQuery__
 *
 * To run a query within a React component, call `useMotionTimeoutPeriodsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMotionTimeoutPeriodsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMotionTimeoutPeriodsQuery({
 *   variables: {
 *      motionId: // value for 'motionId'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useMotionTimeoutPeriodsQuery(baseOptions?: Apollo.QueryHookOptions<MotionTimeoutPeriodsQuery, MotionTimeoutPeriodsQueryVariables>) {
        return Apollo.useQuery<MotionTimeoutPeriodsQuery, MotionTimeoutPeriodsQueryVariables>(MotionTimeoutPeriodsDocument, baseOptions);
      }
export function useMotionTimeoutPeriodsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MotionTimeoutPeriodsQuery, MotionTimeoutPeriodsQueryVariables>) {
          return Apollo.useLazyQuery<MotionTimeoutPeriodsQuery, MotionTimeoutPeriodsQueryVariables>(MotionTimeoutPeriodsDocument, baseOptions);
        }
export type MotionTimeoutPeriodsQueryHookResult = ReturnType<typeof useMotionTimeoutPeriodsQuery>;
export type MotionTimeoutPeriodsLazyQueryHookResult = ReturnType<typeof useMotionTimeoutPeriodsLazyQuery>;
export type MotionTimeoutPeriodsQueryResult = Apollo.QueryResult<MotionTimeoutPeriodsQuery, MotionTimeoutPeriodsQueryVariables>;
export const SubgraphDomainsDocument = gql`
    query SubgraphDomains($colonyAddress: String!) {
  domains(where: {colonyAddress: $colonyAddress}) {
    id
    domainChainId
    parent {
      id
      domainChainId
    }
    name
    colonyAddress
    metadata
    metadataHistory {
      id
      metadata
    }
  }
}
    `;

/**
 * __useSubgraphDomainsQuery__
 *
 * To run a query within a React component, call `useSubgraphDomainsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphDomainsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphDomainsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useSubgraphDomainsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphDomainsQuery, SubgraphDomainsQueryVariables>) {
        return Apollo.useQuery<SubgraphDomainsQuery, SubgraphDomainsQueryVariables>(SubgraphDomainsDocument, baseOptions);
      }
export function useSubgraphDomainsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphDomainsQuery, SubgraphDomainsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphDomainsQuery, SubgraphDomainsQueryVariables>(SubgraphDomainsDocument, baseOptions);
        }
export type SubgraphDomainsQueryHookResult = ReturnType<typeof useSubgraphDomainsQuery>;
export type SubgraphDomainsLazyQueryHookResult = ReturnType<typeof useSubgraphDomainsLazyQuery>;
export type SubgraphDomainsQueryResult = Apollo.QueryResult<SubgraphDomainsQuery, SubgraphDomainsQueryVariables>;
export const SubgraphDomainMetadataDocument = gql`
    query SubgraphDomainMetadata($colonyAddress: String!, $domainId: Int!) {
  domains(where: {colonyAddress: $colonyAddress, domainChainId: $domainId}) {
    id
    domainChainId
    metadata
    metadataHistory {
      id
      metadata
      transaction {
        id
        block {
          timestamp
        }
      }
    }
  }
}
    `;

/**
 * __useSubgraphDomainMetadataQuery__
 *
 * To run a query within a React component, call `useSubgraphDomainMetadataQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphDomainMetadataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphDomainMetadataQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      domainId: // value for 'domainId'
 *   },
 * });
 */
export function useSubgraphDomainMetadataQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphDomainMetadataQuery, SubgraphDomainMetadataQueryVariables>) {
        return Apollo.useQuery<SubgraphDomainMetadataQuery, SubgraphDomainMetadataQueryVariables>(SubgraphDomainMetadataDocument, baseOptions);
      }
export function useSubgraphDomainMetadataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphDomainMetadataQuery, SubgraphDomainMetadataQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphDomainMetadataQuery, SubgraphDomainMetadataQueryVariables>(SubgraphDomainMetadataDocument, baseOptions);
        }
export type SubgraphDomainMetadataQueryHookResult = ReturnType<typeof useSubgraphDomainMetadataQuery>;
export type SubgraphDomainMetadataLazyQueryHookResult = ReturnType<typeof useSubgraphDomainMetadataLazyQuery>;
export type SubgraphDomainMetadataQueryResult = Apollo.QueryResult<SubgraphDomainMetadataQuery, SubgraphDomainMetadataQueryVariables>;
export const SubgraphSingleDomainDocument = gql`
    query SubgraphSingleDomain($colonyAddress: String!, $domainId: Int!) {
  domains(where: {colonyAddress: $colonyAddress, domainChainId: $domainId}) {
    id
    domainChainId
    parent {
      id
      domainChainId
    }
    name
    colonyAddress
    metadata
    metadataHistory {
      id
      metadata
    }
  }
}
    `;

/**
 * __useSubgraphSingleDomainQuery__
 *
 * To run a query within a React component, call `useSubgraphSingleDomainQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphSingleDomainQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphSingleDomainQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      domainId: // value for 'domainId'
 *   },
 * });
 */
export function useSubgraphSingleDomainQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphSingleDomainQuery, SubgraphSingleDomainQueryVariables>) {
        return Apollo.useQuery<SubgraphSingleDomainQuery, SubgraphSingleDomainQueryVariables>(SubgraphSingleDomainDocument, baseOptions);
      }
export function useSubgraphSingleDomainLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphSingleDomainQuery, SubgraphSingleDomainQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphSingleDomainQuery, SubgraphSingleDomainQueryVariables>(SubgraphSingleDomainDocument, baseOptions);
        }
export type SubgraphSingleDomainQueryHookResult = ReturnType<typeof useSubgraphSingleDomainQuery>;
export type SubgraphSingleDomainLazyQueryHookResult = ReturnType<typeof useSubgraphSingleDomainLazyQuery>;
export type SubgraphSingleDomainQueryResult = Apollo.QueryResult<SubgraphSingleDomainQuery, SubgraphSingleDomainQueryVariables>;
export const ColonyNameDocument = gql`
    query ColonyName($address: String!) {
  colonyName(address: $address) @client
}
    `;

/**
 * __useColonyNameQuery__
 *
 * To run a query within a React component, call `useColonyNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyNameQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useColonyNameQuery(baseOptions?: Apollo.QueryHookOptions<ColonyNameQuery, ColonyNameQueryVariables>) {
        return Apollo.useQuery<ColonyNameQuery, ColonyNameQueryVariables>(ColonyNameDocument, baseOptions);
      }
export function useColonyNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyNameQuery, ColonyNameQueryVariables>) {
          return Apollo.useLazyQuery<ColonyNameQuery, ColonyNameQueryVariables>(ColonyNameDocument, baseOptions);
        }
export type ColonyNameQueryHookResult = ReturnType<typeof useColonyNameQuery>;
export type ColonyNameLazyQueryHookResult = ReturnType<typeof useColonyNameLazyQuery>;
export type ColonyNameQueryResult = Apollo.QueryResult<ColonyNameQuery, ColonyNameQueryVariables>;
export const ColonyAddressDocument = gql`
    query ColonyAddress($name: String!) {
  colonyAddress(name: $name) @client
}
    `;

/**
 * __useColonyAddressQuery__
 *
 * To run a query within a React component, call `useColonyAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyAddressQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useColonyAddressQuery(baseOptions?: Apollo.QueryHookOptions<ColonyAddressQuery, ColonyAddressQueryVariables>) {
        return Apollo.useQuery<ColonyAddressQuery, ColonyAddressQueryVariables>(ColonyAddressDocument, baseOptions);
      }
export function useColonyAddressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyAddressQuery, ColonyAddressQueryVariables>) {
          return Apollo.useLazyQuery<ColonyAddressQuery, ColonyAddressQueryVariables>(ColonyAddressDocument, baseOptions);
        }
export type ColonyAddressQueryHookResult = ReturnType<typeof useColonyAddressQuery>;
export type ColonyAddressLazyQueryHookResult = ReturnType<typeof useColonyAddressLazyQuery>;
export type ColonyAddressQueryResult = Apollo.QueryResult<ColonyAddressQuery, ColonyAddressQueryVariables>;
export const SubgraphColonyDocument = gql`
    query SubgraphColony($address: String!) {
  colony(id: $address) {
    id
    colonyChainId
    ensName
    metadata
    metadataHistory {
      id
      metadata
    }
    token {
      tokenAddress: id
      decimals
      symbol
    }
    extensions {
      address: id
      hash
    }
  }
}
    `;

/**
 * __useSubgraphColonyQuery__
 *
 * To run a query within a React component, call `useSubgraphColonyQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphColonyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphColonyQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useSubgraphColonyQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphColonyQuery, SubgraphColonyQueryVariables>) {
        return Apollo.useQuery<SubgraphColonyQuery, SubgraphColonyQueryVariables>(SubgraphColonyDocument, baseOptions);
      }
export function useSubgraphColonyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphColonyQuery, SubgraphColonyQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphColonyQuery, SubgraphColonyQueryVariables>(SubgraphColonyDocument, baseOptions);
        }
export type SubgraphColonyQueryHookResult = ReturnType<typeof useSubgraphColonyQuery>;
export type SubgraphColonyLazyQueryHookResult = ReturnType<typeof useSubgraphColonyLazyQuery>;
export type SubgraphColonyQueryResult = Apollo.QueryResult<SubgraphColonyQuery, SubgraphColonyQueryVariables>;
export const SubgraphColoniesDocument = gql`
    query SubgraphColonies($colonyAddresses: [String!]!) {
  colonies(where: {id_in: $colonyAddresses}, orderBy: "colonyChainId", orderDirection: "asc") {
    id
    colonyChainId
    ensName
    metadata
    metadataHistory {
      id
      metadata
    }
    token {
      tokenAddress: id
      decimals
      symbol
    }
  }
}
    `;

/**
 * __useSubgraphColoniesQuery__
 *
 * To run a query within a React component, call `useSubgraphColoniesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphColoniesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphColoniesQuery({
 *   variables: {
 *      colonyAddresses: // value for 'colonyAddresses'
 *   },
 * });
 */
export function useSubgraphColoniesQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphColoniesQuery, SubgraphColoniesQueryVariables>) {
        return Apollo.useQuery<SubgraphColoniesQuery, SubgraphColoniesQueryVariables>(SubgraphColoniesDocument, baseOptions);
      }
export function useSubgraphColoniesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphColoniesQuery, SubgraphColoniesQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphColoniesQuery, SubgraphColoniesQueryVariables>(SubgraphColoniesDocument, baseOptions);
        }
export type SubgraphColoniesQueryHookResult = ReturnType<typeof useSubgraphColoniesQuery>;
export type SubgraphColoniesLazyQueryHookResult = ReturnType<typeof useSubgraphColoniesLazyQuery>;
export type SubgraphColoniesQueryResult = Apollo.QueryResult<SubgraphColoniesQuery, SubgraphColoniesQueryVariables>;
export const SubgraphColonyMetadataDocument = gql`
    query SubgraphColonyMetadata($address: String!) {
  colony(id: $address) {
    id
    colonyChainId
    metadata
    metadataHistory {
      id
      metadata
      transaction {
        id
        block {
          timestamp
        }
      }
    }
  }
}
    `;

/**
 * __useSubgraphColonyMetadataQuery__
 *
 * To run a query within a React component, call `useSubgraphColonyMetadataQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphColonyMetadataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphColonyMetadataQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useSubgraphColonyMetadataQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphColonyMetadataQuery, SubgraphColonyMetadataQueryVariables>) {
        return Apollo.useQuery<SubgraphColonyMetadataQuery, SubgraphColonyMetadataQueryVariables>(SubgraphColonyMetadataDocument, baseOptions);
      }
export function useSubgraphColonyMetadataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphColonyMetadataQuery, SubgraphColonyMetadataQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphColonyMetadataQuery, SubgraphColonyMetadataQueryVariables>(SubgraphColonyMetadataDocument, baseOptions);
        }
export type SubgraphColonyMetadataQueryHookResult = ReturnType<typeof useSubgraphColonyMetadataQuery>;
export type SubgraphColonyMetadataLazyQueryHookResult = ReturnType<typeof useSubgraphColonyMetadataLazyQuery>;
export type SubgraphColonyMetadataQueryResult = Apollo.QueryResult<SubgraphColonyMetadataQuery, SubgraphColonyMetadataQueryVariables>;
export const ColonyFromNameDocument = gql`
    query ColonyFromName($name: String!, $address: String!) {
  colonyAddress(name: $name) @client @export(as: "address")
  processedColony(address: $address) @client {
    ...FullColony
  }
}
    ${FullColonyFragmentDoc}`;

/**
 * __useColonyFromNameQuery__
 *
 * To run a query within a React component, call `useColonyFromNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyFromNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyFromNameQuery({
 *   variables: {
 *      name: // value for 'name'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useColonyFromNameQuery(baseOptions?: Apollo.QueryHookOptions<ColonyFromNameQuery, ColonyFromNameQueryVariables>) {
        return Apollo.useQuery<ColonyFromNameQuery, ColonyFromNameQueryVariables>(ColonyFromNameDocument, baseOptions);
      }
export function useColonyFromNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyFromNameQuery, ColonyFromNameQueryVariables>) {
          return Apollo.useLazyQuery<ColonyFromNameQuery, ColonyFromNameQueryVariables>(ColonyFromNameDocument, baseOptions);
        }
export type ColonyFromNameQueryHookResult = ReturnType<typeof useColonyFromNameQuery>;
export type ColonyFromNameLazyQueryHookResult = ReturnType<typeof useColonyFromNameLazyQuery>;
export type ColonyFromNameQueryResult = Apollo.QueryResult<ColonyFromNameQuery, ColonyFromNameQueryVariables>;
export const ColonyDomainsDocument = gql`
    query ColonyDomains($colonyAddress: String!) {
  processedColony(address: $colonyAddress) @client {
    id
    domains @client {
      ...DomainFields
    }
  }
}
    ${DomainFieldsFragmentDoc}`;

/**
 * __useColonyDomainsQuery__
 *
 * To run a query within a React component, call `useColonyDomainsQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyDomainsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyDomainsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useColonyDomainsQuery(baseOptions?: Apollo.QueryHookOptions<ColonyDomainsQuery, ColonyDomainsQueryVariables>) {
        return Apollo.useQuery<ColonyDomainsQuery, ColonyDomainsQueryVariables>(ColonyDomainsDocument, baseOptions);
      }
export function useColonyDomainsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyDomainsQuery, ColonyDomainsQueryVariables>) {
          return Apollo.useLazyQuery<ColonyDomainsQuery, ColonyDomainsQueryVariables>(ColonyDomainsDocument, baseOptions);
        }
export type ColonyDomainsQueryHookResult = ReturnType<typeof useColonyDomainsQuery>;
export type ColonyDomainsLazyQueryHookResult = ReturnType<typeof useColonyDomainsLazyQuery>;
export type ColonyDomainsQueryResult = Apollo.QueryResult<ColonyDomainsQuery, ColonyDomainsQueryVariables>;
export const ColonySingleDomainDocument = gql`
    query ColonySingleDomain($colonyAddress: String!, $domainId: Int!) {
  colonyDomain(colonyAddress: $colonyAddress, domainId: $domainId) @client {
    ...DomainFields
  }
}
    ${DomainFieldsFragmentDoc}`;

/**
 * __useColonySingleDomainQuery__
 *
 * To run a query within a React component, call `useColonySingleDomainQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonySingleDomainQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonySingleDomainQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      domainId: // value for 'domainId'
 *   },
 * });
 */
export function useColonySingleDomainQuery(baseOptions?: Apollo.QueryHookOptions<ColonySingleDomainQuery, ColonySingleDomainQueryVariables>) {
        return Apollo.useQuery<ColonySingleDomainQuery, ColonySingleDomainQueryVariables>(ColonySingleDomainDocument, baseOptions);
      }
export function useColonySingleDomainLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonySingleDomainQuery, ColonySingleDomainQueryVariables>) {
          return Apollo.useLazyQuery<ColonySingleDomainQuery, ColonySingleDomainQueryVariables>(ColonySingleDomainDocument, baseOptions);
        }
export type ColonySingleDomainQueryHookResult = ReturnType<typeof useColonySingleDomainQuery>;
export type ColonySingleDomainLazyQueryHookResult = ReturnType<typeof useColonySingleDomainLazyQuery>;
export type ColonySingleDomainQueryResult = Apollo.QueryResult<ColonySingleDomainQuery, ColonySingleDomainQueryVariables>;
export const ProcessedColonyDocument = gql`
    query ProcessedColony($address: String!) {
  processedColony(address: $address) @client {
    ...FullColony
  }
}
    ${FullColonyFragmentDoc}`;

/**
 * __useProcessedColonyQuery__
 *
 * To run a query within a React component, call `useProcessedColonyQuery` and pass it any options that fit your needs.
 * When your component renders, `useProcessedColonyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProcessedColonyQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useProcessedColonyQuery(baseOptions?: Apollo.QueryHookOptions<ProcessedColonyQuery, ProcessedColonyQueryVariables>) {
        return Apollo.useQuery<ProcessedColonyQuery, ProcessedColonyQueryVariables>(ProcessedColonyDocument, baseOptions);
      }
export function useProcessedColonyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProcessedColonyQuery, ProcessedColonyQueryVariables>) {
          return Apollo.useLazyQuery<ProcessedColonyQuery, ProcessedColonyQueryVariables>(ProcessedColonyDocument, baseOptions);
        }
export type ProcessedColonyQueryHookResult = ReturnType<typeof useProcessedColonyQuery>;
export type ProcessedColonyLazyQueryHookResult = ReturnType<typeof useProcessedColonyLazyQuery>;
export type ProcessedColonyQueryResult = Apollo.QueryResult<ProcessedColonyQuery, ProcessedColonyQueryVariables>;
export const ColonyNativeTokenDocument = gql`
    query ColonyNativeToken($address: String!) {
  processedColony(address: $address) @client {
    id
    nativeTokenAddress
  }
}
    `;

/**
 * __useColonyNativeTokenQuery__
 *
 * To run a query within a React component, call `useColonyNativeTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyNativeTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyNativeTokenQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useColonyNativeTokenQuery(baseOptions?: Apollo.QueryHookOptions<ColonyNativeTokenQuery, ColonyNativeTokenQueryVariables>) {
        return Apollo.useQuery<ColonyNativeTokenQuery, ColonyNativeTokenQueryVariables>(ColonyNativeTokenDocument, baseOptions);
      }
export function useColonyNativeTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyNativeTokenQuery, ColonyNativeTokenQueryVariables>) {
          return Apollo.useLazyQuery<ColonyNativeTokenQuery, ColonyNativeTokenQueryVariables>(ColonyNativeTokenDocument, baseOptions);
        }
export type ColonyNativeTokenQueryHookResult = ReturnType<typeof useColonyNativeTokenQuery>;
export type ColonyNativeTokenLazyQueryHookResult = ReturnType<typeof useColonyNativeTokenLazyQuery>;
export type ColonyNativeTokenQueryResult = Apollo.QueryResult<ColonyNativeTokenQuery, ColonyNativeTokenQueryVariables>;
export const ColonyTransfersDocument = gql`
    query ColonyTransfers($address: String!) {
  processedColony(address: $address) @client {
    id
    colonyAddress
    transfers @client {
      amount
      hash
      colonyAddress
      date
      from
      hash
      incoming
      to
      token
    }
    unclaimedTransfers @client {
      amount
      hash
      colonyAddress
      date
      from
      hash
      incoming
      to
      token
    }
  }
}
    `;

/**
 * __useColonyTransfersQuery__
 *
 * To run a query within a React component, call `useColonyTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyTransfersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyTransfersQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useColonyTransfersQuery(baseOptions?: Apollo.QueryHookOptions<ColonyTransfersQuery, ColonyTransfersQueryVariables>) {
        return Apollo.useQuery<ColonyTransfersQuery, ColonyTransfersQueryVariables>(ColonyTransfersDocument, baseOptions);
      }
export function useColonyTransfersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyTransfersQuery, ColonyTransfersQueryVariables>) {
          return Apollo.useLazyQuery<ColonyTransfersQuery, ColonyTransfersQueryVariables>(ColonyTransfersDocument, baseOptions);
        }
export type ColonyTransfersQueryHookResult = ReturnType<typeof useColonyTransfersQuery>;
export type ColonyTransfersLazyQueryHookResult = ReturnType<typeof useColonyTransfersLazyQuery>;
export type ColonyTransfersQueryResult = Apollo.QueryResult<ColonyTransfersQuery, ColonyTransfersQueryVariables>;
export const ColonyProfileDocument = gql`
    query ColonyProfile($address: String!) {
  processedColony(address: $address) @client {
    ...ColonyProfile
  }
}
    ${ColonyProfileFragmentDoc}`;

/**
 * __useColonyProfileQuery__
 *
 * To run a query within a React component, call `useColonyProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyProfileQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useColonyProfileQuery(baseOptions?: Apollo.QueryHookOptions<ColonyProfileQuery, ColonyProfileQueryVariables>) {
        return Apollo.useQuery<ColonyProfileQuery, ColonyProfileQueryVariables>(ColonyProfileDocument, baseOptions);
      }
export function useColonyProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyProfileQuery, ColonyProfileQueryVariables>) {
          return Apollo.useLazyQuery<ColonyProfileQuery, ColonyProfileQueryVariables>(ColonyProfileDocument, baseOptions);
        }
export type ColonyProfileQueryHookResult = ReturnType<typeof useColonyProfileQuery>;
export type ColonyProfileLazyQueryHookResult = ReturnType<typeof useColonyProfileLazyQuery>;
export type ColonyProfileQueryResult = Apollo.QueryResult<ColonyProfileQuery, ColonyProfileQueryVariables>;
export const ColonyMembersWithReputationDocument = gql`
    query ColonyMembersWithReputation($colonyAddress: String!, $domainId: Int) {
  colonyMembersWithReputation(colonyAddress: $colonyAddress, domainId: $domainId) @client
}
    `;

/**
 * __useColonyMembersWithReputationQuery__
 *
 * To run a query within a React component, call `useColonyMembersWithReputationQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyMembersWithReputationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyMembersWithReputationQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      domainId: // value for 'domainId'
 *   },
 * });
 */
export function useColonyMembersWithReputationQuery(baseOptions?: Apollo.QueryHookOptions<ColonyMembersWithReputationQuery, ColonyMembersWithReputationQueryVariables>) {
        return Apollo.useQuery<ColonyMembersWithReputationQuery, ColonyMembersWithReputationQueryVariables>(ColonyMembersWithReputationDocument, baseOptions);
      }
export function useColonyMembersWithReputationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyMembersWithReputationQuery, ColonyMembersWithReputationQueryVariables>) {
          return Apollo.useLazyQuery<ColonyMembersWithReputationQuery, ColonyMembersWithReputationQueryVariables>(ColonyMembersWithReputationDocument, baseOptions);
        }
export type ColonyMembersWithReputationQueryHookResult = ReturnType<typeof useColonyMembersWithReputationQuery>;
export type ColonyMembersWithReputationLazyQueryHookResult = ReturnType<typeof useColonyMembersWithReputationLazyQuery>;
export type ColonyMembersWithReputationQueryResult = Apollo.QueryResult<ColonyMembersWithReputationQuery, ColonyMembersWithReputationQueryVariables>;
export const ColonyReputationDocument = gql`
    query ColonyReputation($address: String!, $domainId: Int) {
  colonyReputation(address: $address, domainId: $domainId) @client
}
    `;

/**
 * __useColonyReputationQuery__
 *
 * To run a query within a React component, call `useColonyReputationQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyReputationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyReputationQuery({
 *   variables: {
 *      address: // value for 'address'
 *      domainId: // value for 'domainId'
 *   },
 * });
 */
export function useColonyReputationQuery(baseOptions?: Apollo.QueryHookOptions<ColonyReputationQuery, ColonyReputationQueryVariables>) {
        return Apollo.useQuery<ColonyReputationQuery, ColonyReputationQueryVariables>(ColonyReputationDocument, baseOptions);
      }
export function useColonyReputationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyReputationQuery, ColonyReputationQueryVariables>) {
          return Apollo.useLazyQuery<ColonyReputationQuery, ColonyReputationQueryVariables>(ColonyReputationDocument, baseOptions);
        }
export type ColonyReputationQueryHookResult = ReturnType<typeof useColonyReputationQuery>;
export type ColonyReputationLazyQueryHookResult = ReturnType<typeof useColonyReputationLazyQuery>;
export type ColonyReputationQueryResult = Apollo.QueryResult<ColonyReputationQuery, ColonyReputationQueryVariables>;
export const ColonyHistoricRolesDocument = gql`
    query ColonyHistoricRoles($colonyAddress: String!, $blockNumber: Int!) {
  historicColonyRoles(colonyAddress: $colonyAddress, blockNumber: $blockNumber) @client {
    address
    domains {
      domainId
      roles
    }
  }
}
    `;

/**
 * __useColonyHistoricRolesQuery__
 *
 * To run a query within a React component, call `useColonyHistoricRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyHistoricRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyHistoricRolesQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      blockNumber: // value for 'blockNumber'
 *   },
 * });
 */
export function useColonyHistoricRolesQuery(baseOptions?: Apollo.QueryHookOptions<ColonyHistoricRolesQuery, ColonyHistoricRolesQueryVariables>) {
        return Apollo.useQuery<ColonyHistoricRolesQuery, ColonyHistoricRolesQueryVariables>(ColonyHistoricRolesDocument, baseOptions);
      }
export function useColonyHistoricRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyHistoricRolesQuery, ColonyHistoricRolesQueryVariables>) {
          return Apollo.useLazyQuery<ColonyHistoricRolesQuery, ColonyHistoricRolesQueryVariables>(ColonyHistoricRolesDocument, baseOptions);
        }
export type ColonyHistoricRolesQueryHookResult = ReturnType<typeof useColonyHistoricRolesQuery>;
export type ColonyHistoricRolesLazyQueryHookResult = ReturnType<typeof useColonyHistoricRolesLazyQuery>;
export type ColonyHistoricRolesQueryResult = Apollo.QueryResult<ColonyHistoricRolesQuery, ColonyHistoricRolesQueryVariables>;
export const WhitelistAgreementDocument = gql`
    query WhitelistAgreement($agreementHash: String!) {
  whitelistAgreement(agreementHash: $agreementHash) @client
}
    `;

/**
 * __useWhitelistAgreementQuery__
 *
 * To run a query within a React component, call `useWhitelistAgreementQuery` and pass it any options that fit your needs.
 * When your component renders, `useWhitelistAgreementQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWhitelistAgreementQuery({
 *   variables: {
 *      agreementHash: // value for 'agreementHash'
 *   },
 * });
 */
export function useWhitelistAgreementQuery(baseOptions?: Apollo.QueryHookOptions<WhitelistAgreementQuery, WhitelistAgreementQueryVariables>) {
        return Apollo.useQuery<WhitelistAgreementQuery, WhitelistAgreementQueryVariables>(WhitelistAgreementDocument, baseOptions);
      }
export function useWhitelistAgreementLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WhitelistAgreementQuery, WhitelistAgreementQueryVariables>) {
          return Apollo.useLazyQuery<WhitelistAgreementQuery, WhitelistAgreementQueryVariables>(WhitelistAgreementDocument, baseOptions);
        }
export type WhitelistAgreementQueryHookResult = ReturnType<typeof useWhitelistAgreementQuery>;
export type WhitelistAgreementLazyQueryHookResult = ReturnType<typeof useWhitelistAgreementLazyQuery>;
export type WhitelistAgreementQueryResult = Apollo.QueryResult<WhitelistAgreementQuery, WhitelistAgreementQueryVariables>;
export const WhitelistAgreementHashDocument = gql`
    query WhitelistAgreementHash($colonyAddress: String!) {
  whitelistAgreementHash(colonyAddress: $colonyAddress) @client
}
    `;

/**
 * __useWhitelistAgreementHashQuery__
 *
 * To run a query within a React component, call `useWhitelistAgreementHashQuery` and pass it any options that fit your needs.
 * When your component renders, `useWhitelistAgreementHashQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWhitelistAgreementHashQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useWhitelistAgreementHashQuery(baseOptions?: Apollo.QueryHookOptions<WhitelistAgreementHashQuery, WhitelistAgreementHashQueryVariables>) {
        return Apollo.useQuery<WhitelistAgreementHashQuery, WhitelistAgreementHashQueryVariables>(WhitelistAgreementHashDocument, baseOptions);
      }
export function useWhitelistAgreementHashLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WhitelistAgreementHashQuery, WhitelistAgreementHashQueryVariables>) {
          return Apollo.useLazyQuery<WhitelistAgreementHashQuery, WhitelistAgreementHashQueryVariables>(WhitelistAgreementHashDocument, baseOptions);
        }
export type WhitelistAgreementHashQueryHookResult = ReturnType<typeof useWhitelistAgreementHashQuery>;
export type WhitelistAgreementHashLazyQueryHookResult = ReturnType<typeof useWhitelistAgreementHashLazyQuery>;
export type WhitelistAgreementHashQueryResult = Apollo.QueryResult<WhitelistAgreementHashQuery, WhitelistAgreementHashQueryVariables>;
export const HasKycPolicyDocument = gql`
    query HasKycPolicy($colonyAddress: String!) {
  hasKycPolicy(colonyAddress: $colonyAddress) @client
}
    `;

/**
 * __useHasKycPolicyQuery__
 *
 * To run a query within a React component, call `useHasKycPolicyQuery` and pass it any options that fit your needs.
 * When your component renders, `useHasKycPolicyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHasKycPolicyQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useHasKycPolicyQuery(baseOptions?: Apollo.QueryHookOptions<HasKycPolicyQuery, HasKycPolicyQueryVariables>) {
        return Apollo.useQuery<HasKycPolicyQuery, HasKycPolicyQueryVariables>(HasKycPolicyDocument, baseOptions);
      }
export function useHasKycPolicyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HasKycPolicyQuery, HasKycPolicyQueryVariables>) {
          return Apollo.useLazyQuery<HasKycPolicyQuery, HasKycPolicyQueryVariables>(HasKycPolicyDocument, baseOptions);
        }
export type HasKycPolicyQueryHookResult = ReturnType<typeof useHasKycPolicyQuery>;
export type HasKycPolicyLazyQueryHookResult = ReturnType<typeof useHasKycPolicyLazyQuery>;
export type HasKycPolicyQueryResult = Apollo.QueryResult<HasKycPolicyQuery, HasKycPolicyQueryVariables>;
export const TransactionMessagesDocument = gql`
    query TransactionMessages($transactionHash: String!) {
  transactionMessages(transactionHash: $transactionHash) {
    transactionHash
    messages {
      ...TransactionMessage
    }
  }
}
    ${TransactionMessageFragmentDoc}`;

/**
 * __useTransactionMessagesQuery__
 *
 * To run a query within a React component, call `useTransactionMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionMessagesQuery({
 *   variables: {
 *      transactionHash: // value for 'transactionHash'
 *   },
 * });
 */
export function useTransactionMessagesQuery(baseOptions?: Apollo.QueryHookOptions<TransactionMessagesQuery, TransactionMessagesQueryVariables>) {
        return Apollo.useQuery<TransactionMessagesQuery, TransactionMessagesQueryVariables>(TransactionMessagesDocument, baseOptions);
      }
export function useTransactionMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionMessagesQuery, TransactionMessagesQueryVariables>) {
          return Apollo.useLazyQuery<TransactionMessagesQuery, TransactionMessagesQueryVariables>(TransactionMessagesDocument, baseOptions);
        }
export type TransactionMessagesQueryHookResult = ReturnType<typeof useTransactionMessagesQuery>;
export type TransactionMessagesLazyQueryHookResult = ReturnType<typeof useTransactionMessagesLazyQuery>;
export type TransactionMessagesQueryResult = Apollo.QueryResult<TransactionMessagesQuery, TransactionMessagesQueryVariables>;
export const TransactionMessagesCountDocument = gql`
    query TransactionMessagesCount($colonyAddress: String!) {
  transactionMessagesCount(colonyAddress: $colonyAddress) {
    colonyTransactionMessages {
      transactionHash
      count
    }
  }
}
    `;

/**
 * __useTransactionMessagesCountQuery__
 *
 * To run a query within a React component, call `useTransactionMessagesCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionMessagesCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionMessagesCountQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useTransactionMessagesCountQuery(baseOptions?: Apollo.QueryHookOptions<TransactionMessagesCountQuery, TransactionMessagesCountQueryVariables>) {
        return Apollo.useQuery<TransactionMessagesCountQuery, TransactionMessagesCountQueryVariables>(TransactionMessagesCountDocument, baseOptions);
      }
export function useTransactionMessagesCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionMessagesCountQuery, TransactionMessagesCountQueryVariables>) {
          return Apollo.useLazyQuery<TransactionMessagesCountQuery, TransactionMessagesCountQueryVariables>(TransactionMessagesCountDocument, baseOptions);
        }
export type TransactionMessagesCountQueryHookResult = ReturnType<typeof useTransactionMessagesCountQuery>;
export type TransactionMessagesCountLazyQueryHookResult = ReturnType<typeof useTransactionMessagesCountLazyQuery>;
export type TransactionMessagesCountQueryResult = Apollo.QueryResult<TransactionMessagesCountQuery, TransactionMessagesCountQueryVariables>;
export const ColonyExtensionsDocument = gql`
    query ColonyExtensions($address: String!) {
  processedColony(address: $address) @client {
    id
    colonyAddress
    installedExtensions @client {
      id
      extensionId
      address
      details(colonyAddress: $address) {
        deprecated
        initialized
        installedBy
        installedAt
        missingPermissions
        version
      }
    }
  }
}
    `;

/**
 * __useColonyExtensionsQuery__
 *
 * To run a query within a React component, call `useColonyExtensionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyExtensionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyExtensionsQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useColonyExtensionsQuery(baseOptions?: Apollo.QueryHookOptions<ColonyExtensionsQuery, ColonyExtensionsQueryVariables>) {
        return Apollo.useQuery<ColonyExtensionsQuery, ColonyExtensionsQueryVariables>(ColonyExtensionsDocument, baseOptions);
      }
export function useColonyExtensionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyExtensionsQuery, ColonyExtensionsQueryVariables>) {
          return Apollo.useLazyQuery<ColonyExtensionsQuery, ColonyExtensionsQueryVariables>(ColonyExtensionsDocument, baseOptions);
        }
export type ColonyExtensionsQueryHookResult = ReturnType<typeof useColonyExtensionsQuery>;
export type ColonyExtensionsLazyQueryHookResult = ReturnType<typeof useColonyExtensionsLazyQuery>;
export type ColonyExtensionsQueryResult = Apollo.QueryResult<ColonyExtensionsQuery, ColonyExtensionsQueryVariables>;
export const ColonyExtensionDocument = gql`
    query ColonyExtension($colonyAddress: String!, $extensionId: String!) {
  colonyExtension(colonyAddress: $colonyAddress, extensionId: $extensionId) @client {
    id
    address
    extensionId
    details(colonyAddress: $colonyAddress) {
      deprecated
      initialized
      installedBy
      installedAt
      missingPermissions
      version
    }
  }
}
    `;

/**
 * __useColonyExtensionQuery__
 *
 * To run a query within a React component, call `useColonyExtensionQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyExtensionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyExtensionQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      extensionId: // value for 'extensionId'
 *   },
 * });
 */
export function useColonyExtensionQuery(baseOptions?: Apollo.QueryHookOptions<ColonyExtensionQuery, ColonyExtensionQueryVariables>) {
        return Apollo.useQuery<ColonyExtensionQuery, ColonyExtensionQueryVariables>(ColonyExtensionDocument, baseOptions);
      }
export function useColonyExtensionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyExtensionQuery, ColonyExtensionQueryVariables>) {
          return Apollo.useLazyQuery<ColonyExtensionQuery, ColonyExtensionQueryVariables>(ColonyExtensionDocument, baseOptions);
        }
export type ColonyExtensionQueryHookResult = ReturnType<typeof useColonyExtensionQuery>;
export type ColonyExtensionLazyQueryHookResult = ReturnType<typeof useColonyExtensionLazyQuery>;
export type ColonyExtensionQueryResult = Apollo.QueryResult<ColonyExtensionQuery, ColonyExtensionQueryVariables>;
export const NetworkExtensionVersionDocument = gql`
    query NetworkExtensionVersion($extensionId: String) {
  networkExtensionVersion(extensionId: $extensionId) @client
}
    `;

/**
 * __useNetworkExtensionVersionQuery__
 *
 * To run a query within a React component, call `useNetworkExtensionVersionQuery` and pass it any options that fit your needs.
 * When your component renders, `useNetworkExtensionVersionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNetworkExtensionVersionQuery({
 *   variables: {
 *      extensionId: // value for 'extensionId'
 *   },
 * });
 */
export function useNetworkExtensionVersionQuery(baseOptions?: Apollo.QueryHookOptions<NetworkExtensionVersionQuery, NetworkExtensionVersionQueryVariables>) {
        return Apollo.useQuery<NetworkExtensionVersionQuery, NetworkExtensionVersionQueryVariables>(NetworkExtensionVersionDocument, baseOptions);
      }
export function useNetworkExtensionVersionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NetworkExtensionVersionQuery, NetworkExtensionVersionQueryVariables>) {
          return Apollo.useLazyQuery<NetworkExtensionVersionQuery, NetworkExtensionVersionQueryVariables>(NetworkExtensionVersionDocument, baseOptions);
        }
export type NetworkExtensionVersionQueryHookResult = ReturnType<typeof useNetworkExtensionVersionQuery>;
export type NetworkExtensionVersionLazyQueryHookResult = ReturnType<typeof useNetworkExtensionVersionLazyQuery>;
export type NetworkExtensionVersionQueryResult = Apollo.QueryResult<NetworkExtensionVersionQuery, NetworkExtensionVersionQueryVariables>;
export const SubgraphExtensionVersionDeployedEventsDocument = gql`
    query SubgraphExtensionVersionDeployedEvents {
  extensionVersionDeployedEvents: events(where: {name_contains: "ExtensionAddedToNetwork"}) {
    id
    address
    name
    args
    transaction {
      id
      transactionHash: id
      block {
        id
        number: id
        timestamp
      }
    }
  }
}
    `;

/**
 * __useSubgraphExtensionVersionDeployedEventsQuery__
 *
 * To run a query within a React component, call `useSubgraphExtensionVersionDeployedEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphExtensionVersionDeployedEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphExtensionVersionDeployedEventsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSubgraphExtensionVersionDeployedEventsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphExtensionVersionDeployedEventsQuery, SubgraphExtensionVersionDeployedEventsQueryVariables>) {
        return Apollo.useQuery<SubgraphExtensionVersionDeployedEventsQuery, SubgraphExtensionVersionDeployedEventsQueryVariables>(SubgraphExtensionVersionDeployedEventsDocument, baseOptions);
      }
export function useSubgraphExtensionVersionDeployedEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphExtensionVersionDeployedEventsQuery, SubgraphExtensionVersionDeployedEventsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphExtensionVersionDeployedEventsQuery, SubgraphExtensionVersionDeployedEventsQueryVariables>(SubgraphExtensionVersionDeployedEventsDocument, baseOptions);
        }
export type SubgraphExtensionVersionDeployedEventsQueryHookResult = ReturnType<typeof useSubgraphExtensionVersionDeployedEventsQuery>;
export type SubgraphExtensionVersionDeployedEventsLazyQueryHookResult = ReturnType<typeof useSubgraphExtensionVersionDeployedEventsLazyQuery>;
export type SubgraphExtensionVersionDeployedEventsQueryResult = Apollo.QueryResult<SubgraphExtensionVersionDeployedEventsQuery, SubgraphExtensionVersionDeployedEventsQueryVariables>;
export const SubgraphExtensionEventsDocument = gql`
    query SubgraphExtensionEvents($colonyAddress: String!, $extensionAddress: String!) {
  extensionInstalledEvents: events(where: {name_contains: "ExtensionInstalled", args_contains: $colonyAddress}) {
    id
    address
    name
    args
    transaction {
      id
      transactionHash: id
      block {
        id
        number: id
        timestamp
      }
    }
  }
  extensionInitialisedEvents: events(where: {name_contains: "ExtensionInitialised", address: $extensionAddress}) {
    id
    address
    name
    args
    transaction {
      id
      transactionHash: id
      block {
        id
        number: id
        timestamp
      }
    }
  }
}
    `;

/**
 * __useSubgraphExtensionEventsQuery__
 *
 * To run a query within a React component, call `useSubgraphExtensionEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphExtensionEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphExtensionEventsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      extensionAddress: // value for 'extensionAddress'
 *   },
 * });
 */
export function useSubgraphExtensionEventsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphExtensionEventsQuery, SubgraphExtensionEventsQueryVariables>) {
        return Apollo.useQuery<SubgraphExtensionEventsQuery, SubgraphExtensionEventsQueryVariables>(SubgraphExtensionEventsDocument, baseOptions);
      }
export function useSubgraphExtensionEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphExtensionEventsQuery, SubgraphExtensionEventsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphExtensionEventsQuery, SubgraphExtensionEventsQueryVariables>(SubgraphExtensionEventsDocument, baseOptions);
        }
export type SubgraphExtensionEventsQueryHookResult = ReturnType<typeof useSubgraphExtensionEventsQuery>;
export type SubgraphExtensionEventsLazyQueryHookResult = ReturnType<typeof useSubgraphExtensionEventsLazyQuery>;
export type SubgraphExtensionEventsQueryResult = Apollo.QueryResult<SubgraphExtensionEventsQuery, SubgraphExtensionEventsQueryVariables>;
export const ColonyMembersDocument = gql`
    query ColonyMembers($colonyAddress: String!) {
  subscribedUsers(colonyAddress: $colonyAddress) {
    id
    profile {
      avatarHash
      displayName
      username
      walletAddress
    }
  }
}
    `;

/**
 * __useColonyMembersQuery__
 *
 * To run a query within a React component, call `useColonyMembersQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyMembersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyMembersQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useColonyMembersQuery(baseOptions?: Apollo.QueryHookOptions<ColonyMembersQuery, ColonyMembersQueryVariables>) {
        return Apollo.useQuery<ColonyMembersQuery, ColonyMembersQueryVariables>(ColonyMembersDocument, baseOptions);
      }
export function useColonyMembersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyMembersQuery, ColonyMembersQueryVariables>) {
          return Apollo.useLazyQuery<ColonyMembersQuery, ColonyMembersQueryVariables>(ColonyMembersDocument, baseOptions);
        }
export type ColonyMembersQueryHookResult = ReturnType<typeof useColonyMembersQuery>;
export type ColonyMembersLazyQueryHookResult = ReturnType<typeof useColonyMembersLazyQuery>;
export type ColonyMembersQueryResult = Apollo.QueryResult<ColonyMembersQuery, ColonyMembersQueryVariables>;
export const SubgraphMotionEventsDocument = gql`
    query SubgraphMotionEvents($colonyAddress: String!, $motionId: String!) {
  motionEvents: events(where: {name_in: ["MotionStaked(uint256,address,uint256,uint256)", "MotionFinalized(uint256,bytes,bool)", "MotionRewardClaimed(uint256,address,uint256,uint256)"], associatedColony: $colonyAddress, args_contains: $motionId}) {
    id
    address
    name
    args
    transaction {
      id
      transactionHash: id
      block {
        id
        number: id
        timestamp
      }
    }
  }
}
    `;

/**
 * __useSubgraphMotionEventsQuery__
 *
 * To run a query within a React component, call `useSubgraphMotionEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphMotionEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphMotionEventsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      motionId: // value for 'motionId'
 *   },
 * });
 */
export function useSubgraphMotionEventsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphMotionEventsQuery, SubgraphMotionEventsQueryVariables>) {
        return Apollo.useQuery<SubgraphMotionEventsQuery, SubgraphMotionEventsQueryVariables>(SubgraphMotionEventsDocument, baseOptions);
      }
export function useSubgraphMotionEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphMotionEventsQuery, SubgraphMotionEventsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphMotionEventsQuery, SubgraphMotionEventsQueryVariables>(SubgraphMotionEventsDocument, baseOptions);
        }
export type SubgraphMotionEventsQueryHookResult = ReturnType<typeof useSubgraphMotionEventsQuery>;
export type SubgraphMotionEventsLazyQueryHookResult = ReturnType<typeof useSubgraphMotionEventsLazyQuery>;
export type SubgraphMotionEventsQueryResult = Apollo.QueryResult<SubgraphMotionEventsQuery, SubgraphMotionEventsQueryVariables>;
export const SubgraphMotionSystemEventsDocument = gql`
    query SubgraphMotionSystemEvents($colonyAddress: String!, $motionId: String!) {
  motionSystemEvents: events(where: {name_in: ["MotionStaked(uint256,address,uint256,uint256)", "MotionVoteSubmitted(uint256,address)", "MotionVoteRevealed(uint256,address,uint256)"], associatedColony: $colonyAddress, args_contains: $motionId}) {
    id
    address
    name
    args
    transaction {
      id
      transactionHash: id
      block {
        id
        number: id
        timestamp
      }
    }
  }
}
    `;

/**
 * __useSubgraphMotionSystemEventsQuery__
 *
 * To run a query within a React component, call `useSubgraphMotionSystemEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphMotionSystemEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphMotionSystemEventsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      motionId: // value for 'motionId'
 *   },
 * });
 */
export function useSubgraphMotionSystemEventsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphMotionSystemEventsQuery, SubgraphMotionSystemEventsQueryVariables>) {
        return Apollo.useQuery<SubgraphMotionSystemEventsQuery, SubgraphMotionSystemEventsQueryVariables>(SubgraphMotionSystemEventsDocument, baseOptions);
      }
export function useSubgraphMotionSystemEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphMotionSystemEventsQuery, SubgraphMotionSystemEventsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphMotionSystemEventsQuery, SubgraphMotionSystemEventsQueryVariables>(SubgraphMotionSystemEventsDocument, baseOptions);
        }
export type SubgraphMotionSystemEventsQueryHookResult = ReturnType<typeof useSubgraphMotionSystemEventsQuery>;
export type SubgraphMotionSystemEventsLazyQueryHookResult = ReturnType<typeof useSubgraphMotionSystemEventsLazyQuery>;
export type SubgraphMotionSystemEventsQueryResult = Apollo.QueryResult<SubgraphMotionSystemEventsQuery, SubgraphMotionSystemEventsQueryVariables>;
export const SubgraphMotionVoteSubmittedEventsDocument = gql`
    query SubgraphMotionVoteSubmittedEvents($colonyAddress: String!, $motionId: String!) {
  motionVoteSubmittedEvents: events(where: {name_contains: "MotionVoteSubmitted", associatedColony: $colonyAddress, args_contains: $motionId}) {
    id
    address
    name
    args
    transaction {
      id
      transactionHash: id
      block {
        id
        number: id
        timestamp
      }
    }
  }
}
    `;

/**
 * __useSubgraphMotionVoteSubmittedEventsQuery__
 *
 * To run a query within a React component, call `useSubgraphMotionVoteSubmittedEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphMotionVoteSubmittedEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphMotionVoteSubmittedEventsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      motionId: // value for 'motionId'
 *   },
 * });
 */
export function useSubgraphMotionVoteSubmittedEventsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphMotionVoteSubmittedEventsQuery, SubgraphMotionVoteSubmittedEventsQueryVariables>) {
        return Apollo.useQuery<SubgraphMotionVoteSubmittedEventsQuery, SubgraphMotionVoteSubmittedEventsQueryVariables>(SubgraphMotionVoteSubmittedEventsDocument, baseOptions);
      }
export function useSubgraphMotionVoteSubmittedEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphMotionVoteSubmittedEventsQuery, SubgraphMotionVoteSubmittedEventsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphMotionVoteSubmittedEventsQuery, SubgraphMotionVoteSubmittedEventsQueryVariables>(SubgraphMotionVoteSubmittedEventsDocument, baseOptions);
        }
export type SubgraphMotionVoteSubmittedEventsQueryHookResult = ReturnType<typeof useSubgraphMotionVoteSubmittedEventsQuery>;
export type SubgraphMotionVoteSubmittedEventsLazyQueryHookResult = ReturnType<typeof useSubgraphMotionVoteSubmittedEventsLazyQuery>;
export type SubgraphMotionVoteSubmittedEventsQueryResult = Apollo.QueryResult<SubgraphMotionVoteSubmittedEventsQuery, SubgraphMotionVoteSubmittedEventsQueryVariables>;
export const SubgraphMotionVoteRevealedEventsDocument = gql`
    query SubgraphMotionVoteRevealedEvents($colonyAddress: String!, $motionId: String!) {
  motionVoteRevealedEvents: events(where: {name_contains: "MotionVoteRevealed", associatedColony: $colonyAddress, args_contains: $motionId}) {
    id
    address
    name
    args
    transaction {
      id
      transactionHash: id
      block {
        id
        number: id
        timestamp
      }
    }
  }
}
    `;

/**
 * __useSubgraphMotionVoteRevealedEventsQuery__
 *
 * To run a query within a React component, call `useSubgraphMotionVoteRevealedEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphMotionVoteRevealedEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphMotionVoteRevealedEventsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      motionId: // value for 'motionId'
 *   },
 * });
 */
export function useSubgraphMotionVoteRevealedEventsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphMotionVoteRevealedEventsQuery, SubgraphMotionVoteRevealedEventsQueryVariables>) {
        return Apollo.useQuery<SubgraphMotionVoteRevealedEventsQuery, SubgraphMotionVoteRevealedEventsQueryVariables>(SubgraphMotionVoteRevealedEventsDocument, baseOptions);
      }
export function useSubgraphMotionVoteRevealedEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphMotionVoteRevealedEventsQuery, SubgraphMotionVoteRevealedEventsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphMotionVoteRevealedEventsQuery, SubgraphMotionVoteRevealedEventsQueryVariables>(SubgraphMotionVoteRevealedEventsDocument, baseOptions);
        }
export type SubgraphMotionVoteRevealedEventsQueryHookResult = ReturnType<typeof useSubgraphMotionVoteRevealedEventsQuery>;
export type SubgraphMotionVoteRevealedEventsLazyQueryHookResult = ReturnType<typeof useSubgraphMotionVoteRevealedEventsLazyQuery>;
export type SubgraphMotionVoteRevealedEventsQueryResult = Apollo.QueryResult<SubgraphMotionVoteRevealedEventsQuery, SubgraphMotionVoteRevealedEventsQueryVariables>;
export const SubgraphMotionStakedEventsDocument = gql`
    query SubgraphMotionStakedEvents($colonyAddress: String!, $motionId: String!) {
  motionStakedEvents: events(where: {name_contains: "MotionStaked", associatedColony: $colonyAddress, args_contains: $motionId}) {
    id
    address
    name
    args
    transaction {
      id
      transactionHash: id
      block {
        id
        number: id
        timestamp
      }
    }
  }
}
    `;

/**
 * __useSubgraphMotionStakedEventsQuery__
 *
 * To run a query within a React component, call `useSubgraphMotionStakedEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphMotionStakedEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphMotionStakedEventsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      motionId: // value for 'motionId'
 *   },
 * });
 */
export function useSubgraphMotionStakedEventsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphMotionStakedEventsQuery, SubgraphMotionStakedEventsQueryVariables>) {
        return Apollo.useQuery<SubgraphMotionStakedEventsQuery, SubgraphMotionStakedEventsQueryVariables>(SubgraphMotionStakedEventsDocument, baseOptions);
      }
export function useSubgraphMotionStakedEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphMotionStakedEventsQuery, SubgraphMotionStakedEventsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphMotionStakedEventsQuery, SubgraphMotionStakedEventsQueryVariables>(SubgraphMotionStakedEventsDocument, baseOptions);
        }
export type SubgraphMotionStakedEventsQueryHookResult = ReturnType<typeof useSubgraphMotionStakedEventsQuery>;
export type SubgraphMotionStakedEventsLazyQueryHookResult = ReturnType<typeof useSubgraphMotionStakedEventsLazyQuery>;
export type SubgraphMotionStakedEventsQueryResult = Apollo.QueryResult<SubgraphMotionStakedEventsQuery, SubgraphMotionStakedEventsQueryVariables>;
export const SubgraphUserMotionStakedEventsDocument = gql`
    query SubgraphUserMotionStakedEvents($walletAddress: String!) {
  motionStakedEvents: events(where: {name_contains: "MotionStaked", args_contains: $walletAddress}) {
    id
    address
    name
    args
    transaction {
      id
      transactionHash: id
      block {
        id
        number: id
        timestamp
      }
    }
  }
}
    `;

/**
 * __useSubgraphUserMotionStakedEventsQuery__
 *
 * To run a query within a React component, call `useSubgraphUserMotionStakedEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphUserMotionStakedEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphUserMotionStakedEventsQuery({
 *   variables: {
 *      walletAddress: // value for 'walletAddress'
 *   },
 * });
 */
export function useSubgraphUserMotionStakedEventsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphUserMotionStakedEventsQuery, SubgraphUserMotionStakedEventsQueryVariables>) {
        return Apollo.useQuery<SubgraphUserMotionStakedEventsQuery, SubgraphUserMotionStakedEventsQueryVariables>(SubgraphUserMotionStakedEventsDocument, baseOptions);
      }
export function useSubgraphUserMotionStakedEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphUserMotionStakedEventsQuery, SubgraphUserMotionStakedEventsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphUserMotionStakedEventsQuery, SubgraphUserMotionStakedEventsQueryVariables>(SubgraphUserMotionStakedEventsDocument, baseOptions);
        }
export type SubgraphUserMotionStakedEventsQueryHookResult = ReturnType<typeof useSubgraphUserMotionStakedEventsQuery>;
export type SubgraphUserMotionStakedEventsLazyQueryHookResult = ReturnType<typeof useSubgraphUserMotionStakedEventsLazyQuery>;
export type SubgraphUserMotionStakedEventsQueryResult = Apollo.QueryResult<SubgraphUserMotionStakedEventsQuery, SubgraphUserMotionStakedEventsQueryVariables>;
export const SubgraphUserMotionRewardClaimedEventsDocument = gql`
    query SubgraphUserMotionRewardClaimedEvents($walletAddress: String!) {
  motionRewardClaimedEvents: events(where: {name_contains: "MotionRewardClaimed", args_contains: $walletAddress}) {
    id
    name
    args
    address
    transaction {
      id
      transactionHash: id
      block {
        id
        number: id
        timestamp
      }
    }
  }
}
    `;

/**
 * __useSubgraphUserMotionRewardClaimedEventsQuery__
 *
 * To run a query within a React component, call `useSubgraphUserMotionRewardClaimedEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphUserMotionRewardClaimedEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphUserMotionRewardClaimedEventsQuery({
 *   variables: {
 *      walletAddress: // value for 'walletAddress'
 *   },
 * });
 */
export function useSubgraphUserMotionRewardClaimedEventsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphUserMotionRewardClaimedEventsQuery, SubgraphUserMotionRewardClaimedEventsQueryVariables>) {
        return Apollo.useQuery<SubgraphUserMotionRewardClaimedEventsQuery, SubgraphUserMotionRewardClaimedEventsQueryVariables>(SubgraphUserMotionRewardClaimedEventsDocument, baseOptions);
      }
export function useSubgraphUserMotionRewardClaimedEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphUserMotionRewardClaimedEventsQuery, SubgraphUserMotionRewardClaimedEventsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphUserMotionRewardClaimedEventsQuery, SubgraphUserMotionRewardClaimedEventsQueryVariables>(SubgraphUserMotionRewardClaimedEventsDocument, baseOptions);
        }
export type SubgraphUserMotionRewardClaimedEventsQueryHookResult = ReturnType<typeof useSubgraphUserMotionRewardClaimedEventsQuery>;
export type SubgraphUserMotionRewardClaimedEventsLazyQueryHookResult = ReturnType<typeof useSubgraphUserMotionRewardClaimedEventsLazyQuery>;
export type SubgraphUserMotionRewardClaimedEventsQueryResult = Apollo.QueryResult<SubgraphUserMotionRewardClaimedEventsQuery, SubgraphUserMotionRewardClaimedEventsQueryVariables>;
export const SubgraphMotionRewardClaimedEventsDocument = gql`
    query SubgraphMotionRewardClaimedEvents($colonyAddress: String!, $motionId: String!) {
  motionRewardClaimedEvents: events(where: {associatedColony: $colonyAddress, name_contains: "MotionRewardClaimed", args_contains: $motionId}) {
    id
    name
    args
    address
    transaction {
      id
      transactionHash: id
      block {
        id
        number: id
        timestamp
      }
    }
  }
}
    `;

/**
 * __useSubgraphMotionRewardClaimedEventsQuery__
 *
 * To run a query within a React component, call `useSubgraphMotionRewardClaimedEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphMotionRewardClaimedEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphMotionRewardClaimedEventsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      motionId: // value for 'motionId'
 *   },
 * });
 */
export function useSubgraphMotionRewardClaimedEventsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphMotionRewardClaimedEventsQuery, SubgraphMotionRewardClaimedEventsQueryVariables>) {
        return Apollo.useQuery<SubgraphMotionRewardClaimedEventsQuery, SubgraphMotionRewardClaimedEventsQueryVariables>(SubgraphMotionRewardClaimedEventsDocument, baseOptions);
      }
export function useSubgraphMotionRewardClaimedEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphMotionRewardClaimedEventsQuery, SubgraphMotionRewardClaimedEventsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphMotionRewardClaimedEventsQuery, SubgraphMotionRewardClaimedEventsQueryVariables>(SubgraphMotionRewardClaimedEventsDocument, baseOptions);
        }
export type SubgraphMotionRewardClaimedEventsQueryHookResult = ReturnType<typeof useSubgraphMotionRewardClaimedEventsQuery>;
export type SubgraphMotionRewardClaimedEventsLazyQueryHookResult = ReturnType<typeof useSubgraphMotionRewardClaimedEventsLazyQuery>;
export type SubgraphMotionRewardClaimedEventsQueryResult = Apollo.QueryResult<SubgraphMotionRewardClaimedEventsQuery, SubgraphMotionRewardClaimedEventsQueryVariables>;
export const SubgraphRoleEventsDocument = gql`
    query SubgraphRoleEvents($colonyAddress: String!) {
  colonyRoleSetEvents: events(where: {name_contains: "ColonyRoleSet", address: $colonyAddress}) {
    id
    address
    name
    args
    transaction {
      id
      transactionHash: id
      block {
        id
        number: id
        timestamp
      }
    }
  }
  recoveryRoleSetEvents: events(where: {name_contains: "RecoveryRoleSet", address: $colonyAddress}) {
    id
    address
    name
    args
    transaction {
      id
      transactionHash: id
      block {
        id
        number: id
        timestamp
      }
    }
  }
}
    `;

/**
 * __useSubgraphRoleEventsQuery__
 *
 * To run a query within a React component, call `useSubgraphRoleEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphRoleEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphRoleEventsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useSubgraphRoleEventsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphRoleEventsQuery, SubgraphRoleEventsQueryVariables>) {
        return Apollo.useQuery<SubgraphRoleEventsQuery, SubgraphRoleEventsQueryVariables>(SubgraphRoleEventsDocument, baseOptions);
      }
export function useSubgraphRoleEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphRoleEventsQuery, SubgraphRoleEventsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphRoleEventsQuery, SubgraphRoleEventsQueryVariables>(SubgraphRoleEventsDocument, baseOptions);
        }
export type SubgraphRoleEventsQueryHookResult = ReturnType<typeof useSubgraphRoleEventsQuery>;
export type SubgraphRoleEventsLazyQueryHookResult = ReturnType<typeof useSubgraphRoleEventsLazyQuery>;
export type SubgraphRoleEventsQueryResult = Apollo.QueryResult<SubgraphRoleEventsQuery, SubgraphRoleEventsQueryVariables>;
export const SubgraphColonyFundsClaimedEventsDocument = gql`
    query SubgraphColonyFundsClaimedEvents($colonyAddress: String!) {
  colonyFundsClaimedEvents: events(where: {name_contains: "ColonyFundsClaimed", address: $colonyAddress}) {
    id
    name
    args
    address
    transaction {
      id
      transactionHash: id
      block {
        id
        number: id
        timestamp
      }
    }
  }
}
    `;

/**
 * __useSubgraphColonyFundsClaimedEventsQuery__
 *
 * To run a query within a React component, call `useSubgraphColonyFundsClaimedEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphColonyFundsClaimedEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphColonyFundsClaimedEventsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useSubgraphColonyFundsClaimedEventsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphColonyFundsClaimedEventsQuery, SubgraphColonyFundsClaimedEventsQueryVariables>) {
        return Apollo.useQuery<SubgraphColonyFundsClaimedEventsQuery, SubgraphColonyFundsClaimedEventsQueryVariables>(SubgraphColonyFundsClaimedEventsDocument, baseOptions);
      }
export function useSubgraphColonyFundsClaimedEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphColonyFundsClaimedEventsQuery, SubgraphColonyFundsClaimedEventsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphColonyFundsClaimedEventsQuery, SubgraphColonyFundsClaimedEventsQueryVariables>(SubgraphColonyFundsClaimedEventsDocument, baseOptions);
        }
export type SubgraphColonyFundsClaimedEventsQueryHookResult = ReturnType<typeof useSubgraphColonyFundsClaimedEventsQuery>;
export type SubgraphColonyFundsClaimedEventsLazyQueryHookResult = ReturnType<typeof useSubgraphColonyFundsClaimedEventsLazyQuery>;
export type SubgraphColonyFundsClaimedEventsQueryResult = Apollo.QueryResult<SubgraphColonyFundsClaimedEventsQuery, SubgraphColonyFundsClaimedEventsQueryVariables>;
export const SubgraphPayoutClaimedEventsDocument = gql`
    query SubgraphPayoutClaimedEvents($colonyAddress: String!) {
  payoutClaimedEvents: events(where: {name_contains: "PayoutClaimed", address: $colonyAddress}) {
    id
    name
    args
    address
    transaction {
      id
      transactionHash: id
      block {
        id
        number: id
        timestamp
      }
    }
  }
}
    `;

/**
 * __useSubgraphPayoutClaimedEventsQuery__
 *
 * To run a query within a React component, call `useSubgraphPayoutClaimedEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphPayoutClaimedEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphPayoutClaimedEventsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useSubgraphPayoutClaimedEventsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphPayoutClaimedEventsQuery, SubgraphPayoutClaimedEventsQueryVariables>) {
        return Apollo.useQuery<SubgraphPayoutClaimedEventsQuery, SubgraphPayoutClaimedEventsQueryVariables>(SubgraphPayoutClaimedEventsDocument, baseOptions);
      }
export function useSubgraphPayoutClaimedEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphPayoutClaimedEventsQuery, SubgraphPayoutClaimedEventsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphPayoutClaimedEventsQuery, SubgraphPayoutClaimedEventsQueryVariables>(SubgraphPayoutClaimedEventsDocument, baseOptions);
        }
export type SubgraphPayoutClaimedEventsQueryHookResult = ReturnType<typeof useSubgraphPayoutClaimedEventsQuery>;
export type SubgraphPayoutClaimedEventsLazyQueryHookResult = ReturnType<typeof useSubgraphPayoutClaimedEventsLazyQuery>;
export type SubgraphPayoutClaimedEventsQueryResult = Apollo.QueryResult<SubgraphPayoutClaimedEventsQuery, SubgraphPayoutClaimedEventsQueryVariables>;
export const SubgraphEventsDocument = gql`
    subscription SubgraphEvents($skip: Int!, $first: Int!, $colonyAddress: String!) {
  events(skip: $skip, first: $first, where: {associatedColony: $colonyAddress}) {
    id
    address
    associatedColony {
      colonyAddress: id
      id: colonyChainId
      token {
        address: id
        decimals
        symbol
      }
    }
    transaction {
      hash: id
      block {
        id
        timestamp
      }
    }
    name
    args
  }
}
    `;

/**
 * __useSubgraphEventsSubscription__
 *
 * To run a query within a React component, call `useSubgraphEventsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphEventsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphEventsSubscription({
 *   variables: {
 *      skip: // value for 'skip'
 *      first: // value for 'first'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useSubgraphEventsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SubgraphEventsSubscription, SubgraphEventsSubscriptionVariables>) {
        return Apollo.useSubscription<SubgraphEventsSubscription, SubgraphEventsSubscriptionVariables>(SubgraphEventsDocument, baseOptions);
      }
export type SubgraphEventsSubscriptionHookResult = ReturnType<typeof useSubgraphEventsSubscription>;
export type SubgraphEventsSubscriptionResult = Apollo.SubscriptionResult<SubgraphEventsSubscription>;
export const SubgraphOneTxDocument = gql`
    subscription SubgraphOneTx($skip: Int!, $first: Int!, $colonyAddress: String!) {
  oneTxPayments(skip: $skip, first: $first, where: {payment_contains: $colonyAddress}) {
    id
    agent
    transaction {
      hash: id
      block {
        id
        timestamp
      }
    }
    payment {
      to
      domain {
        ethDomainId: domainChainId
        name
      }
      fundingPot {
        fundingPotPayouts {
          id
          token {
            address: id
            symbol
            decimals
          }
          amount
        }
      }
    }
  }
}
    `;

/**
 * __useSubgraphOneTxSubscription__
 *
 * To run a query within a React component, call `useSubgraphOneTxSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphOneTxSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphOneTxSubscription({
 *   variables: {
 *      skip: // value for 'skip'
 *      first: // value for 'first'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useSubgraphOneTxSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SubgraphOneTxSubscription, SubgraphOneTxSubscriptionVariables>) {
        return Apollo.useSubscription<SubgraphOneTxSubscription, SubgraphOneTxSubscriptionVariables>(SubgraphOneTxDocument, baseOptions);
      }
export type SubgraphOneTxSubscriptionHookResult = ReturnType<typeof useSubgraphOneTxSubscription>;
export type SubgraphOneTxSubscriptionResult = Apollo.SubscriptionResult<SubgraphOneTxSubscription>;
export const SubgraphEventsThatAreActionsDocument = gql`
    subscription SubgraphEventsThatAreActions($skip: Int!, $first: Int!, $colonyAddress: String!) {
  events(skip: $skip, first: $first, where: {associatedColony_contains: $colonyAddress, name_in: ["TokensMinted(address,address,uint256)", "DomainAdded(address,uint256)", "ColonyMetadata(address,string)", "ColonyFundsMovedBetweenFundingPots(address,uint256,uint256,uint256,address)", "DomainMetadata(address,uint256,string)", "ColonyRoleSet(address,address,uint256,uint8,bool)", "ColonyUpgraded(address,uint256,uint256)", "ColonyUpgraded(uint256,uint256)", "RecoveryModeEntered(address)", "ArbitraryReputationUpdate(address,address,uint256,int256)"]}) {
    id
    address
    associatedColony {
      colonyAddress: id
      id: colonyChainId
      token {
        address: id
        decimals
        symbol
      }
    }
    transaction {
      hash: id
      block {
        id
        timestamp
      }
    }
    name
    args
    processedValues @client {
      agent
      who
      fromPot
      fromDomain
      toPot
      toDomain
      domainId
      amount
      token
      metadata
      user
      oldVersion
      newVersion
      storageSlot
      storageSlotValue
    }
  }
}
    `;

/**
 * __useSubgraphEventsThatAreActionsSubscription__
 *
 * To run a query within a React component, call `useSubgraphEventsThatAreActionsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphEventsThatAreActionsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphEventsThatAreActionsSubscription({
 *   variables: {
 *      skip: // value for 'skip'
 *      first: // value for 'first'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useSubgraphEventsThatAreActionsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SubgraphEventsThatAreActionsSubscription, SubgraphEventsThatAreActionsSubscriptionVariables>) {
        return Apollo.useSubscription<SubgraphEventsThatAreActionsSubscription, SubgraphEventsThatAreActionsSubscriptionVariables>(SubgraphEventsThatAreActionsDocument, baseOptions);
      }
export type SubgraphEventsThatAreActionsSubscriptionHookResult = ReturnType<typeof useSubgraphEventsThatAreActionsSubscription>;
export type SubgraphEventsThatAreActionsSubscriptionResult = Apollo.SubscriptionResult<SubgraphEventsThatAreActionsSubscription>;
export const SubgraphMotionsDocument = gql`
    subscription SubgraphMotions($skip: Int!, $first: Int!, $colonyAddress: String!, $extensionAddress: String!) {
  motions(skip: $skip, first: $first, where: {associatedColony: $colonyAddress, extensionAddress: $extensionAddress}) {
    id
    fundamentalChainId
    associatedColony {
      colonyAddress: id
      id: colonyChainId
      token {
        address: id
        decimals
        symbol
      }
    }
    transaction {
      hash: id
      block {
        id
        timestamp
      }
    }
    extensionAddress
    agent
    domain {
      ethDomainId: domainChainId
      name
    }
    stakes
    requiredStake
    escalated
    action
    state @client
    type @client
    args @client {
      amount
      token {
        address: id
        symbol
        decimals
      }
    }
    timeoutPeriods @client {
      timeLeftToStake
      timeLeftToSubmit
      timeLeftToReveal
      timeLeftToEscalate
    }
  }
}
    `;

/**
 * __useSubgraphMotionsSubscription__
 *
 * To run a query within a React component, call `useSubgraphMotionsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphMotionsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphMotionsSubscription({
 *   variables: {
 *      skip: // value for 'skip'
 *      first: // value for 'first'
 *      colonyAddress: // value for 'colonyAddress'
 *      extensionAddress: // value for 'extensionAddress'
 *   },
 * });
 */
export function useSubgraphMotionsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SubgraphMotionsSubscription, SubgraphMotionsSubscriptionVariables>) {
        return Apollo.useSubscription<SubgraphMotionsSubscription, SubgraphMotionsSubscriptionVariables>(SubgraphMotionsDocument, baseOptions);
      }
export type SubgraphMotionsSubscriptionHookResult = ReturnType<typeof useSubgraphMotionsSubscription>;
export type SubgraphMotionsSubscriptionResult = Apollo.SubscriptionResult<SubgraphMotionsSubscription>;
export const SubgraphAnnotationEventsDocument = gql`
    query SubgraphAnnotationEvents($transactionHash: String!) {
  annotationEvents: events(where: {name_contains: "Annotation", args_contains: $transactionHash}) {
    id
    address
    name
    args
    transaction {
      id
      transactionHash: id
      block {
        id
        number: id
        timestamp
      }
    }
  }
}
    `;

/**
 * __useSubgraphAnnotationEventsQuery__
 *
 * To run a query within a React component, call `useSubgraphAnnotationEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphAnnotationEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphAnnotationEventsQuery({
 *   variables: {
 *      transactionHash: // value for 'transactionHash'
 *   },
 * });
 */
export function useSubgraphAnnotationEventsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphAnnotationEventsQuery, SubgraphAnnotationEventsQueryVariables>) {
        return Apollo.useQuery<SubgraphAnnotationEventsQuery, SubgraphAnnotationEventsQueryVariables>(SubgraphAnnotationEventsDocument, baseOptions);
      }
export function useSubgraphAnnotationEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphAnnotationEventsQuery, SubgraphAnnotationEventsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphAnnotationEventsQuery, SubgraphAnnotationEventsQueryVariables>(SubgraphAnnotationEventsDocument, baseOptions);
        }
export type SubgraphAnnotationEventsQueryHookResult = ReturnType<typeof useSubgraphAnnotationEventsQuery>;
export type SubgraphAnnotationEventsLazyQueryHookResult = ReturnType<typeof useSubgraphAnnotationEventsLazyQuery>;
export type SubgraphAnnotationEventsQueryResult = Apollo.QueryResult<SubgraphAnnotationEventsQuery, SubgraphAnnotationEventsQueryVariables>;
export const CommentCountDocument = gql`
    subscription CommentCount($colonyAddress: String!) {
  transactionMessagesCount(colonyAddress: $colonyAddress) {
    colonyTransactionMessages {
      transactionHash
      count
    }
  }
}
    `;

/**
 * __useCommentCountSubscription__
 *
 * To run a query within a React component, call `useCommentCountSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCommentCountSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentCountSubscription({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useCommentCountSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CommentCountSubscription, CommentCountSubscriptionVariables>) {
        return Apollo.useSubscription<CommentCountSubscription, CommentCountSubscriptionVariables>(CommentCountDocument, baseOptions);
      }
export type CommentCountSubscriptionHookResult = ReturnType<typeof useCommentCountSubscription>;
export type CommentCountSubscriptionResult = Apollo.SubscriptionResult<CommentCountSubscription>;
export const CommentsDocument = gql`
    subscription Comments($transactionHash: String!) {
  transactionMessages(transactionHash: $transactionHash) {
    transactionHash
    messages {
      ...TransactionMessage
    }
  }
}
    ${TransactionMessageFragmentDoc}`;

/**
 * __useCommentsSubscription__
 *
 * To run a query within a React component, call `useCommentsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCommentsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentsSubscription({
 *   variables: {
 *      transactionHash: // value for 'transactionHash'
 *   },
 * });
 */
export function useCommentsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CommentsSubscription, CommentsSubscriptionVariables>) {
        return Apollo.useSubscription<CommentsSubscription, CommentsSubscriptionVariables>(CommentsDocument, baseOptions);
      }
export type CommentsSubscriptionHookResult = ReturnType<typeof useCommentsSubscription>;
export type CommentsSubscriptionResult = Apollo.SubscriptionResult<CommentsSubscription>;
export const MembersDocument = gql`
    subscription Members($colonyAddress: String!) {
  subscribedUsers(colonyAddress: $colonyAddress) {
    id
    profile {
      avatarHash
      displayName
      username
      walletAddress
    }
  }
}
    `;

/**
 * __useMembersSubscription__
 *
 * To run a query within a React component, call `useMembersSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMembersSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMembersSubscription({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useMembersSubscription(baseOptions?: Apollo.SubscriptionHookOptions<MembersSubscription, MembersSubscriptionVariables>) {
        return Apollo.useSubscription<MembersSubscription, MembersSubscriptionVariables>(MembersDocument, baseOptions);
      }
export type MembersSubscriptionHookResult = ReturnType<typeof useMembersSubscription>;
export type MembersSubscriptionResult = Apollo.SubscriptionResult<MembersSubscription>;
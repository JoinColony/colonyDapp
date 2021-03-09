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
  setNetworkContracts: NetworkContracts;
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


export type MutationSetNetworkContractsArgs = {
  input?: Maybe<NetworkContractsInput>;
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
  domains: Array<SubgraphDomain>;
  getRecoveryRequiredApprovals: Scalars['Int'];
  getRecoveryStorageSlot: Scalars['String'];
  legacyNumberOfRecoveryRoles: Scalars['Int'];
  loggedInUser: LoggedInUser;
  networkContracts: NetworkContracts;
  processedColony: ProcessedColony;
  processedMetaColony?: Maybe<ProcessedMetaColony>;
  recoveryAllEnteredEvents: Array<ParsedEvent>;
  recoveryEventsForSession: Array<ParsedEvent>;
  recoveryRolesAndApprovalsForSession: Array<UsersAndRecoveryApprovals>;
  recoveryRolesUsers: Array<User>;
  recoverySystemMessagesForSession: Array<SystemMessage>;
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
  username: Scalars['String'];
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


export type QueryDomainsArgs = {
  where: ByColonyFilter;
};


export type QueryGetRecoveryRequiredApprovalsArgs = {
  blockNumber: Scalars['Int'];
  colonyAddress: Scalars['String'];
};


export type QueryGetRecoveryStorageSlotArgs = {
  colonyAddress: Scalars['String'];
  storageSlot: Scalars['String'];
};


export type QueryLegacyNumberOfRecoveryRolesArgs = {
  colonyAddress: Scalars['String'];
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
};


export type QueryUsernameArgs = {
  address: Scalars['String'];
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

export type LoggedInUser = {
  id: Scalars['String'];
  balance: Scalars['String'];
  username?: Maybe<Scalars['String']>;
  walletAddress: Scalars['String'];
  ethereal: Scalars['Boolean'];
  networkId?: Maybe<Scalars['Int']>;
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

export type ColonyExtension = {
  address: Scalars['String'];
  id: Scalars['String'];
  extensionId: Scalars['String'];
  details: ColonyExtensionDetails;
};


export type ColonyExtensionDetailsArgs = {
  colonyAddress: Scalars['String'];
};

export type ColonyExtensionDetails = {
  deprecated: Scalars['Boolean'];
  initialized: Scalars['Boolean'];
  installedBy: Scalars['String'];
  installedAt: Scalars['Int'];
  missingPermissions: Array<Scalars['Int']>;
};

export type UserLock = {
  balance: Scalars['String'];
};

export type ProcessedMetaColony = {
  id: Scalars['Int'];
  colonyAddress: Scalars['String'];
  colonyName: Scalars['String'];
  displayName?: Maybe<Scalars['String']>;
  avatarHash?: Maybe<Scalars['String']>;
  avatarURL?: Maybe<Scalars['String']>;
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

export type SubgraphColonyExtension = {
  id: Scalars['String'];
  address: Scalars['String'];
  hash: Scalars['String'];
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

export type ActionsFilter = {
  payment_contains?: Maybe<Scalars['String']>;
};

export type EventsFilter = {
  associatedColony_contains?: Maybe<Scalars['String']>;
  associatedColony?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Scalars['String']>>;
};

export type OneTxPayment = {
  id: Scalars['String'];
  agent: Scalars['String'];
  transaction: SubgraphTransaction;
  payment: SubgraphPayment;
};

export type EventProcessedValues = {
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

export type SubscriptionEvent = {
  id: Scalars['String'];
  transaction: SubgraphTransaction;
  address: Scalars['String'];
  name: Scalars['String'];
  args: Scalars['String'];
  associatedColony: SubgraphColony;
  processedValues: EventProcessedValues;
};

export type Subscription = {
  oneTxPayments: Array<OneTxPayment>;
  events: Array<SubscriptionEvent>;
};


export type SubscriptionOneTxPaymentsArgs = {
  skip: Scalars['Int'];
  first: Scalars['Int'];
  where: ActionsFilter;
};


export type SubscriptionEventsArgs = {
  skip: Scalars['Int'];
  first: Scalars['Int'];
  where: EventsFilter;
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

export type SetNetworkContractsMutationVariables = Exact<{
  input: NetworkContractsInput;
}>;


export type SetNetworkContractsMutation = { setNetworkContracts: Pick<NetworkContracts, 'version' | 'feeInverse'> };

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
}>;


export type UserReputationQuery = Pick<Query, 'userReputation'>;

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
}>;


export type UserBalanceWithLockQuery = { user: (
    Pick<User, 'id'>
    & { userLock: Pick<UserLock, 'balance'> }
  ) };

export type UsernameQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type UsernameQuery = Pick<Query, 'username'>;

export type UserAddressQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type UserAddressQuery = Pick<Query, 'userAddress'>;

export type ColonyExtensionsQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ColonyExtensionsQuery = { processedColony: (
    Pick<ProcessedColony, 'id' | 'colonyAddress'>
    & { installedExtensions: Array<(
      Pick<ColonyExtension, 'id' | 'extensionId' | 'address'>
      & { details: Pick<ColonyExtensionDetails, 'deprecated' | 'initialized' | 'installedBy' | 'installedAt' | 'missingPermissions'> }
    )> }
  ) };

export type ColonyExtensionQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  extensionId: Scalars['String'];
}>;


export type ColonyExtensionQuery = { colonyExtension?: Maybe<(
    Pick<ColonyExtension, 'id' | 'address' | 'extensionId'>
    & { details: Pick<ColonyExtensionDetails, 'deprecated' | 'initialized' | 'installedBy' | 'installedAt' | 'missingPermissions'> }
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
    Pick<ColonyAction, 'hash' | 'actionInitiator' | 'fromDomain' | 'toDomain' | 'recipient' | 'status' | 'createdAt' | 'actionType' | 'amount' | 'tokenAddress' | 'annotationHash' | 'newVersion' | 'oldVersion' | 'colonyDisplayName' | 'colonyAvatarHash' | 'colonyTokens' | 'domainName' | 'domainPurpose' | 'domainColor' | 'blockNumber'>
    & { events: Array<Pick<ParsedEvent, 'type' | 'name' | 'values' | 'createdAt' | 'emmitedBy' | 'transactionHash'>>, roles: Array<Pick<ColonyActionRoles, 'id' | 'setTo'>> }
  ) };

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

export type MetaColonyQueryVariables = Exact<{ [key: string]: never; }>;


export type MetaColonyQuery = { processedMetaColony?: Maybe<Pick<ProcessedMetaColony, 'id' | 'colonyAddress' | 'colonyName' | 'displayName' | 'avatarHash' | 'avatarURL'>> };

export type ActionsThatNeedAttentionQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  walletAddress: Scalars['String'];
}>;


export type ActionsThatNeedAttentionQuery = { actionsThatNeedAttention: Array<Maybe<Pick<ActionThatNeedsAttention, 'transactionHash' | 'needsAction'>>> };

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
    ), extensions?: Maybe<Array<Pick<SubgraphColonyExtension, 'address' | 'hash'>>> }
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

export type ColonySubscribedUsersQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type ColonySubscribedUsersQuery = { subscribedUsers: Array<(
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
  )> };

export type ColonyMembersWithReputationQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  domainId?: Maybe<Scalars['Int']>;
}>;


export type ColonyMembersWithReputationQuery = Pick<Query, 'colonyMembersWithReputation'>;

export type SubscriptionSubgraphEventsSubscriptionVariables = Exact<{
  skip: Scalars['Int'];
  first: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type SubscriptionSubgraphEventsSubscription = { events: Array<(
    Pick<SubscriptionEvent, 'id' | 'address' | 'name' | 'args'>
    & { associatedColony: (
      { colonyAddress: SubgraphColony['id'], id: SubgraphColony['colonyChainId'] }
      & { token: (
        Pick<SubgraphToken, 'decimals' | 'symbol'>
        & { address: SubgraphToken['id'] }
      ) }
    ), transaction: (
      { hash: SubgraphTransaction['id'] }
      & { block: Pick<SubgraphBlock, 'timestamp'> }
    ) }
  )> };

export type SubscriptionSubgraphOneTxSubscriptionVariables = Exact<{
  skip: Scalars['Int'];
  first: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type SubscriptionSubgraphOneTxSubscription = { oneTxPayments: Array<(
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

export type SubscriptionSubgraphEventsThatAreActionsSubscriptionVariables = Exact<{
  skip: Scalars['Int'];
  first: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type SubscriptionSubgraphEventsThatAreActionsSubscription = { events: Array<(
    Pick<SubscriptionEvent, 'id' | 'address' | 'name' | 'args'>
    & { associatedColony: (
      { colonyAddress: SubgraphColony['id'], id: SubgraphColony['colonyChainId'] }
      & { token: (
        Pick<SubgraphToken, 'decimals' | 'symbol'>
        & { address: SubgraphToken['id'] }
      ) }
    ), transaction: (
      { hash: SubgraphTransaction['id'] }
      & { block: Pick<SubgraphBlock, 'timestamp'> }
    ), processedValues: Pick<EventProcessedValues, 'agent' | 'who' | 'fromPot' | 'fromDomain' | 'toPot' | 'toDomain' | 'domainId' | 'amount' | 'token' | 'metadata' | 'user' | 'oldVersion' | 'newVersion' | 'storageSlot' | 'storageSlotValue'> }
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
export const SetNetworkContractsDocument = gql`
    mutation SetNetworkContracts($input: NetworkContractsInput!) {
  setNetworkContracts(input: $input) @client {
    version
    feeInverse
  }
}
    `;
export type SetNetworkContractsMutationFn = Apollo.MutationFunction<SetNetworkContractsMutation, SetNetworkContractsMutationVariables>;

/**
 * __useSetNetworkContractsMutation__
 *
 * To run a mutation, you first call `useSetNetworkContractsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetNetworkContractsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setNetworkContractsMutation, { data, loading, error }] = useSetNetworkContractsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetNetworkContractsMutation(baseOptions?: Apollo.MutationHookOptions<SetNetworkContractsMutation, SetNetworkContractsMutationVariables>) {
        return Apollo.useMutation<SetNetworkContractsMutation, SetNetworkContractsMutationVariables>(SetNetworkContractsDocument, baseOptions);
      }
export type SetNetworkContractsMutationHookResult = ReturnType<typeof useSetNetworkContractsMutation>;
export type SetNetworkContractsMutationResult = Apollo.MutationResult<SetNetworkContractsMutation>;
export type SetNetworkContractsMutationOptions = Apollo.BaseMutationOptions<SetNetworkContractsMutation, SetNetworkContractsMutationVariables>;
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
    query UserReputation($address: String!, $colonyAddress: String!, $domainId: Int) {
  userReputation(address: $address, colonyAddress: $colonyAddress, domainId: $domainId) @client
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
    query UserBalanceWithLock($address: String!, $tokenAddress: String!) {
  user(address: $address) {
    id
    userLock(walletAddress: $address, tokenAddress: $tokenAddress) @client {
      balance
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
    roles {
      id
      setTo
    }
    blockNumber
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
      address
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
export const ColonySubscribedUsersDocument = gql`
    query ColonySubscribedUsers($colonyAddress: String!) {
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
 * __useColonySubscribedUsersQuery__
 *
 * To run a query within a React component, call `useColonySubscribedUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonySubscribedUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonySubscribedUsersQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useColonySubscribedUsersQuery(baseOptions?: Apollo.QueryHookOptions<ColonySubscribedUsersQuery, ColonySubscribedUsersQueryVariables>) {
        return Apollo.useQuery<ColonySubscribedUsersQuery, ColonySubscribedUsersQueryVariables>(ColonySubscribedUsersDocument, baseOptions);
      }
export function useColonySubscribedUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonySubscribedUsersQuery, ColonySubscribedUsersQueryVariables>) {
          return Apollo.useLazyQuery<ColonySubscribedUsersQuery, ColonySubscribedUsersQueryVariables>(ColonySubscribedUsersDocument, baseOptions);
        }
export type ColonySubscribedUsersQueryHookResult = ReturnType<typeof useColonySubscribedUsersQuery>;
export type ColonySubscribedUsersLazyQueryHookResult = ReturnType<typeof useColonySubscribedUsersLazyQuery>;
export type ColonySubscribedUsersQueryResult = Apollo.QueryResult<ColonySubscribedUsersQuery, ColonySubscribedUsersQueryVariables>;
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
export const SubscriptionSubgraphEventsDocument = gql`
    subscription SubscriptionSubgraphEvents($skip: Int!, $first: Int!, $colonyAddress: String!) {
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
        timestamp
      }
    }
    name
    args
  }
}
    `;

/**
 * __useSubscriptionSubgraphEventsSubscription__
 *
 * To run a query within a React component, call `useSubscriptionSubgraphEventsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscriptionSubgraphEventsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscriptionSubgraphEventsSubscription({
 *   variables: {
 *      skip: // value for 'skip'
 *      first: // value for 'first'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useSubscriptionSubgraphEventsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SubscriptionSubgraphEventsSubscription, SubscriptionSubgraphEventsSubscriptionVariables>) {
        return Apollo.useSubscription<SubscriptionSubgraphEventsSubscription, SubscriptionSubgraphEventsSubscriptionVariables>(SubscriptionSubgraphEventsDocument, baseOptions);
      }
export type SubscriptionSubgraphEventsSubscriptionHookResult = ReturnType<typeof useSubscriptionSubgraphEventsSubscription>;
export type SubscriptionSubgraphEventsSubscriptionResult = Apollo.SubscriptionResult<SubscriptionSubgraphEventsSubscription>;
export const SubscriptionSubgraphOneTxDocument = gql`
    subscription SubscriptionSubgraphOneTx($skip: Int!, $first: Int!, $colonyAddress: String!) {
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
 * __useSubscriptionSubgraphOneTxSubscription__
 *
 * To run a query within a React component, call `useSubscriptionSubgraphOneTxSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscriptionSubgraphOneTxSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscriptionSubgraphOneTxSubscription({
 *   variables: {
 *      skip: // value for 'skip'
 *      first: // value for 'first'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useSubscriptionSubgraphOneTxSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SubscriptionSubgraphOneTxSubscription, SubscriptionSubgraphOneTxSubscriptionVariables>) {
        return Apollo.useSubscription<SubscriptionSubgraphOneTxSubscription, SubscriptionSubgraphOneTxSubscriptionVariables>(SubscriptionSubgraphOneTxDocument, baseOptions);
      }
export type SubscriptionSubgraphOneTxSubscriptionHookResult = ReturnType<typeof useSubscriptionSubgraphOneTxSubscription>;
export type SubscriptionSubgraphOneTxSubscriptionResult = Apollo.SubscriptionResult<SubscriptionSubgraphOneTxSubscription>;
export const SubscriptionSubgraphEventsThatAreActionsDocument = gql`
    subscription SubscriptionSubgraphEventsThatAreActions($skip: Int!, $first: Int!, $colonyAddress: String!) {
  events(skip: $skip, first: $first, where: {associatedColony_contains: $colonyAddress, name_in: ["TokensMinted(address,address,uint256)", "DomainAdded(address,uint256)", "ColonyMetadata(address,string)", "ColonyFundsMovedBetweenFundingPots(address,uint256,uint256,uint256,address)", "DomainMetadata(address,uint256,string)", "ColonyRoleSet(address,address,uint256,uint8,bool)", "ColonyUpgraded(address,uint256,uint256)", "ColonyUpgraded(uint256,uint256)", "RecoveryModeEntered(address)"]}) {
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
 * __useSubscriptionSubgraphEventsThatAreActionsSubscription__
 *
 * To run a query within a React component, call `useSubscriptionSubgraphEventsThatAreActionsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscriptionSubgraphEventsThatAreActionsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscriptionSubgraphEventsThatAreActionsSubscription({
 *   variables: {
 *      skip: // value for 'skip'
 *      first: // value for 'first'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useSubscriptionSubgraphEventsThatAreActionsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SubscriptionSubgraphEventsThatAreActionsSubscription, SubscriptionSubgraphEventsThatAreActionsSubscriptionVariables>) {
        return Apollo.useSubscription<SubscriptionSubgraphEventsThatAreActionsSubscription, SubscriptionSubgraphEventsThatAreActionsSubscriptionVariables>(SubscriptionSubgraphEventsThatAreActionsDocument, baseOptions);
      }
export type SubscriptionSubgraphEventsThatAreActionsSubscriptionHookResult = ReturnType<typeof useSubscriptionSubgraphEventsThatAreActionsSubscription>;
export type SubscriptionSubgraphEventsThatAreActionsSubscriptionResult = Apollo.SubscriptionResult<SubscriptionSubgraphEventsThatAreActionsSubscription>;
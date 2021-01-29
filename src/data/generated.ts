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
        "name": "TaskEvent",
        "possibleTypes": [
          {
            "name": "AssignWorkerEvent"
          },
          {
            "name": "UnassignWorkerEvent"
          },
          {
            "name": "CancelTaskEvent"
          },
          {
            "name": "CreateTaskEvent"
          },
          {
            "name": "CreateWorkRequestEvent"
          },
          {
            "name": "FinalizeTaskEvent"
          },
          {
            "name": "SetTaskPendingEvent"
          },
          {
            "name": "RemoveTaskPayoutEvent"
          },
          {
            "name": "SendWorkInviteEvent"
          },
          {
            "name": "SetTaskDescriptionEvent"
          },
          {
            "name": "SetTaskDomainEvent"
          },
          {
            "name": "SetTaskDueDateEvent"
          },
          {
            "name": "SetTaskPayoutEvent"
          },
          {
            "name": "SetTaskSkillEvent"
          },
          {
            "name": "RemoveTaskSkillEvent"
          },
          {
            "name": "SetTaskTitleEvent"
          },
          {
            "name": "TaskMessageEvent"
          }
        ]
      },
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
            "name": "AssignWorkerEvent"
          },
          {
            "name": "CancelTaskEvent"
          },
          {
            "name": "CreateDomainEvent"
          },
          {
            "name": "CreateTaskEvent"
          },
          {
            "name": "CreateWorkRequestEvent"
          },
          {
            "name": "FinalizeTaskEvent"
          },
          {
            "name": "NewUserEvent"
          },
          {
            "name": "RemoveTaskPayoutEvent"
          },
          {
            "name": "SendWorkInviteEvent"
          },
          {
            "name": "SetTaskDescriptionEvent"
          },
          {
            "name": "SetTaskDomainEvent"
          },
          {
            "name": "SetTaskDueDateEvent"
          },
          {
            "name": "SetTaskPayoutEvent"
          },
          {
            "name": "SetTaskPendingEvent"
          },
          {
            "name": "SetTaskSkillEvent"
          },
          {
            "name": "RemoveTaskSkillEvent"
          },
          {
            "name": "SetTaskTitleEvent"
          },
          {
            "name": "TaskMessageEvent"
          },
          {
            "name": "UnassignWorkerEvent"
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

export type TaskEvent = {
  type: EventType;
  taskId: Scalars['String'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type ColonyEvent = {
  type: EventType;
  colonyAddress?: Maybe<Scalars['String']>;
};

export type AssignWorkerEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  workerAddress: Scalars['String'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type UnassignWorkerEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  workerAddress: Scalars['String'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type CancelTaskEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type CreateDomainEvent = ColonyEvent & {
  type: EventType;
  ethDomainId: Scalars['Int'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type CreateTaskEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  ethDomainId: Scalars['Int'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type CreateWorkRequestEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type FinalizeTaskEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type SetTaskPendingEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  txHash: Scalars['String'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type RemoveTaskPayoutEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  tokenAddress: Scalars['String'];
  amount: Scalars['String'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type SendWorkInviteEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  workerAddress: Scalars['String'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type SetTaskDescriptionEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  description: Scalars['String'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type SetTaskDomainEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  ethDomainId: Scalars['Int'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type SetTaskDueDateEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  dueDate?: Maybe<Scalars['DateTime']>;
  colonyAddress?: Maybe<Scalars['String']>;
};

export type SetTaskPayoutEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  tokenAddress: Scalars['String'];
  amount: Scalars['String'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type SetTaskSkillEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  ethSkillId: Scalars['Int'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type RemoveTaskSkillEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  ethSkillId: Scalars['Int'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type SetTaskTitleEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  title: Scalars['String'];
  colonyAddress?: Maybe<Scalars['String']>;
};

export type TaskMessageEvent = TaskEvent & {
  type: EventType;
  taskId: Scalars['String'];
  message: Scalars['String'];
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

export type EventContext = AssignWorkerEvent | CancelTaskEvent | CreateDomainEvent | CreateTaskEvent | CreateWorkRequestEvent | FinalizeTaskEvent | NewUserEvent | RemoveTaskPayoutEvent | SendWorkInviteEvent | SetTaskDescriptionEvent | SetTaskDomainEvent | SetTaskDueDateEvent | SetTaskPayoutEvent | SetTaskPendingEvent | SetTaskSkillEvent | RemoveTaskSkillEvent | SetTaskTitleEvent | TaskMessageEvent | UnassignWorkerEvent | TransactionMessageEvent;

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

export type CreateTaskInput = {
  colonyAddress: Scalars['String'];
  ethDomainId: Scalars['Int'];
};

export type SetTaskDomainInput = {
  id: Scalars['String'];
  ethDomainId: Scalars['Int'];
};

export type SetTaskSkillInput = {
  id: Scalars['String'];
  ethSkillId: Scalars['Int'];
};

export type RemoveTaskSkillInput = {
  id: Scalars['String'];
  ethSkillId: Scalars['Int'];
};

export type SetTaskTitleInput = {
  id: Scalars['String'];
  title: Scalars['String'];
};

export type SetTaskDescriptionInput = {
  id: Scalars['String'];
  description: Scalars['String'];
};

export type SetTaskDueDateInput = {
  id: Scalars['String'];
  dueDate?: Maybe<Scalars['DateTime']>;
};

export type CreateWorkRequestInput = {
  id: Scalars['String'];
};

export type SendWorkInviteInput = {
  id: Scalars['String'];
  workerAddress: Scalars['String'];
};

export type SetTaskPayoutInput = {
  id: Scalars['String'];
  amount: Scalars['String'];
  tokenAddress: Scalars['String'];
};

export type RemoveTaskPayoutInput = {
  id: Scalars['String'];
  amount: Scalars['String'];
  tokenAddress: Scalars['String'];
};

export type AssignWorkerInput = {
  id: Scalars['String'];
  workerAddress: Scalars['String'];
};

export type UnassignWorkerInput = {
  id: Scalars['String'];
  workerAddress: Scalars['String'];
};

export type TaskIdInput = {
  id: Scalars['String'];
};

export type SetTaskPendingInput = {
  id: Scalars['String'];
  txHash: Scalars['String'];
};

export type FinalizeTaskInput = {
  id: Scalars['String'];
  ethPotId: Scalars['Int'];
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

export type SendTaskMessageInput = {
  id: Scalars['String'];
  message: Scalars['String'];
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

export type CreateTaskFromSuggestionInput = {
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
  assignWorker?: Maybe<Task>;
  cancelTask?: Maybe<Task>;
  clearLoggedInUser: LoggedInUser;
  createSuggestion?: Maybe<Suggestion>;
  createTask?: Maybe<Task>;
  createTaskFromSuggestion?: Maybe<Task>;
  createUser?: Maybe<User>;
  createWorkRequest?: Maybe<Task>;
  editUser?: Maybe<User>;
  finalizeTask?: Maybe<Task>;
  markAllNotificationsAsRead: Scalars['Boolean'];
  markNotificationAsRead: Scalars['Boolean'];
  removeTaskPayout?: Maybe<Task>;
  removeTaskSkill?: Maybe<Task>;
  removeUpvoteFromSuggestion?: Maybe<Suggestion>;
  sendTaskMessage: Scalars['Boolean'];
  sendTransactionMessage: Scalars['Boolean'];
  sendWorkInvite?: Maybe<Task>;
  setLoggedInUser: LoggedInUser;
  setNetworkContracts: NetworkContracts;
  setSuggestionStatus?: Maybe<Suggestion>;
  setTaskDescription?: Maybe<Task>;
  setTaskDomain?: Maybe<Task>;
  setTaskDueDate?: Maybe<Task>;
  setTaskPayout?: Maybe<Task>;
  setTaskPending?: Maybe<Task>;
  setTaskSkill?: Maybe<Task>;
  setTaskTitle?: Maybe<Task>;
  setUserTokens?: Maybe<User>;
  subscribeToColony?: Maybe<User>;
  unassignWorker?: Maybe<Task>;
  unsubscribeFromColony?: Maybe<User>;
  updateNetworkContracts: NetworkContracts;
};


export type MutationAddUpvoteToSuggestionArgs = {
  input: AddUpvoteToSuggestionInput;
};


export type MutationAssignWorkerArgs = {
  input: AssignWorkerInput;
};


export type MutationCancelTaskArgs = {
  input: TaskIdInput;
};


export type MutationCreateSuggestionArgs = {
  input: CreateSuggestionInput;
};


export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};


export type MutationCreateTaskFromSuggestionArgs = {
  input: CreateTaskFromSuggestionInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateWorkRequestArgs = {
  input: CreateWorkRequestInput;
};


export type MutationEditUserArgs = {
  input: EditUserInput;
};


export type MutationFinalizeTaskArgs = {
  input: FinalizeTaskInput;
};


export type MutationMarkNotificationAsReadArgs = {
  input: MarkNotificationAsReadInput;
};


export type MutationRemoveTaskPayoutArgs = {
  input: RemoveTaskPayoutInput;
};


export type MutationRemoveTaskSkillArgs = {
  input: RemoveTaskSkillInput;
};


export type MutationRemoveUpvoteFromSuggestionArgs = {
  input: RemoveUpvoteFromSuggestionInput;
};


export type MutationSendTaskMessageArgs = {
  input: SendTaskMessageInput;
};


export type MutationSendTransactionMessageArgs = {
  input: SendTransactionMessageInput;
};


export type MutationSendWorkInviteArgs = {
  input: SendWorkInviteInput;
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


export type MutationSetTaskDescriptionArgs = {
  input: SetTaskDescriptionInput;
};


export type MutationSetTaskDomainArgs = {
  input: SetTaskDomainInput;
};


export type MutationSetTaskDueDateArgs = {
  input: SetTaskDueDateInput;
};


export type MutationSetTaskPayoutArgs = {
  input: SetTaskPayoutInput;
};


export type MutationSetTaskPendingArgs = {
  input: SetTaskPendingInput;
};


export type MutationSetTaskSkillArgs = {
  input: SetTaskSkillInput;
};


export type MutationSetTaskTitleArgs = {
  input: SetTaskTitleInput;
};


export type MutationSetUserTokensArgs = {
  input: SetUserTokensInput;
};


export type MutationSubscribeToColonyArgs = {
  input: SubscribeToColonyInput;
};


export type MutationUnassignWorkerArgs = {
  input: UnassignWorkerInput;
};


export type MutationUnsubscribeFromColonyArgs = {
  input: UnsubscribeFromColonyInput;
};

export type Query = {
  colonies: Array<SubgraphColony>;
  colony: SubgraphColony;
  colonyAction: ColonyAction;
  colonyAddress: Scalars['String'];
  colonyDomain: ProcessedDomain;
  colonyMembersWithReputation?: Maybe<Array<Scalars['String']>>;
  colonyName: Scalars['String'];
  domains: Array<SubgraphDomain>;
  events: Array<SubgraphEvent>;
  loggedInUser: LoggedInUser;
  networkContracts: NetworkContracts;
  oneTxPaymentExtensionAddress?: Maybe<Scalars['String']>;
  oneTxPayments: Array<OneTxPayment>;
  processedColony: ProcessedColony;
  subscribedUsers: Array<User>;
  systemInfo: SystemInfo;
  task: Task;
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


export type QueryColoniesArgs = {
  where: ByColoniesAddressesFilter;
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


export type QueryEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  where: EventsFilter;
};


export type QueryOneTxPaymentsArgs = {
  skip: Scalars['Int'];
  first: Scalars['Int'];
  where: ActionsFilter;
};


export type QueryProcessedColonyArgs = {
  address: Scalars['String'];
};


export type QuerySubscribedUsersArgs = {
  colonyAddress: Scalars['String'];
};


export type QueryTaskArgs = {
  id: Scalars['String'];
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
  taskId?: Maybe<Scalars['String']>;
  upvotes: Array<Scalars['String']>;
};

export type TaskPayout = {
  amount: Scalars['String'];
  token: Token;
  tokenAddress: Scalars['String'];
};

export type Task = {
  assignedWorker?: Maybe<User>;
  assignedWorkerAddress?: Maybe<Scalars['String']>;
  cancelledAt?: Maybe<Scalars['DateTime']>;
  colonyAddress: Scalars['String'];
  commentCount: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  creator: User;
  creatorAddress: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['DateTime']>;
  ethDomainId: Scalars['Int'];
  ethPotId?: Maybe<Scalars['Int']>;
  ethSkillId?: Maybe<Scalars['Int']>;
  events: Array<Event>;
  finalizedAt?: Maybe<Scalars['DateTime']>;
  finalizedPayment?: Maybe<TaskFinalizedPayment>;
  id: Scalars['String'];
  payouts: Array<TaskPayout>;
  title?: Maybe<Scalars['String']>;
  txHash?: Maybe<Scalars['String']>;
  workInviteAddresses: Array<Scalars['String']>;
  workInvites: Array<User>;
  workRequestAddresses: Array<Scalars['String']>;
  workRequests: Array<User>;
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
  taskIds: Array<Scalars['String']>;
  tasks: Array<Task>;
  tokenAddresses: Array<Scalars['String']>;
  tokenTransfers: Array<Transfer>;
  tokens: Array<Token>;
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

export type UserProfile = {
  username?: Maybe<Scalars['String']>;
  avatarHash?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  walletAddress: Scalars['String'];
  website?: Maybe<Scalars['String']>;
};


export enum EventType {
  AssignWorker = 'AssignWorker',
  CancelTask = 'CancelTask',
  CreateDomain = 'CreateDomain',
  CreateTask = 'CreateTask',
  CreateWorkRequest = 'CreateWorkRequest',
  FinalizeTask = 'FinalizeTask',
  NewUser = 'NewUser',
  RemoveTaskPayout = 'RemoveTaskPayout',
  SendWorkInvite = 'SendWorkInvite',
  SetTaskDescription = 'SetTaskDescription',
  SetTaskDomain = 'SetTaskDomain',
  SetTaskDueDate = 'SetTaskDueDate',
  SetTaskPayout = 'SetTaskPayout',
  SetTaskPending = 'SetTaskPending',
  SetTaskSkill = 'SetTaskSkill',
  RemoveTaskSkill = 'RemoveTaskSkill',
  SetTaskTitle = 'SetTaskTitle',
  TaskMessage = 'TaskMessage',
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
  name: Scalars['String'];
  values: Scalars['String'];
  createdAt: Scalars['Int'];
  emmitedBy: Scalars['String'];
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

export type TaskFinalizedPayment = {
  amount: Scalars['String'];
  tokenAddress: Scalars['String'];
  workerAddress: Scalars['String'];
  transactionHash: Scalars['String'];
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

export type ActionsFilter = {
  payment_contains?: Maybe<Scalars['String']>;
};

export type EventsFilter = {
  associatedColony_contains?: Maybe<Scalars['String']>;
  associatedColony?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Scalars['String']>>;
};

export type ByColonyFilter = {
  colonyAddress: Scalars['String'];
  domainChainId?: Maybe<Scalars['Int']>;
};

export type ByColoniesAddressesFilter = {
  id_in: Array<Maybe<Scalars['String']>>;
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
};

export type SubgraphEvent = {
  id: Scalars['String'];
  transaction: SubgraphTransaction;
  address: Scalars['String'];
  name: Scalars['String'];
  args: Scalars['String'];
  associatedColony: SubgraphColony;
};

export type OneTxPayment = {
  id: Scalars['String'];
  agent: Scalars['String'];
  transaction: SubgraphTransaction;
  payment: SubgraphPayment;
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
  balances: Array<ProcessedTokenBalances>;
};


export type ProcessedTokensBalancesArgs = {
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
  canMakePayment: Scalars['Boolean'];
};

export type PayoutsFragment = { payouts: Array<(
    Pick<TaskPayout, 'amount' | 'tokenAddress'>
    & { token: Pick<Token, 'id' | 'address' | 'decimals' | 'name' | 'symbol'> }
  )> };

export type CreateTaskFieldsFragment = (
  Pick<Task, 'id' | 'assignedWorkerAddress' | 'cancelledAt' | 'colonyAddress' | 'commentCount' | 'createdAt' | 'creatorAddress' | 'dueDate' | 'ethDomainId' | 'ethSkillId' | 'finalizedAt' | 'title' | 'workRequestAddresses' | 'txHash'>
  & { assignedWorker?: Maybe<(
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'avatarHash'> }
  )>, events: Array<Pick<Event, 'id' | 'type'>> }
  & PayoutsFragment
);

export type TokensFragment = (
  Pick<ProcessedColony, 'nativeTokenAddress' | 'tokenAddresses'>
  & { tokens: Array<(
    Pick<ProcessedTokens, 'id' | 'address' | 'iconHash' | 'decimals' | 'name' | 'symbol'>
    & { balances: Array<Pick<ProcessedTokenBalances, 'domainId' | 'amount'>> }
  )> }
);

export type DomainFieldsFragment = Pick<ProcessedDomain, 'id' | 'color' | 'description' | 'ethDomainId' | 'name' | 'ethParentDomainId'>;

export type ColonyProfileFragment = Pick<ProcessedColony, 'id' | 'colonyAddress' | 'colonyName' | 'displayName' | 'avatarHash' | 'avatarURL'>;

export type FullColonyFragment = (
  Pick<ProcessedColony, 'version' | 'canMintNativeToken' | 'canUnlockNativeToken' | 'isInRecoveryMode' | 'isNativeTokenLocked' | 'canMakePayment'>
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

export type EventContextFragment = { context: Pick<AssignWorkerEvent, 'taskId' | 'type' | 'workerAddress' | 'colonyAddress'> | Pick<CancelTaskEvent, 'taskId' | 'type' | 'colonyAddress'> | Pick<CreateDomainEvent, 'type' | 'ethDomainId' | 'colonyAddress'> | Pick<CreateTaskEvent, 'colonyAddress' | 'ethDomainId' | 'taskId' | 'type'> | Pick<CreateWorkRequestEvent, 'taskId' | 'type' | 'colonyAddress'> | Pick<FinalizeTaskEvent, 'taskId' | 'type' | 'colonyAddress'> | Pick<RemoveTaskPayoutEvent, 'amount' | 'taskId' | 'tokenAddress' | 'type' | 'colonyAddress'> | Pick<SendWorkInviteEvent, 'taskId' | 'type' | 'workerAddress' | 'colonyAddress'> | Pick<SetTaskDescriptionEvent, 'description' | 'taskId' | 'type' | 'colonyAddress'> | Pick<SetTaskDomainEvent, 'ethDomainId' | 'taskId' | 'type' | 'colonyAddress'> | Pick<SetTaskDueDateEvent, 'dueDate' | 'taskId' | 'type' | 'colonyAddress'> | Pick<SetTaskPayoutEvent, 'amount' | 'taskId' | 'tokenAddress' | 'type' | 'colonyAddress'> | Pick<SetTaskPendingEvent, 'taskId' | 'type' | 'colonyAddress' | 'txHash'> | Pick<SetTaskSkillEvent, 'ethSkillId' | 'taskId' | 'type' | 'colonyAddress'> | Pick<RemoveTaskSkillEvent, 'ethSkillId' | 'taskId' | 'type' | 'colonyAddress'> | Pick<SetTaskTitleEvent, 'taskId' | 'title' | 'type' | 'colonyAddress'> | Pick<TaskMessageEvent, 'colonyAddress' | 'message' | 'taskId' | 'type'> | Pick<UnassignWorkerEvent, 'taskId' | 'type' | 'workerAddress' | 'colonyAddress'> };

export type TaskEventFragment = (
  EventFieldsFragment
  & EventContextFragment
);

export type FullNetworkEventFragment = Pick<NetworkEvent, 'fromAddress' | 'toAddress' | 'createdAt' | 'name' | 'hash' | 'topic' | 'userAddress' | 'domainId'>;

export type TransactionEventContextFragment = { context: Pick<TransactionMessageEvent, 'type' | 'transactionHash' | 'message' | 'colonyAddress'> };

export type TransactionMessageFragment = (
  EventFieldsFragment
  & TransactionEventContextFragment
);

export type AssignWorkerMutationVariables = Exact<{
  input: AssignWorkerInput;
}>;


export type AssignWorkerMutation = { assignWorker?: Maybe<(
    Pick<Task, 'id' | 'assignedWorkerAddress'>
    & { assignedWorker?: Maybe<Pick<User, 'id'>>, events: Array<TaskEventFragment> }
  )> };

export type CancelTaskMutationVariables = Exact<{
  input: TaskIdInput;
}>;


export type CancelTaskMutation = { cancelTask?: Maybe<(
    Pick<Task, 'id' | 'cancelledAt'>
    & { events: Array<TaskEventFragment> }
  )> };

export type CreateTaskMutationVariables = Exact<{
  input: CreateTaskInput;
}>;


export type CreateTaskMutation = { createTask?: Maybe<CreateTaskFieldsFragment> };

export type CreateWorkRequestMutationVariables = Exact<{
  input: CreateWorkRequestInput;
}>;


export type CreateWorkRequestMutation = { createWorkRequest?: Maybe<(
    Pick<Task, 'id' | 'workRequestAddresses'>
    & { events: Array<TaskEventFragment>, workRequests: Array<Pick<User, 'id'>> }
  )> };

export type FinalizeTaskMutationVariables = Exact<{
  input: FinalizeTaskInput;
}>;


export type FinalizeTaskMutation = { finalizeTask?: Maybe<(
    Pick<Task, 'id' | 'colonyAddress' | 'ethPotId' | 'finalizedAt'>
    & { events: Array<TaskEventFragment>, finalizedPayment?: Maybe<Pick<TaskFinalizedPayment, 'amount' | 'tokenAddress' | 'workerAddress' | 'transactionHash'>> }
  )> };

export type RemoveTaskPayoutMutationVariables = Exact<{
  input: RemoveTaskPayoutInput;
}>;


export type RemoveTaskPayoutMutation = { removeTaskPayout?: Maybe<(
    Pick<Task, 'id'>
    & { events: Array<TaskEventFragment> }
    & PayoutsFragment
  )> };

export type SendWorkInviteMutationVariables = Exact<{
  input: SendWorkInviteInput;
}>;


export type SendWorkInviteMutation = { sendWorkInvite?: Maybe<(
    Pick<Task, 'id' | 'workInviteAddresses'>
    & { events: Array<TaskEventFragment>, workInvites: Array<Pick<User, 'id'>> }
  )> };

export type SetTaskDomainMutationVariables = Exact<{
  input: SetTaskDomainInput;
}>;


export type SetTaskDomainMutation = { setTaskDomain?: Maybe<(
    Pick<Task, 'id' | 'ethDomainId'>
    & { events: Array<TaskEventFragment> }
  )> };

export type SetTaskDescriptionMutationVariables = Exact<{
  input: SetTaskDescriptionInput;
}>;


export type SetTaskDescriptionMutation = { setTaskDescription?: Maybe<(
    Pick<Task, 'id' | 'description'>
    & { events: Array<TaskEventFragment> }
  )> };

export type SetTaskDueDateMutationVariables = Exact<{
  input: SetTaskDueDateInput;
}>;


export type SetTaskDueDateMutation = { setTaskDueDate?: Maybe<(
    Pick<Task, 'id' | 'dueDate'>
    & { events: Array<TaskEventFragment> }
  )> };

export type SetTaskPayoutMutationVariables = Exact<{
  input: SetTaskPayoutInput;
}>;


export type SetTaskPayoutMutation = { setTaskPayout?: Maybe<(
    Pick<Task, 'id'>
    & { events: Array<TaskEventFragment>, payouts: Array<(
      Pick<TaskPayout, 'amount' | 'tokenAddress'>
      & { token: Pick<Token, 'id' | 'address'> }
    )> }
  )> };

export type SetTaskSkillMutationVariables = Exact<{
  input: SetTaskSkillInput;
}>;


export type SetTaskSkillMutation = { setTaskSkill?: Maybe<(
    Pick<Task, 'id' | 'ethSkillId'>
    & { events: Array<TaskEventFragment> }
  )> };

export type RemoveTaskSkillMutationVariables = Exact<{
  input: RemoveTaskSkillInput;
}>;


export type RemoveTaskSkillMutation = { removeTaskSkill?: Maybe<(
    Pick<Task, 'id' | 'ethSkillId'>
    & { events: Array<TaskEventFragment> }
  )> };

export type SetTaskTitleMutationVariables = Exact<{
  input: SetTaskTitleInput;
}>;


export type SetTaskTitleMutation = { setTaskTitle?: Maybe<(
    Pick<Task, 'id' | 'title'>
    & { events: Array<TaskEventFragment> }
  )> };

export type UnassignWorkerMutationVariables = Exact<{
  input: UnassignWorkerInput;
}>;


export type UnassignWorkerMutation = { unassignWorker?: Maybe<(
    Pick<Task, 'id' | 'assignedWorkerAddress'>
    & { assignedWorker?: Maybe<Pick<User, 'id'>>, events: Array<TaskEventFragment> }
  )> };

export type SetTaskPendingMutationVariables = Exact<{
  input: SetTaskPendingInput;
}>;


export type SetTaskPendingMutation = { setTaskPending?: Maybe<(
    Pick<Task, 'id'>
    & { events: Array<TaskEventFragment> }
  )> };

export type SendTaskMessageMutationVariables = Exact<{
  input: SendTaskMessageInput;
}>;


export type SendTaskMessageMutation = Pick<Mutation, 'sendTaskMessage'>;

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

export type TaskQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type TaskQuery = { task: (
    Pick<Task, 'id' | 'assignedWorkerAddress' | 'cancelledAt' | 'colonyAddress' | 'commentCount' | 'createdAt' | 'creatorAddress' | 'description' | 'dueDate' | 'ethDomainId' | 'ethSkillId' | 'ethPotId' | 'finalizedAt' | 'title' | 'workInviteAddresses' | 'workRequestAddresses' | 'txHash'>
    & { assignedWorker?: Maybe<(
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    )>, creator: (
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    ), events: Array<Pick<Event, 'id' | 'type'>>, workInvites: Array<(
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    )>, workRequests: Array<(
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    )> }
    & PayoutsFragment
  ) };

export type TaskToEditQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type TaskToEditQuery = { task: (
    Pick<Task, 'id'>
    & { assignedWorker?: Maybe<(
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    )>, workRequests: Array<(
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    )> }
    & PayoutsFragment
  ) };

export type TaskFeedEventsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type TaskFeedEventsQuery = { task: (
    Pick<Task, 'id' | 'colonyAddress' | 'ethDomainId' | 'ethPotId' | 'finalizedAt' | 'txHash'>
    & { events: Array<TaskEventFragment>, finalizedPayment?: Maybe<Pick<TaskFinalizedPayment, 'amount' | 'tokenAddress' | 'workerAddress' | 'transactionHash'>> }
    & PayoutsFragment
  ) };

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

export type UserTasksQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type UserTasksQuery = { user: (
    Pick<User, 'id'>
    & { tasks: Array<(
      Pick<Task, 'id' | 'assignedWorkerAddress' | 'cancelledAt' | 'colonyAddress' | 'commentCount' | 'createdAt' | 'creatorAddress' | 'dueDate' | 'ethDomainId' | 'ethSkillId' | 'finalizedAt' | 'title' | 'workRequestAddresses' | 'txHash'>
      & { assignedWorker?: Maybe<(
        Pick<User, 'id'>
        & { profile: Pick<UserProfile, 'avatarHash'> }
      )>, events: Array<Pick<Event, 'id' | 'type'>> }
      & PayoutsFragment
    )> }
  ) };

export type UserTokensQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type UserTokensQuery = { user: (
    Pick<User, 'id' | 'tokenAddresses'>
    & { tokens: Array<Pick<Token, 'id' | 'address' | 'iconHash' | 'decimals' | 'name' | 'symbol' | 'balance'>> }
  ) };

export type UsernameQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type UsernameQuery = Pick<Query, 'username'>;

export type UserAddressQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type UserAddressQuery = Pick<Query, 'userAddress'>;

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

export type OneTxPaymentExtensionAddressQueryVariables = Exact<{ [key: string]: never; }>;


export type OneTxPaymentExtensionAddressQuery = Pick<Query, 'oneTxPaymentExtensionAddress'>;

export type ColonyActionQueryVariables = Exact<{
  transactionHash: Scalars['String'];
  colonyAddress: Scalars['String'];
}>;


export type ColonyActionQuery = { colonyAction: (
    Pick<ColonyAction, 'hash' | 'actionInitiator' | 'fromDomain' | 'toDomain' | 'recipient' | 'status' | 'createdAt' | 'actionType' | 'amount' | 'tokenAddress' | 'annotationHash' | 'newVersion' | 'oldVersion' | 'colonyDisplayName' | 'colonyAvatarHash' | 'colonyTokens' | 'domainName' | 'domainPurpose' | 'domainColor'>
    & { events: Array<Pick<ParsedEvent, 'name' | 'values' | 'createdAt' | 'emmitedBy'>>, roles: Array<Pick<ColonyActionRoles, 'id' | 'setTo'>> }
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

export type SubgraphActionsQueryVariables = Exact<{
  skip: Scalars['Int'];
  first: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type SubgraphActionsQuery = { oneTxPayments: Array<(
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
  )>, events: Array<(
    Pick<SubgraphEvent, 'id' | 'args' | 'address' | 'name'>
    & { transaction: (
      { hash: SubgraphTransaction['id'] }
      & { block: Pick<SubgraphBlock, 'timestamp'> }
    ), associatedColony: { token: Pick<SubgraphToken, 'decimals' | 'symbol'> } }
  )> };

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
    & { token: (
      Pick<SubgraphToken, 'decimals' | 'symbol'>
      & { tokenAddress: SubgraphToken['id'] }
    ) }
  ) };

export type SubgraphColoniesQueryVariables = Exact<{
  colonyAddresses: Array<Maybe<Scalars['String']>>;
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

export type SubgraphEventsQueryVariables = Exact<{
  skip: Scalars['Int'];
  first: Scalars['Int'];
  colonyAddress: Scalars['String'];
}>;


export type SubgraphEventsQuery = { events: Array<(
    Pick<SubgraphEvent, 'id' | 'address' | 'name' | 'args'>
    & { associatedColony: { colonyAddress: SubgraphColony['id'], id: SubgraphColony['colonyChainId'] }, transaction: (
      { hash: SubgraphTransaction['id'] }
      & { block: Pick<SubgraphBlock, 'id' | 'timestamp'> }
    ) }
  )> };

export const PayoutsFragmentDoc = gql`
    fragment Payouts on Task {
  payouts {
    amount
    tokenAddress
    token @client {
      id
      address
      decimals
      name
      symbol
    }
  }
}
    `;
export const CreateTaskFieldsFragmentDoc = gql`
    fragment CreateTaskFields on Task {
  id
  ...Payouts
  assignedWorker {
    id
    profile {
      avatarHash
    }
  }
  assignedWorkerAddress
  cancelledAt
  colonyAddress
  commentCount @client
  createdAt
  creatorAddress
  dueDate
  ethDomainId
  ethSkillId
  events {
    id
    type
  }
  finalizedAt
  title
  workRequestAddresses
  txHash
}
    ${PayoutsFragmentDoc}`;
export const ColonyProfileFragmentDoc = gql`
    fragment ColonyProfile on ProcessedColony {
  id
  colonyAddress
  colonyName
  displayName
  avatarHash
  avatarURL
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
    balances(colonyAddress: $address) {
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
  canMakePayment @client
}
    ${ColonyProfileFragmentDoc}
${TokensFragmentDoc}
${DomainFieldsFragmentDoc}`;
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
export const EventContextFragmentDoc = gql`
    fragment EventContext on Event {
  context {
    ... on AssignWorkerEvent {
      taskId
      type
      workerAddress
      colonyAddress
    }
    ... on CancelTaskEvent {
      taskId
      type
      colonyAddress
    }
    ... on CreateTaskEvent {
      colonyAddress
      ethDomainId
      taskId
      type
    }
    ... on CreateWorkRequestEvent {
      taskId
      type
      colonyAddress
    }
    ... on FinalizeTaskEvent {
      taskId
      type
      colonyAddress
    }
    ... on RemoveTaskPayoutEvent {
      amount
      taskId
      tokenAddress
      type
      colonyAddress
    }
    ... on SendWorkInviteEvent {
      taskId
      type
      workerAddress
      colonyAddress
    }
    ... on SetTaskDescriptionEvent {
      description
      taskId
      type
      colonyAddress
    }
    ... on SetTaskDomainEvent {
      ethDomainId
      taskId
      type
      colonyAddress
    }
    ... on SetTaskDueDateEvent {
      dueDate
      taskId
      type
      colonyAddress
    }
    ... on SetTaskPayoutEvent {
      amount
      taskId
      tokenAddress
      type
      colonyAddress
    }
    ... on SetTaskSkillEvent {
      ethSkillId
      taskId
      type
      colonyAddress
    }
    ... on RemoveTaskSkillEvent {
      ethSkillId
      taskId
      type
      colonyAddress
    }
    ... on SetTaskTitleEvent {
      taskId
      title
      type
      colonyAddress
    }
    ... on SetTaskPendingEvent {
      taskId
      type
      colonyAddress
      txHash
    }
    ... on TaskMessageEvent {
      colonyAddress
      message
      taskId
      type
      colonyAddress
    }
    ... on UnassignWorkerEvent {
      taskId
      type
      workerAddress
      colonyAddress
    }
    ... on CreateDomainEvent {
      type
      ethDomainId
      colonyAddress
    }
  }
}
    `;
export const TaskEventFragmentDoc = gql`
    fragment TaskEvent on Event {
  ...EventFields
  ...EventContext
}
    ${EventFieldsFragmentDoc}
${EventContextFragmentDoc}`;
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
export const AssignWorkerDocument = gql`
    mutation AssignWorker($input: AssignWorkerInput!) {
  assignWorker(input: $input) {
    id
    assignedWorkerAddress
    assignedWorker {
      id
    }
    events {
      ...TaskEvent
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type AssignWorkerMutationFn = Apollo.MutationFunction<AssignWorkerMutation, AssignWorkerMutationVariables>;

/**
 * __useAssignWorkerMutation__
 *
 * To run a mutation, you first call `useAssignWorkerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignWorkerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignWorkerMutation, { data, loading, error }] = useAssignWorkerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAssignWorkerMutation(baseOptions?: Apollo.MutationHookOptions<AssignWorkerMutation, AssignWorkerMutationVariables>) {
        return Apollo.useMutation<AssignWorkerMutation, AssignWorkerMutationVariables>(AssignWorkerDocument, baseOptions);
      }
export type AssignWorkerMutationHookResult = ReturnType<typeof useAssignWorkerMutation>;
export type AssignWorkerMutationResult = Apollo.MutationResult<AssignWorkerMutation>;
export type AssignWorkerMutationOptions = Apollo.BaseMutationOptions<AssignWorkerMutation, AssignWorkerMutationVariables>;
export const CancelTaskDocument = gql`
    mutation CancelTask($input: TaskIdInput!) {
  cancelTask(input: $input) {
    id
    cancelledAt
    events {
      ...TaskEvent
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type CancelTaskMutationFn = Apollo.MutationFunction<CancelTaskMutation, CancelTaskMutationVariables>;

/**
 * __useCancelTaskMutation__
 *
 * To run a mutation, you first call `useCancelTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelTaskMutation, { data, loading, error }] = useCancelTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCancelTaskMutation(baseOptions?: Apollo.MutationHookOptions<CancelTaskMutation, CancelTaskMutationVariables>) {
        return Apollo.useMutation<CancelTaskMutation, CancelTaskMutationVariables>(CancelTaskDocument, baseOptions);
      }
export type CancelTaskMutationHookResult = ReturnType<typeof useCancelTaskMutation>;
export type CancelTaskMutationResult = Apollo.MutationResult<CancelTaskMutation>;
export type CancelTaskMutationOptions = Apollo.BaseMutationOptions<CancelTaskMutation, CancelTaskMutationVariables>;
export const CreateTaskDocument = gql`
    mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    ...CreateTaskFields
  }
}
    ${CreateTaskFieldsFragmentDoc}`;
export type CreateTaskMutationFn = Apollo.MutationFunction<CreateTaskMutation, CreateTaskMutationVariables>;

/**
 * __useCreateTaskMutation__
 *
 * To run a mutation, you first call `useCreateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskMutation, { data, loading, error }] = useCreateTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTaskMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaskMutation, CreateTaskMutationVariables>) {
        return Apollo.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument, baseOptions);
      }
export type CreateTaskMutationHookResult = ReturnType<typeof useCreateTaskMutation>;
export type CreateTaskMutationResult = Apollo.MutationResult<CreateTaskMutation>;
export type CreateTaskMutationOptions = Apollo.BaseMutationOptions<CreateTaskMutation, CreateTaskMutationVariables>;
export const CreateWorkRequestDocument = gql`
    mutation CreateWorkRequest($input: CreateWorkRequestInput!) {
  createWorkRequest(input: $input) {
    id
    events {
      ...TaskEvent
    }
    workRequestAddresses
    workRequests {
      id
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type CreateWorkRequestMutationFn = Apollo.MutationFunction<CreateWorkRequestMutation, CreateWorkRequestMutationVariables>;

/**
 * __useCreateWorkRequestMutation__
 *
 * To run a mutation, you first call `useCreateWorkRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWorkRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWorkRequestMutation, { data, loading, error }] = useCreateWorkRequestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateWorkRequestMutation(baseOptions?: Apollo.MutationHookOptions<CreateWorkRequestMutation, CreateWorkRequestMutationVariables>) {
        return Apollo.useMutation<CreateWorkRequestMutation, CreateWorkRequestMutationVariables>(CreateWorkRequestDocument, baseOptions);
      }
export type CreateWorkRequestMutationHookResult = ReturnType<typeof useCreateWorkRequestMutation>;
export type CreateWorkRequestMutationResult = Apollo.MutationResult<CreateWorkRequestMutation>;
export type CreateWorkRequestMutationOptions = Apollo.BaseMutationOptions<CreateWorkRequestMutation, CreateWorkRequestMutationVariables>;
export const FinalizeTaskDocument = gql`
    mutation FinalizeTask($input: FinalizeTaskInput!) {
  finalizeTask(input: $input) {
    id
    colonyAddress
    events {
      ...TaskEvent
    }
    ethPotId
    finalizedAt
    finalizedPayment @client {
      amount
      tokenAddress
      workerAddress
      transactionHash
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type FinalizeTaskMutationFn = Apollo.MutationFunction<FinalizeTaskMutation, FinalizeTaskMutationVariables>;

/**
 * __useFinalizeTaskMutation__
 *
 * To run a mutation, you first call `useFinalizeTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFinalizeTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [finalizeTaskMutation, { data, loading, error }] = useFinalizeTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFinalizeTaskMutation(baseOptions?: Apollo.MutationHookOptions<FinalizeTaskMutation, FinalizeTaskMutationVariables>) {
        return Apollo.useMutation<FinalizeTaskMutation, FinalizeTaskMutationVariables>(FinalizeTaskDocument, baseOptions);
      }
export type FinalizeTaskMutationHookResult = ReturnType<typeof useFinalizeTaskMutation>;
export type FinalizeTaskMutationResult = Apollo.MutationResult<FinalizeTaskMutation>;
export type FinalizeTaskMutationOptions = Apollo.BaseMutationOptions<FinalizeTaskMutation, FinalizeTaskMutationVariables>;
export const RemoveTaskPayoutDocument = gql`
    mutation RemoveTaskPayout($input: RemoveTaskPayoutInput!) {
  removeTaskPayout(input: $input) {
    id
    events {
      ...TaskEvent
    }
    ...Payouts
  }
}
    ${TaskEventFragmentDoc}
${PayoutsFragmentDoc}`;
export type RemoveTaskPayoutMutationFn = Apollo.MutationFunction<RemoveTaskPayoutMutation, RemoveTaskPayoutMutationVariables>;

/**
 * __useRemoveTaskPayoutMutation__
 *
 * To run a mutation, you first call `useRemoveTaskPayoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveTaskPayoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeTaskPayoutMutation, { data, loading, error }] = useRemoveTaskPayoutMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveTaskPayoutMutation(baseOptions?: Apollo.MutationHookOptions<RemoveTaskPayoutMutation, RemoveTaskPayoutMutationVariables>) {
        return Apollo.useMutation<RemoveTaskPayoutMutation, RemoveTaskPayoutMutationVariables>(RemoveTaskPayoutDocument, baseOptions);
      }
export type RemoveTaskPayoutMutationHookResult = ReturnType<typeof useRemoveTaskPayoutMutation>;
export type RemoveTaskPayoutMutationResult = Apollo.MutationResult<RemoveTaskPayoutMutation>;
export type RemoveTaskPayoutMutationOptions = Apollo.BaseMutationOptions<RemoveTaskPayoutMutation, RemoveTaskPayoutMutationVariables>;
export const SendWorkInviteDocument = gql`
    mutation SendWorkInvite($input: SendWorkInviteInput!) {
  sendWorkInvite(input: $input) {
    id
    events {
      ...TaskEvent
    }
    workInviteAddresses
    workInvites {
      id
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type SendWorkInviteMutationFn = Apollo.MutationFunction<SendWorkInviteMutation, SendWorkInviteMutationVariables>;

/**
 * __useSendWorkInviteMutation__
 *
 * To run a mutation, you first call `useSendWorkInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendWorkInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendWorkInviteMutation, { data, loading, error }] = useSendWorkInviteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendWorkInviteMutation(baseOptions?: Apollo.MutationHookOptions<SendWorkInviteMutation, SendWorkInviteMutationVariables>) {
        return Apollo.useMutation<SendWorkInviteMutation, SendWorkInviteMutationVariables>(SendWorkInviteDocument, baseOptions);
      }
export type SendWorkInviteMutationHookResult = ReturnType<typeof useSendWorkInviteMutation>;
export type SendWorkInviteMutationResult = Apollo.MutationResult<SendWorkInviteMutation>;
export type SendWorkInviteMutationOptions = Apollo.BaseMutationOptions<SendWorkInviteMutation, SendWorkInviteMutationVariables>;
export const SetTaskDomainDocument = gql`
    mutation SetTaskDomain($input: SetTaskDomainInput!) {
  setTaskDomain(input: $input) {
    id
    ethDomainId
    events {
      ...TaskEvent
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type SetTaskDomainMutationFn = Apollo.MutationFunction<SetTaskDomainMutation, SetTaskDomainMutationVariables>;

/**
 * __useSetTaskDomainMutation__
 *
 * To run a mutation, you first call `useSetTaskDomainMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTaskDomainMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTaskDomainMutation, { data, loading, error }] = useSetTaskDomainMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetTaskDomainMutation(baseOptions?: Apollo.MutationHookOptions<SetTaskDomainMutation, SetTaskDomainMutationVariables>) {
        return Apollo.useMutation<SetTaskDomainMutation, SetTaskDomainMutationVariables>(SetTaskDomainDocument, baseOptions);
      }
export type SetTaskDomainMutationHookResult = ReturnType<typeof useSetTaskDomainMutation>;
export type SetTaskDomainMutationResult = Apollo.MutationResult<SetTaskDomainMutation>;
export type SetTaskDomainMutationOptions = Apollo.BaseMutationOptions<SetTaskDomainMutation, SetTaskDomainMutationVariables>;
export const SetTaskDescriptionDocument = gql`
    mutation SetTaskDescription($input: SetTaskDescriptionInput!) {
  setTaskDescription(input: $input) {
    id
    description
    events {
      ...TaskEvent
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type SetTaskDescriptionMutationFn = Apollo.MutationFunction<SetTaskDescriptionMutation, SetTaskDescriptionMutationVariables>;

/**
 * __useSetTaskDescriptionMutation__
 *
 * To run a mutation, you first call `useSetTaskDescriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTaskDescriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTaskDescriptionMutation, { data, loading, error }] = useSetTaskDescriptionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetTaskDescriptionMutation(baseOptions?: Apollo.MutationHookOptions<SetTaskDescriptionMutation, SetTaskDescriptionMutationVariables>) {
        return Apollo.useMutation<SetTaskDescriptionMutation, SetTaskDescriptionMutationVariables>(SetTaskDescriptionDocument, baseOptions);
      }
export type SetTaskDescriptionMutationHookResult = ReturnType<typeof useSetTaskDescriptionMutation>;
export type SetTaskDescriptionMutationResult = Apollo.MutationResult<SetTaskDescriptionMutation>;
export type SetTaskDescriptionMutationOptions = Apollo.BaseMutationOptions<SetTaskDescriptionMutation, SetTaskDescriptionMutationVariables>;
export const SetTaskDueDateDocument = gql`
    mutation SetTaskDueDate($input: SetTaskDueDateInput!) {
  setTaskDueDate(input: $input) {
    id
    dueDate
    events {
      ...TaskEvent
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type SetTaskDueDateMutationFn = Apollo.MutationFunction<SetTaskDueDateMutation, SetTaskDueDateMutationVariables>;

/**
 * __useSetTaskDueDateMutation__
 *
 * To run a mutation, you first call `useSetTaskDueDateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTaskDueDateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTaskDueDateMutation, { data, loading, error }] = useSetTaskDueDateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetTaskDueDateMutation(baseOptions?: Apollo.MutationHookOptions<SetTaskDueDateMutation, SetTaskDueDateMutationVariables>) {
        return Apollo.useMutation<SetTaskDueDateMutation, SetTaskDueDateMutationVariables>(SetTaskDueDateDocument, baseOptions);
      }
export type SetTaskDueDateMutationHookResult = ReturnType<typeof useSetTaskDueDateMutation>;
export type SetTaskDueDateMutationResult = Apollo.MutationResult<SetTaskDueDateMutation>;
export type SetTaskDueDateMutationOptions = Apollo.BaseMutationOptions<SetTaskDueDateMutation, SetTaskDueDateMutationVariables>;
export const SetTaskPayoutDocument = gql`
    mutation SetTaskPayout($input: SetTaskPayoutInput!) {
  setTaskPayout(input: $input) {
    id
    events {
      ...TaskEvent
    }
    payouts {
      amount
      tokenAddress
      token @client {
        id
        address
      }
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type SetTaskPayoutMutationFn = Apollo.MutationFunction<SetTaskPayoutMutation, SetTaskPayoutMutationVariables>;

/**
 * __useSetTaskPayoutMutation__
 *
 * To run a mutation, you first call `useSetTaskPayoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTaskPayoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTaskPayoutMutation, { data, loading, error }] = useSetTaskPayoutMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetTaskPayoutMutation(baseOptions?: Apollo.MutationHookOptions<SetTaskPayoutMutation, SetTaskPayoutMutationVariables>) {
        return Apollo.useMutation<SetTaskPayoutMutation, SetTaskPayoutMutationVariables>(SetTaskPayoutDocument, baseOptions);
      }
export type SetTaskPayoutMutationHookResult = ReturnType<typeof useSetTaskPayoutMutation>;
export type SetTaskPayoutMutationResult = Apollo.MutationResult<SetTaskPayoutMutation>;
export type SetTaskPayoutMutationOptions = Apollo.BaseMutationOptions<SetTaskPayoutMutation, SetTaskPayoutMutationVariables>;
export const SetTaskSkillDocument = gql`
    mutation SetTaskSkill($input: SetTaskSkillInput!) {
  setTaskSkill(input: $input) {
    id
    ethSkillId
    events {
      ...TaskEvent
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type SetTaskSkillMutationFn = Apollo.MutationFunction<SetTaskSkillMutation, SetTaskSkillMutationVariables>;

/**
 * __useSetTaskSkillMutation__
 *
 * To run a mutation, you first call `useSetTaskSkillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTaskSkillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTaskSkillMutation, { data, loading, error }] = useSetTaskSkillMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetTaskSkillMutation(baseOptions?: Apollo.MutationHookOptions<SetTaskSkillMutation, SetTaskSkillMutationVariables>) {
        return Apollo.useMutation<SetTaskSkillMutation, SetTaskSkillMutationVariables>(SetTaskSkillDocument, baseOptions);
      }
export type SetTaskSkillMutationHookResult = ReturnType<typeof useSetTaskSkillMutation>;
export type SetTaskSkillMutationResult = Apollo.MutationResult<SetTaskSkillMutation>;
export type SetTaskSkillMutationOptions = Apollo.BaseMutationOptions<SetTaskSkillMutation, SetTaskSkillMutationVariables>;
export const RemoveTaskSkillDocument = gql`
    mutation RemoveTaskSkill($input: RemoveTaskSkillInput!) {
  removeTaskSkill(input: $input) {
    id
    ethSkillId
    events {
      ...TaskEvent
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type RemoveTaskSkillMutationFn = Apollo.MutationFunction<RemoveTaskSkillMutation, RemoveTaskSkillMutationVariables>;

/**
 * __useRemoveTaskSkillMutation__
 *
 * To run a mutation, you first call `useRemoveTaskSkillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveTaskSkillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeTaskSkillMutation, { data, loading, error }] = useRemoveTaskSkillMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveTaskSkillMutation(baseOptions?: Apollo.MutationHookOptions<RemoveTaskSkillMutation, RemoveTaskSkillMutationVariables>) {
        return Apollo.useMutation<RemoveTaskSkillMutation, RemoveTaskSkillMutationVariables>(RemoveTaskSkillDocument, baseOptions);
      }
export type RemoveTaskSkillMutationHookResult = ReturnType<typeof useRemoveTaskSkillMutation>;
export type RemoveTaskSkillMutationResult = Apollo.MutationResult<RemoveTaskSkillMutation>;
export type RemoveTaskSkillMutationOptions = Apollo.BaseMutationOptions<RemoveTaskSkillMutation, RemoveTaskSkillMutationVariables>;
export const SetTaskTitleDocument = gql`
    mutation SetTaskTitle($input: SetTaskTitleInput!) {
  setTaskTitle(input: $input) {
    id
    events {
      ...TaskEvent
    }
    title
  }
}
    ${TaskEventFragmentDoc}`;
export type SetTaskTitleMutationFn = Apollo.MutationFunction<SetTaskTitleMutation, SetTaskTitleMutationVariables>;

/**
 * __useSetTaskTitleMutation__
 *
 * To run a mutation, you first call `useSetTaskTitleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTaskTitleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTaskTitleMutation, { data, loading, error }] = useSetTaskTitleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetTaskTitleMutation(baseOptions?: Apollo.MutationHookOptions<SetTaskTitleMutation, SetTaskTitleMutationVariables>) {
        return Apollo.useMutation<SetTaskTitleMutation, SetTaskTitleMutationVariables>(SetTaskTitleDocument, baseOptions);
      }
export type SetTaskTitleMutationHookResult = ReturnType<typeof useSetTaskTitleMutation>;
export type SetTaskTitleMutationResult = Apollo.MutationResult<SetTaskTitleMutation>;
export type SetTaskTitleMutationOptions = Apollo.BaseMutationOptions<SetTaskTitleMutation, SetTaskTitleMutationVariables>;
export const UnassignWorkerDocument = gql`
    mutation UnassignWorker($input: UnassignWorkerInput!) {
  unassignWorker(input: $input) {
    id
    assignedWorkerAddress
    assignedWorker {
      id
    }
    events {
      ...TaskEvent
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type UnassignWorkerMutationFn = Apollo.MutationFunction<UnassignWorkerMutation, UnassignWorkerMutationVariables>;

/**
 * __useUnassignWorkerMutation__
 *
 * To run a mutation, you first call `useUnassignWorkerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnassignWorkerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unassignWorkerMutation, { data, loading, error }] = useUnassignWorkerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUnassignWorkerMutation(baseOptions?: Apollo.MutationHookOptions<UnassignWorkerMutation, UnassignWorkerMutationVariables>) {
        return Apollo.useMutation<UnassignWorkerMutation, UnassignWorkerMutationVariables>(UnassignWorkerDocument, baseOptions);
      }
export type UnassignWorkerMutationHookResult = ReturnType<typeof useUnassignWorkerMutation>;
export type UnassignWorkerMutationResult = Apollo.MutationResult<UnassignWorkerMutation>;
export type UnassignWorkerMutationOptions = Apollo.BaseMutationOptions<UnassignWorkerMutation, UnassignWorkerMutationVariables>;
export const SetTaskPendingDocument = gql`
    mutation SetTaskPending($input: SetTaskPendingInput!) {
  setTaskPending(input: $input) {
    id
    events {
      ...TaskEvent
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type SetTaskPendingMutationFn = Apollo.MutationFunction<SetTaskPendingMutation, SetTaskPendingMutationVariables>;

/**
 * __useSetTaskPendingMutation__
 *
 * To run a mutation, you first call `useSetTaskPendingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTaskPendingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTaskPendingMutation, { data, loading, error }] = useSetTaskPendingMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetTaskPendingMutation(baseOptions?: Apollo.MutationHookOptions<SetTaskPendingMutation, SetTaskPendingMutationVariables>) {
        return Apollo.useMutation<SetTaskPendingMutation, SetTaskPendingMutationVariables>(SetTaskPendingDocument, baseOptions);
      }
export type SetTaskPendingMutationHookResult = ReturnType<typeof useSetTaskPendingMutation>;
export type SetTaskPendingMutationResult = Apollo.MutationResult<SetTaskPendingMutation>;
export type SetTaskPendingMutationOptions = Apollo.BaseMutationOptions<SetTaskPendingMutation, SetTaskPendingMutationVariables>;
export const SendTaskMessageDocument = gql`
    mutation SendTaskMessage($input: SendTaskMessageInput!) {
  sendTaskMessage(input: $input)
}
    `;
export type SendTaskMessageMutationFn = Apollo.MutationFunction<SendTaskMessageMutation, SendTaskMessageMutationVariables>;

/**
 * __useSendTaskMessageMutation__
 *
 * To run a mutation, you first call `useSendTaskMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendTaskMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendTaskMessageMutation, { data, loading, error }] = useSendTaskMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendTaskMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendTaskMessageMutation, SendTaskMessageMutationVariables>) {
        return Apollo.useMutation<SendTaskMessageMutation, SendTaskMessageMutationVariables>(SendTaskMessageDocument, baseOptions);
      }
export type SendTaskMessageMutationHookResult = ReturnType<typeof useSendTaskMessageMutation>;
export type SendTaskMessageMutationResult = Apollo.MutationResult<SendTaskMessageMutation>;
export type SendTaskMessageMutationOptions = Apollo.BaseMutationOptions<SendTaskMessageMutation, SendTaskMessageMutationVariables>;
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
export const TaskDocument = gql`
    query Task($id: String!) {
  task(id: $id) {
    id
    ...Payouts
    assignedWorker {
      id
      profile {
        avatarHash
        displayName
        username
        walletAddress
      }
    }
    assignedWorkerAddress
    cancelledAt
    colonyAddress
    commentCount @client
    createdAt
    creator {
      id
      profile {
        avatarHash
        displayName
        username
        walletAddress
      }
    }
    creatorAddress
    description
    dueDate
    ethDomainId
    ethSkillId
    ethPotId
    events {
      id
      type
    }
    finalizedAt
    title
    workInvites {
      id
      profile {
        avatarHash
        displayName
        username
        walletAddress
      }
    }
    workInviteAddresses
    workRequests {
      id
      profile {
        avatarHash
        displayName
        username
        walletAddress
      }
    }
    workRequestAddresses
    txHash
  }
}
    ${PayoutsFragmentDoc}`;

/**
 * __useTaskQuery__
 *
 * To run a query within a React component, call `useTaskQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaskQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTaskQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTaskQuery(baseOptions?: Apollo.QueryHookOptions<TaskQuery, TaskQueryVariables>) {
        return Apollo.useQuery<TaskQuery, TaskQueryVariables>(TaskDocument, baseOptions);
      }
export function useTaskLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TaskQuery, TaskQueryVariables>) {
          return Apollo.useLazyQuery<TaskQuery, TaskQueryVariables>(TaskDocument, baseOptions);
        }
export type TaskQueryHookResult = ReturnType<typeof useTaskQuery>;
export type TaskLazyQueryHookResult = ReturnType<typeof useTaskLazyQuery>;
export type TaskQueryResult = Apollo.QueryResult<TaskQuery, TaskQueryVariables>;
export const TaskToEditDocument = gql`
    query TaskToEdit($id: String!) {
  task(id: $id) {
    id
    ...Payouts
    assignedWorker {
      id
      profile {
        avatarHash
        displayName
        username
        walletAddress
      }
    }
    workRequests {
      id
      profile {
        avatarHash
        displayName
        username
        walletAddress
      }
    }
  }
}
    ${PayoutsFragmentDoc}`;

/**
 * __useTaskToEditQuery__
 *
 * To run a query within a React component, call `useTaskToEditQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaskToEditQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTaskToEditQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTaskToEditQuery(baseOptions?: Apollo.QueryHookOptions<TaskToEditQuery, TaskToEditQueryVariables>) {
        return Apollo.useQuery<TaskToEditQuery, TaskToEditQueryVariables>(TaskToEditDocument, baseOptions);
      }
export function useTaskToEditLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TaskToEditQuery, TaskToEditQueryVariables>) {
          return Apollo.useLazyQuery<TaskToEditQuery, TaskToEditQueryVariables>(TaskToEditDocument, baseOptions);
        }
export type TaskToEditQueryHookResult = ReturnType<typeof useTaskToEditQuery>;
export type TaskToEditLazyQueryHookResult = ReturnType<typeof useTaskToEditLazyQuery>;
export type TaskToEditQueryResult = Apollo.QueryResult<TaskToEditQuery, TaskToEditQueryVariables>;
export const TaskFeedEventsDocument = gql`
    query TaskFeedEvents($id: String!) {
  task(id: $id) {
    id
    colonyAddress
    events {
      ...TaskEvent
    }
    ethDomainId
    ethPotId
    finalizedAt
    txHash
    finalizedPayment @client {
      amount
      tokenAddress
      workerAddress
      transactionHash
    }
    ...Payouts
  }
}
    ${TaskEventFragmentDoc}
${PayoutsFragmentDoc}`;

/**
 * __useTaskFeedEventsQuery__
 *
 * To run a query within a React component, call `useTaskFeedEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaskFeedEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTaskFeedEventsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTaskFeedEventsQuery(baseOptions?: Apollo.QueryHookOptions<TaskFeedEventsQuery, TaskFeedEventsQueryVariables>) {
        return Apollo.useQuery<TaskFeedEventsQuery, TaskFeedEventsQueryVariables>(TaskFeedEventsDocument, baseOptions);
      }
export function useTaskFeedEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TaskFeedEventsQuery, TaskFeedEventsQueryVariables>) {
          return Apollo.useLazyQuery<TaskFeedEventsQuery, TaskFeedEventsQueryVariables>(TaskFeedEventsDocument, baseOptions);
        }
export type TaskFeedEventsQueryHookResult = ReturnType<typeof useTaskFeedEventsQuery>;
export type TaskFeedEventsLazyQueryHookResult = ReturnType<typeof useTaskFeedEventsLazyQuery>;
export type TaskFeedEventsQueryResult = Apollo.QueryResult<TaskFeedEventsQuery, TaskFeedEventsQueryVariables>;
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
export const UserTasksDocument = gql`
    query UserTasks($address: String!) {
  user(address: $address) {
    id
    tasks {
      id
      ...Payouts
      assignedWorker {
        id
        profile {
          avatarHash
        }
      }
      assignedWorkerAddress
      cancelledAt
      colonyAddress
      commentCount @client
      createdAt
      creatorAddress
      dueDate
      ethDomainId
      ethSkillId
      events {
        id
        type
      }
      finalizedAt
      title
      workRequestAddresses
      txHash
    }
  }
}
    ${PayoutsFragmentDoc}`;

/**
 * __useUserTasksQuery__
 *
 * To run a query within a React component, call `useUserTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserTasksQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useUserTasksQuery(baseOptions?: Apollo.QueryHookOptions<UserTasksQuery, UserTasksQueryVariables>) {
        return Apollo.useQuery<UserTasksQuery, UserTasksQueryVariables>(UserTasksDocument, baseOptions);
      }
export function useUserTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserTasksQuery, UserTasksQueryVariables>) {
          return Apollo.useLazyQuery<UserTasksQuery, UserTasksQueryVariables>(UserTasksDocument, baseOptions);
        }
export type UserTasksQueryHookResult = ReturnType<typeof useUserTasksQuery>;
export type UserTasksLazyQueryHookResult = ReturnType<typeof useUserTasksLazyQuery>;
export type UserTasksQueryResult = Apollo.QueryResult<UserTasksQuery, UserTasksQueryVariables>;
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
export const OneTxPaymentExtensionAddressDocument = gql`
    query OneTxPaymentExtensionAddress {
  oneTxPaymentExtensionAddress @client
}
    `;

/**
 * __useOneTxPaymentExtensionAddressQuery__
 *
 * To run a query within a React component, call `useOneTxPaymentExtensionAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useOneTxPaymentExtensionAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOneTxPaymentExtensionAddressQuery({
 *   variables: {
 *   },
 * });
 */
export function useOneTxPaymentExtensionAddressQuery(baseOptions?: Apollo.QueryHookOptions<OneTxPaymentExtensionAddressQuery, OneTxPaymentExtensionAddressQueryVariables>) {
        return Apollo.useQuery<OneTxPaymentExtensionAddressQuery, OneTxPaymentExtensionAddressQueryVariables>(OneTxPaymentExtensionAddressDocument, baseOptions);
      }
export function useOneTxPaymentExtensionAddressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OneTxPaymentExtensionAddressQuery, OneTxPaymentExtensionAddressQueryVariables>) {
          return Apollo.useLazyQuery<OneTxPaymentExtensionAddressQuery, OneTxPaymentExtensionAddressQueryVariables>(OneTxPaymentExtensionAddressDocument, baseOptions);
        }
export type OneTxPaymentExtensionAddressQueryHookResult = ReturnType<typeof useOneTxPaymentExtensionAddressQuery>;
export type OneTxPaymentExtensionAddressLazyQueryHookResult = ReturnType<typeof useOneTxPaymentExtensionAddressLazyQuery>;
export type OneTxPaymentExtensionAddressQueryResult = Apollo.QueryResult<OneTxPaymentExtensionAddressQuery, OneTxPaymentExtensionAddressQueryVariables>;
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
      name
      values
      createdAt
      emmitedBy
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
export const SubgraphActionsDocument = gql`
    query SubgraphActions($skip: Int!, $first: Int!, $colonyAddress: String!) {
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
  events(where: {associatedColony_contains: $colonyAddress, name_in: ["TokensMinted(address,address,uint256)", "DomainAdded(address,uint256)", "ColonyMetadata(address,string)", "ColonyFundsMovedBetweenFundingPots(address,uint256,uint256,uint256,address)", "DomainMetadata(address,uint256,string)", "ColonyRoleSet(address,address,uint256,uint8,bool)"]}) {
    id
    transaction {
      hash: id
      block {
        timestamp
      }
    }
    associatedColony {
      token {
        decimals
        symbol
      }
    }
    args
    address
    name
  }
}
    `;

/**
 * __useSubgraphActionsQuery__
 *
 * To run a query within a React component, call `useSubgraphActionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphActionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphActionsQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *      first: // value for 'first'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useSubgraphActionsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphActionsQuery, SubgraphActionsQueryVariables>) {
        return Apollo.useQuery<SubgraphActionsQuery, SubgraphActionsQueryVariables>(SubgraphActionsDocument, baseOptions);
      }
export function useSubgraphActionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphActionsQuery, SubgraphActionsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphActionsQuery, SubgraphActionsQueryVariables>(SubgraphActionsDocument, baseOptions);
        }
export type SubgraphActionsQueryHookResult = ReturnType<typeof useSubgraphActionsQuery>;
export type SubgraphActionsLazyQueryHookResult = ReturnType<typeof useSubgraphActionsLazyQuery>;
export type SubgraphActionsQueryResult = Apollo.QueryResult<SubgraphActionsQuery, SubgraphActionsQueryVariables>;
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
    token {
      tokenAddress: id
      decimals
      symbol
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
    query SubgraphColonies($colonyAddresses: [String]!) {
  colonies(where: {id_in: $colonyAddresses}) {
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
export const SubgraphEventsDocument = gql`
    query SubgraphEvents($skip: Int!, $first: Int!, $colonyAddress: String!) {
  events(skip: $skip, first: $first, where: {associatedColony: $colonyAddress}) {
    id
    address
    associatedColony {
      colonyAddress: id
      id: colonyChainId
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
 * __useSubgraphEventsQuery__
 *
 * To run a query within a React component, call `useSubgraphEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSubgraphEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubgraphEventsQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *      first: // value for 'first'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useSubgraphEventsQuery(baseOptions?: Apollo.QueryHookOptions<SubgraphEventsQuery, SubgraphEventsQueryVariables>) {
        return Apollo.useQuery<SubgraphEventsQuery, SubgraphEventsQueryVariables>(SubgraphEventsDocument, baseOptions);
      }
export function useSubgraphEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SubgraphEventsQuery, SubgraphEventsQueryVariables>) {
          return Apollo.useLazyQuery<SubgraphEventsQuery, SubgraphEventsQueryVariables>(SubgraphEventsDocument, baseOptions);
        }
export type SubgraphEventsQueryHookResult = ReturnType<typeof useSubgraphEventsQuery>;
export type SubgraphEventsLazyQueryHookResult = ReturnType<typeof useSubgraphEventsLazyQuery>;
export type SubgraphEventsQueryResult = Apollo.QueryResult<SubgraphEventsQuery, SubgraphEventsQueryVariables>;
import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;

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
            "name": "SetTaskSkillEvent"
          },
          {
            "name": "SetTaskTitleEvent"
          },
          {
            "name": "TaskMessageEvent"
          },
          {
            "name": "UnassignWorkerEvent"
          }
        ]
      },
      {
        "kind": "INTERFACE",
        "name": "TaskEvent",
        "possibleTypes": [
          {
            "name": "AssignWorkerEvent"
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
            "name": "SetTaskTitleEvent"
          },
          {
            "name": "TaskMessageEvent"
          },
          {
            "name": "UnassignWorkerEvent"
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
      }
    ]
  }
};
      export default result;
    
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** 
 * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the
   * `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO
   * 8601 standard for representation of dates and times using the Gregorian calendar.
 */
  DateTime: any,
  /** The `Upload` scalar type represents a file upload. */
  Upload: any,
};


export type AssignWorkerEvent = TaskEvent & {
  type: EventType,
  taskId: Scalars['String'],
  workerAddress: Scalars['String'],
};

export type AssignWorkerInput = {
  id: Scalars['String'],
  workerAddress: Scalars['String'],
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type CancelTaskEvent = TaskEvent & {
  type: EventType,
  taskId: Scalars['String'],
};

export type Colony = {
  id: Scalars['String'],
  createdAt: Scalars['DateTime'],
  colonyAddress: Scalars['String'],
  founderAddress: Scalars['String'],
  colonyName: Scalars['String'],
  avatarHash?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  displayName?: Maybe<Scalars['String']>,
  guideline?: Maybe<Scalars['String']>,
  website?: Maybe<Scalars['String']>,
  taskIds: Array<Scalars['String']>,
  tasks: Array<Task>,
  domains: Array<Domain>,
  founder?: Maybe<User>,
  nativeToken: Token,
  isNativeTokenExternal: Scalars['Boolean'],
  nativeTokenAddress: Scalars['String'],
  subscribedUsers: Array<User>,
  tokens: Array<Token>,
  tokenAddresses: Array<Scalars['String']>,
  canMintNativeToken: Scalars['Boolean'],
  canUnlockNativeToken: Scalars['Boolean'],
  isInRecoveryMode: Scalars['Boolean'],
  isNativeTokenLocked: Scalars['Boolean'],
  version: Scalars['Int'],
};


export type ColonyTokensArgs = {
  addresses?: Maybe<Array<Scalars['String']>>
};


export type ColonyCanMintNativeTokenArgs = {
  address: Scalars['String']
};


export type ColonyCanUnlockNativeTokenArgs = {
  address: Scalars['String']
};


export type ColonyIsInRecoveryModeArgs = {
  address: Scalars['String']
};


export type ColonyIsNativeTokenLockedArgs = {
  address: Scalars['String']
};


export type ColonyVersionArgs = {
  address: Scalars['String']
};

export type ColonyEvent = {
  type: EventType,
  colonyAddress: Scalars['String'],
};

export type CreateColonyInput = {
  colonyAddress: Scalars['String'],
  colonyName: Scalars['String'],
  displayName: Scalars['String'],
  tokenAddress: Scalars['String'],
  tokenName: Scalars['String'],
  tokenSymbol: Scalars['String'],
  tokenDecimals: Scalars['Int'],
  tokenIsExternal: Scalars['Boolean'],
  tokenIconHash?: Maybe<Scalars['String']>,
};

export type CreateDomainEvent = ColonyEvent & {
  type: EventType,
  ethDomainId: Scalars['Int'],
  colonyAddress: Scalars['String'],
};

export type CreateDomainInput = {
  colonyAddress: Scalars['String'],
  ethDomainId: Scalars['Int'],
  ethParentDomainId?: Maybe<Scalars['Int']>,
  name: Scalars['String'],
};

export type CreateTaskEvent = TaskEvent & {
  type: EventType,
  taskId: Scalars['String'],
  ethDomainId: Scalars['Int'],
  colonyAddress: Scalars['String'],
};

export type CreateTaskInput = {
  colonyAddress: Scalars['String'],
  ethDomainId: Scalars['Int'],
};

export type CreateTokenInput = {
  address: Scalars['String'],
  decimals: Scalars['Int'],
  name: Scalars['String'],
  symbol: Scalars['String'],
  iconHash?: Maybe<Scalars['String']>,
};

export type CreateUserInput = {
  username: Scalars['String'],
};

export type CreateWorkRequestEvent = TaskEvent & {
  type: EventType,
  taskId: Scalars['String'],
};

export type CreateWorkRequestInput = {
  id: Scalars['String'],
};


export type Domain = {
  id: Scalars['String'],
  createdAt: Scalars['DateTime'],
  colonyAddress: Scalars['String'],
  ethDomainId: Scalars['Int'],
  ethParentDomainId?: Maybe<Scalars['Int']>,
  name: Scalars['String'],
  colony?: Maybe<Colony>,
  parent?: Maybe<Domain>,
  tasks: Array<Task>,
};

export type DomainBalance = {
  id: Scalars['Int'],
  domainId: Scalars['Int'],
  amount: Scalars['String'],
};

export type EditColonyProfileInput = {
  colonyAddress: Scalars['String'],
  avatarHash?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  displayName?: Maybe<Scalars['String']>,
  guideline?: Maybe<Scalars['String']>,
  website?: Maybe<Scalars['String']>,
};

export type EditDomainNameInput = {
  colonyAddress: Scalars['String'],
  ethDomainId: Scalars['Int'],
  name: Scalars['String'],
};

export type EditUserInput = {
  avatarHash?: Maybe<Scalars['String']>,
  bio?: Maybe<Scalars['String']>,
  displayName?: Maybe<Scalars['String']>,
  location?: Maybe<Scalars['String']>,
  website?: Maybe<Scalars['String']>,
};

export type Event = {
  type: EventType,
  createdAt: Scalars['DateTime'],
  initiator?: Maybe<User>,
  initiatorAddress: Scalars['String'],
  sourceId: Scalars['String'],
  sourceType: Scalars['String'],
  context: EventContext,
};

export type EventContext = AssignWorkerEvent | CancelTaskEvent | CreateDomainEvent | CreateTaskEvent | CreateWorkRequestEvent | FinalizeTaskEvent | NewUserEvent | RemoveTaskPayoutEvent | SendWorkInviteEvent | SetTaskDescriptionEvent | SetTaskDomainEvent | SetTaskDueDateEvent | SetTaskPayoutEvent | SetTaskSkillEvent | SetTaskTitleEvent | TaskMessageEvent | UnassignWorkerEvent;

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
  SetTaskSkill = 'SetTaskSkill',
  SetTaskTitle = 'SetTaskTitle',
  TaskMessage = 'TaskMessage',
  UnassignWorker = 'UnassignWorker'
}

export type FinalizeTaskEvent = TaskEvent & {
  type: EventType,
  taskId: Scalars['String'],
};

export type LoggedInUser = {
  id: Scalars['String'],
  balance: Scalars['String'],
  username?: Maybe<Scalars['String']>,
  walletAddress: Scalars['String'],
};

export type LoggedInUserInput = {
  balance?: Maybe<Scalars['String']>,
  username?: Maybe<Scalars['String']>,
  walletAddress?: Maybe<Scalars['String']>,
};

export type MarkNotificationAsReadInput = {
  id: Scalars['String'],
};

export type Mutation = {
  createUser?: Maybe<User>,
  editUser?: Maybe<User>,
  subscribeToColony?: Maybe<User>,
  unsubscribeFromColony?: Maybe<User>,
  setUserTokens?: Maybe<User>,
  createColony?: Maybe<Colony>,
  editColonyProfile?: Maybe<Colony>,
  setColonyTokens?: Maybe<Colony>,
  createDomain?: Maybe<Domain>,
  editDomainName?: Maybe<Domain>,
  assignWorker?: Maybe<Task>,
  cancelTask?: Maybe<Task>,
  createTask?: Maybe<Task>,
  createWorkRequest?: Maybe<Task>,
  finalizeTask?: Maybe<Task>,
  removeTaskPayout?: Maybe<Task>,
  sendWorkInvite?: Maybe<Task>,
  setTaskDomain?: Maybe<Task>,
  setTaskDescription?: Maybe<Task>,
  setTaskDueDate?: Maybe<Task>,
  setTaskPayout?: Maybe<Task>,
  setTaskSkill?: Maybe<Task>,
  setTaskTitle?: Maybe<Task>,
  unassignWorker?: Maybe<Task>,
  createToken?: Maybe<Token>,
  setTokenIcon?: Maybe<Token>,
  markAllNotificationsAsRead: Scalars['Boolean'],
  markNotificationAsRead: Scalars['Boolean'],
  sendTaskMessage: Scalars['Boolean'],
  setLoggedInUser: LoggedInUser,
};


export type MutationCreateUserArgs = {
  input: CreateUserInput
};


export type MutationEditUserArgs = {
  input: EditUserInput
};


export type MutationSubscribeToColonyArgs = {
  input: SubscribeToColonyInput
};


export type MutationUnsubscribeFromColonyArgs = {
  input: UnsubscribeFromColonyInput
};


export type MutationSetUserTokensArgs = {
  input: SetUserTokensInput
};


export type MutationCreateColonyArgs = {
  input: CreateColonyInput
};


export type MutationEditColonyProfileArgs = {
  input: EditColonyProfileInput
};


export type MutationSetColonyTokensArgs = {
  input: SetColonyTokensInput
};


export type MutationCreateDomainArgs = {
  input: CreateDomainInput
};


export type MutationEditDomainNameArgs = {
  input: EditDomainNameInput
};


export type MutationAssignWorkerArgs = {
  input: AssignWorkerInput
};


export type MutationCancelTaskArgs = {
  input: TaskIdInput
};


export type MutationCreateTaskArgs = {
  input: CreateTaskInput
};


export type MutationCreateWorkRequestArgs = {
  input: CreateWorkRequestInput
};


export type MutationFinalizeTaskArgs = {
  input: TaskIdInput
};


export type MutationRemoveTaskPayoutArgs = {
  input: RemoveTaskPayoutInput
};


export type MutationSendWorkInviteArgs = {
  input: SendWorkInviteInput
};


export type MutationSetTaskDomainArgs = {
  input: SetTaskDomainInput
};


export type MutationSetTaskDescriptionArgs = {
  input: SetTaskDescriptionInput
};


export type MutationSetTaskDueDateArgs = {
  input: SetTaskDueDateInput
};


export type MutationSetTaskPayoutArgs = {
  input: SetTaskPayoutInput
};


export type MutationSetTaskSkillArgs = {
  input: SetTaskSkillInput
};


export type MutationSetTaskTitleArgs = {
  input: SetTaskTitleInput
};


export type MutationUnassignWorkerArgs = {
  input: UnassignWorkerInput
};


export type MutationCreateTokenArgs = {
  input: CreateTokenInput
};


export type MutationSetTokenIconArgs = {
  input: SetTokenIconInput
};


export type MutationMarkNotificationAsReadArgs = {
  input: MarkNotificationAsReadInput
};


export type MutationSendTaskMessageArgs = {
  input: SendTaskMessageInput
};


export type MutationSetLoggedInUserArgs = {
  input?: Maybe<LoggedInUserInput>
};

export type NewUserEvent = {
  type: EventType,
};

export type Notification = {
  id: Scalars['String'],
  event: Event,
  read: Scalars['Boolean'],
};

export type Query = {
  user: User,
  colony: Colony,
  domain: Domain,
  task: Task,
  token: Token,
  allTokens: Array<Token>,
  loggedInUser: LoggedInUser,
  colonyAddress: Scalars['String'],
  colonyName: Scalars['String'],
};


export type QueryUserArgs = {
  address: Scalars['String']
};


export type QueryColonyArgs = {
  address: Scalars['String']
};


export type QueryDomainArgs = {
  colonyAddress: Scalars['String'],
  ethDomainId: Scalars['Int']
};


export type QueryTaskArgs = {
  id: Scalars['String']
};


export type QueryTokenArgs = {
  address: Scalars['String']
};


export type QueryColonyAddressArgs = {
  name: Scalars['String']
};


export type QueryColonyNameArgs = {
  address: Scalars['String']
};

export type RemoveTaskPayoutEvent = TaskEvent & {
  type: EventType,
  taskId: Scalars['String'],
  tokenAddress: Scalars['String'],
  amount: Scalars['String'],
};

export type RemoveTaskPayoutInput = {
  id: Scalars['String'],
  amount: Scalars['String'],
  tokenAddress: Scalars['String'],
};

export type SendTaskMessageInput = {
  id: Scalars['String'],
  message: Scalars['String'],
};

export type SendWorkInviteEvent = TaskEvent & {
  type: EventType,
  taskId: Scalars['String'],
  workerAddress: Scalars['String'],
};

export type SendWorkInviteInput = {
  id: Scalars['String'],
  workerAddress: Scalars['String'],
};

export type SetColonyTokensInput = {
  tokenAddresses: Array<Maybe<Scalars['String']>>,
  colonyAddress: Scalars['String'],
};

export type SetTaskDescriptionEvent = TaskEvent & {
  type: EventType,
  taskId: Scalars['String'],
  description: Scalars['String'],
};

export type SetTaskDescriptionInput = {
  id: Scalars['String'],
  description: Scalars['String'],
};

export type SetTaskDomainEvent = TaskEvent & {
  type: EventType,
  taskId: Scalars['String'],
  ethDomainId: Scalars['Int'],
};

export type SetTaskDomainInput = {
  id: Scalars['String'],
  ethDomainId: Scalars['Int'],
};

export type SetTaskDueDateEvent = TaskEvent & {
  type: EventType,
  taskId: Scalars['String'],
  dueDate: Scalars['DateTime'],
};

export type SetTaskDueDateInput = {
  id: Scalars['String'],
  dueDate?: Maybe<Scalars['DateTime']>,
};

export type SetTaskPayoutEvent = TaskEvent & {
  type: EventType,
  taskId: Scalars['String'],
  tokenAddress: Scalars['String'],
  amount: Scalars['String'],
};

export type SetTaskPayoutInput = {
  id: Scalars['String'],
  amount: Scalars['String'],
  tokenAddress: Scalars['String'],
};

export type SetTaskSkillEvent = TaskEvent & {
  type: EventType,
  taskId: Scalars['String'],
  ethSkillId: Scalars['Int'],
};

export type SetTaskSkillInput = {
  id: Scalars['String'],
  ethSkillId: Scalars['Int'],
};

export type SetTaskTitleEvent = TaskEvent & {
  type: EventType,
  taskId: Scalars['String'],
  title: Scalars['String'],
};

export type SetTaskTitleInput = {
  id: Scalars['String'],
  title: Scalars['String'],
};

export type SetTokenIconInput = {
  tokenAddress: Scalars['String'],
  iconHash?: Maybe<Scalars['String']>,
};

export type SetUserTokensInput = {
  tokenAddresses: Array<Scalars['String']>,
};

export type SubscribeToColonyInput = {
  colonyAddress: Scalars['String'],
};

export type Task = {
  id: Scalars['String'],
  createdAt: Scalars['DateTime'],
  ethTaskId?: Maybe<Scalars['Int']>,
  ethDomainId: Scalars['Int'],
  ethSkillId?: Maybe<Scalars['Int']>,
  cancelledAt?: Maybe<Scalars['DateTime']>,
  description?: Maybe<Scalars['String']>,
  dueDate?: Maybe<Scalars['DateTime']>,
  finalizedAt?: Maybe<Scalars['DateTime']>,
  title?: Maybe<Scalars['String']>,
  colony: Colony,
  colonyAddress: Scalars['String'],
  creator: User,
  creatorAddress: Scalars['String'],
  domain: Domain,
  assignedWorker?: Maybe<User>,
  assignedWorkerAddress?: Maybe<Scalars['String']>,
  workInvites: Array<User>,
  workInviteAddresses: Array<Scalars['String']>,
  workRequests: Array<User>,
  workRequestAddresses: Array<Scalars['String']>,
  events: Array<Event>,
  payouts: Array<TaskPayout>,
};

export type TaskEvent = {
  type: EventType,
  taskId: Scalars['String'],
};

export type TaskIdInput = {
  id: Scalars['String'],
};

export type TaskMessageEvent = TaskEvent & {
  type: EventType,
  taskId: Scalars['String'],
  message: Scalars['String'],
};

export type TaskPayout = {
  amount: Scalars['String'],
  tokenAddress: Scalars['String'],
  token: Token,
};

export type Token = {
  id: Scalars['String'],
  createdAt: Scalars['DateTime'],
  address: Scalars['String'],
  iconHash?: Maybe<Scalars['String']>,
  info: TokenInfo,
  balance: Scalars['String'],
  balances: Array<DomainBalance>,
  details: TokenInfo,
};


export type TokenBalanceArgs = {
  walletAddress: Scalars['String']
};


export type TokenBalancesArgs = {
  colonyAddress: Scalars['String'],
  domainIds?: Maybe<Array<Scalars['Int']>>
};

export type TokenInfo = {
  name?: Maybe<Scalars['String']>,
  decimals?: Maybe<Scalars['Int']>,
  symbol?: Maybe<Scalars['String']>,
  verified?: Maybe<Scalars['Boolean']>,
};

export type UnassignWorkerEvent = TaskEvent & {
  type: EventType,
  taskId: Scalars['String'],
  workerAddress: Scalars['String'],
};

export type UnassignWorkerInput = {
  id: Scalars['String'],
  workerAddress: Scalars['String'],
};

export type UnsubscribeFromColonyInput = {
  colonyAddress: Scalars['String'],
};


export type User = {
  id: Scalars['String'],
  createdAt: Scalars['DateTime'],
  profile: UserProfile,
  colonies: Array<Colony>,
  colonyAddresses: Array<Scalars['String']>,
  tasks: Array<Task>,
  taskIds: Array<Scalars['String']>,
  tokens: Array<Token>,
  tokenAddresses: Array<Scalars['String']>,
  notifications?: Maybe<Array<Notification>>,
};


export type UserTokensArgs = {
  addresses?: Maybe<Array<Scalars['String']>>
};


export type UserNotificationsArgs = {
  read?: Maybe<Scalars['Boolean']>
};

export type UserProfile = {
  username?: Maybe<Scalars['String']>,
  avatarHash?: Maybe<Scalars['String']>,
  bio?: Maybe<Scalars['String']>,
  displayName?: Maybe<Scalars['String']>,
  location?: Maybe<Scalars['String']>,
  walletAddress: Scalars['String'],
  website?: Maybe<Scalars['String']>,
};

export type PayoutsFragment = { payouts: Array<(
    Pick<TaskPayout, 'amount'>
    & { token: (
      Pick<Token, 'id' | 'address'>
      & { details: Pick<TokenInfo, 'decimals' | 'name' | 'symbol'> }
    ) }
  )> };

export type TokensFragment = (
  Pick<Colony, 'nativeTokenAddress'>
  & { tokens: Array<(
    Pick<Token, 'id' | 'address' | 'iconHash'>
    & { details: Pick<TokenInfo, 'decimals' | 'name' | 'symbol'>, balances: Array<Pick<DomainBalance, 'domainId' | 'amount'>> }
  )> }
);

export type ColonyProfileFragment = Pick<Colony, 'id' | 'colonyAddress' | 'colonyName' | 'avatarHash' | 'description' | 'displayName' | 'guideline' | 'website'>;

export type FullColonyFragment = (
  Pick<Colony, 'isNativeTokenExternal' | 'version' | 'canMintNativeToken' | 'canUnlockNativeToken' | 'isInRecoveryMode' | 'isNativeTokenLocked'>
  & ColonyProfileFragment
  & TokensFragment
);

export type EventFieldsFragment = (
  Pick<Event, 'createdAt' | 'initiatorAddress' | 'sourceId' | 'sourceType' | 'type'>
  & { initiator: Maybe<(
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
  )> }
);

export type TaskEventFragment = (
  { context: Pick<AssignWorkerEvent, 'taskId' | 'type' | 'workerAddress'> | Pick<CancelTaskEvent, 'taskId' | 'type'> | Pick<CreateTaskEvent, 'colonyAddress' | 'ethDomainId' | 'taskId' | 'type'> | Pick<CreateWorkRequestEvent, 'taskId' | 'type'> | Pick<FinalizeTaskEvent, 'taskId' | 'type'> | Pick<RemoveTaskPayoutEvent, 'amount' | 'taskId' | 'tokenAddress' | 'type'> | Pick<SendWorkInviteEvent, 'taskId' | 'type' | 'workerAddress'> | Pick<SetTaskDescriptionEvent, 'description' | 'taskId' | 'type'> | Pick<SetTaskDomainEvent, 'ethDomainId' | 'taskId' | 'type'> | Pick<SetTaskDueDateEvent, 'dueDate' | 'taskId' | 'type'> | Pick<SetTaskPayoutEvent, 'amount' | 'taskId' | 'tokenAddress' | 'type'> | Pick<SetTaskSkillEvent, 'ethSkillId' | 'taskId' | 'type'> | Pick<SetTaskTitleEvent, 'taskId' | 'title' | 'type'> | Pick<TaskMessageEvent, 'message' | 'taskId' | 'type'> | Pick<UnassignWorkerEvent, 'taskId' | 'type' | 'workerAddress'> }
  & EventFieldsFragment
);

export type AssignWorkerMutationVariables = {
  input: AssignWorkerInput
};


export type AssignWorkerMutation = { assignWorker: Maybe<(
    Pick<Task, 'id'>
    & { assignedWorker: Maybe<Pick<User, 'id'>>, events: Array<TaskEventFragment> }
  )> };

export type CancelTaskMutationVariables = {
  input: TaskIdInput
};


export type CancelTaskMutation = { cancelTask: Maybe<(
    Pick<Task, 'id' | 'cancelledAt'>
    & { events: Array<TaskEventFragment> }
  )> };

export type CreateTaskMutationVariables = {
  input: CreateTaskInput
};


export type CreateTaskMutation = { createTask: Maybe<(
    Pick<Task, 'id'>
    & { colony: Pick<Colony, 'colonyName'>, events: Array<TaskEventFragment> }
  )> };

export type CreateWorkRequestMutationVariables = {
  input: CreateWorkRequestInput
};


export type CreateWorkRequestMutation = { createWorkRequest: Maybe<(
    Pick<Task, 'id'>
    & { events: Array<TaskEventFragment>, workRequests: Array<Pick<User, 'id'>> }
  )> };

export type FinalizeTaskMutationVariables = {
  input: TaskIdInput
};


export type FinalizeTaskMutation = { finalizeTask: Maybe<(
    Pick<Task, 'id' | 'finalizedAt'>
    & { events: Array<TaskEventFragment> }
  )> };

export type RemoveTaskPayoutMutationVariables = {
  input: RemoveTaskPayoutInput
};


export type RemoveTaskPayoutMutation = { removeTaskPayout: Maybe<(
    Pick<Task, 'id'>
    & { events: Array<TaskEventFragment> }
  )> };

export type SendWorkInviteMutationVariables = {
  input: SendWorkInviteInput
};


export type SendWorkInviteMutation = { sendWorkInvite: Maybe<(
    Pick<Task, 'id'>
    & { events: Array<TaskEventFragment>, workInvites: Array<Pick<User, 'id'>> }
  )> };

export type SetTaskDomainMutationVariables = {
  input: SetTaskDomainInput
};


export type SetTaskDomainMutation = { setTaskDomain: Maybe<(
    Pick<Task, 'id' | 'ethDomainId'>
    & { events: Array<TaskEventFragment> }
  )> };

export type SetTaskDescriptionMutationVariables = {
  input: SetTaskDescriptionInput
};


export type SetTaskDescriptionMutation = { setTaskDescription: Maybe<(
    Pick<Task, 'id' | 'description'>
    & { events: Array<TaskEventFragment> }
  )> };

export type SetTaskDueDateMutationVariables = {
  input: SetTaskDueDateInput
};


export type SetTaskDueDateMutation = { setTaskDueDate: Maybe<(
    Pick<Task, 'id' | 'dueDate'>
    & { events: Array<TaskEventFragment> }
  )> };

export type SetTaskPayoutMutationVariables = {
  input: SetTaskPayoutInput
};


export type SetTaskPayoutMutation = { setTaskPayout: Maybe<(
    Pick<Task, 'id'>
    & { events: Array<TaskEventFragment>, payouts: Array<(
      Pick<TaskPayout, 'amount'>
      & { token: Pick<Token, 'id' | 'address'> }
    )> }
  )> };

export type SetTaskSkillMutationVariables = {
  input: SetTaskSkillInput
};


export type SetTaskSkillMutation = { setTaskSkill: Maybe<(
    Pick<Task, 'id' | 'ethSkillId'>
    & { events: Array<TaskEventFragment> }
  )> };

export type SetTaskTitleMutationVariables = {
  input: SetTaskTitleInput
};


export type SetTaskTitleMutation = { setTaskTitle: Maybe<(
    Pick<Task, 'id' | 'title'>
    & { events: Array<TaskEventFragment> }
  )> };

export type UnassignWorkerMutationVariables = {
  input: UnassignWorkerInput
};


export type UnassignWorkerMutation = { unassignWorker: Maybe<(
    Pick<Task, 'id'>
    & { assignedWorker: Maybe<Pick<User, 'id'>>, events: Array<TaskEventFragment> }
  )> };

export type SendTaskMessageMutationVariables = {
  input: SendTaskMessageInput
};


export type SendTaskMessageMutation = Pick<Mutation, 'sendTaskMessage'>;

export type SetLoggedInUserMutationVariables = {
  input: LoggedInUserInput
};


export type SetLoggedInUserMutation = { setLoggedInUser: Pick<LoggedInUser, 'id'> };

export type CreateUserMutationVariables = {
  createUserInput: CreateUserInput,
  loggedInUserInput: LoggedInUserInput
};


export type CreateUserMutation = { createUser: Maybe<Pick<User, 'id'>>, setLoggedInUser: Pick<LoggedInUser, 'id'> };

export type EditUserMutationVariables = {
  input: EditUserInput
};


export type EditUserMutation = { editUser: Maybe<(
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'avatarHash' | 'bio' | 'displayName' | 'location' | 'website'> }
  )> };

export type SetUserTokensMutationVariables = {
  input: SetUserTokensInput
};


export type SetUserTokensMutation = { setUserTokens: Maybe<Pick<User, 'id' | 'tokenAddresses'>> };

export type SetColonyTokensMutationVariables = {
  input: SetColonyTokensInput
};


export type SetColonyTokensMutation = { setColonyTokens: Maybe<Pick<Colony, 'id' | 'tokenAddresses'>> };

export type CreateColonyMutationVariables = {
  input: CreateColonyInput
};


export type CreateColonyMutation = { createColony: Maybe<Pick<Colony, 'id' | 'colonyAddress' | 'colonyName' | 'avatarHash' | 'description' | 'displayName' | 'guideline' | 'website'>> };

export type EditColonyProfileMutationVariables = {
  input: EditColonyProfileInput
};


export type EditColonyProfileMutation = { editColonyProfile: Maybe<Pick<Colony, 'id' | 'colonyName' | 'avatarHash' | 'description' | 'displayName' | 'guideline' | 'website'>> };

export type MarkNotificationAsReadMutationVariables = {
  input: MarkNotificationAsReadInput
};


export type MarkNotificationAsReadMutation = Pick<Mutation, 'markNotificationAsRead'>;

export type MarkAllNotificationsAsReadMutationVariables = {};


export type MarkAllNotificationsAsReadMutation = Pick<Mutation, 'markAllNotificationsAsRead'>;

export type SubscribeToColonyMutationVariables = {
  input: SubscribeToColonyInput
};


export type SubscribeToColonyMutation = { subscribeToColony: Maybe<Pick<User, 'id'>> };

export type UnsubscribeFromColonyMutationVariables = {
  input: UnsubscribeFromColonyInput
};


export type UnsubscribeFromColonyMutation = { unsubscribeFromColony: Maybe<Pick<User, 'id'>> };

export type CreateDomainMutationVariables = {
  input: CreateDomainInput
};


export type CreateDomainMutation = { createDomain: Maybe<Pick<Domain, 'id' | 'ethDomainId' | 'ethParentDomainId' | 'name'>> };

export type EditDomainMutationVariables = {
  input: EditDomainNameInput
};


export type EditDomainMutation = { editDomainName: Maybe<Pick<Domain, 'id' | 'ethDomainId' | 'ethParentDomainId' | 'name'>> };

export type TaskQueryVariables = {
  id: Scalars['String']
};


export type TaskQuery = { task: (
    Pick<Task, 'id' | 'assignedWorkerAddress' | 'cancelledAt' | 'colonyAddress' | 'createdAt' | 'creatorAddress' | 'description' | 'dueDate' | 'ethDomainId' | 'ethSkillId' | 'ethTaskId' | 'finalizedAt' | 'title' | 'workInviteAddresses' | 'workRequestAddresses'>
    & { assignedWorker: Maybe<(
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    )>, colony: Pick<Colony, 'id' | 'colonyAddress' | 'colonyName' | 'avatarHash' | 'displayName' | 'nativeTokenAddress'>, creator: (
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    ), payouts: Array<(
      Pick<TaskPayout, 'amount'>
      & { token: Pick<Token, 'id' | 'address'> }
    )>, workInvites: Array<(
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    )>, workRequests: Array<(
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    )> }
    & PayoutsFragment
  ) };

export type TaskToEditQueryVariables = {
  id: Scalars['String']
};


export type TaskToEditQuery = { task: (
    Pick<Task, 'id'>
    & { assignedWorker: Maybe<(
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    )>, workRequests: Array<(
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    )>, colony: (
      Pick<Colony, 'nativeTokenAddress'>
      & { subscribedUsers: Array<(
        Pick<User, 'id'>
        & { profile: Pick<UserProfile, 'displayName' | 'walletAddress' | 'username' | 'avatarHash'> }
      )>, tokens: Array<(
        Pick<Token, 'id' | 'address'>
        & { details: Pick<TokenInfo, 'decimals' | 'name' | 'symbol'> }
      )> }
    ) }
    & PayoutsFragment
  ) };

export type TaskFeedEventsQueryVariables = {
  id: Scalars['String']
};


export type TaskFeedEventsQuery = { task: (
    Pick<Task, 'id'>
    & { events: Array<TaskEventFragment> }
  ) };

export type LoggedInUserQueryVariables = {};


export type LoggedInUserQuery = { loggedInUser: Pick<LoggedInUser, 'walletAddress' | 'balance' | 'username'> };

export type UserQueryVariables = {
  address: Scalars['String']
};


export type UserQuery = { user: (
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'username' | 'walletAddress' | 'displayName' | 'bio' | 'location' | 'website' | 'avatarHash'> }
  ) };

export type UserTasksQueryVariables = {
  address: Scalars['String']
};


export type UserTasksQuery = { user: (
    Pick<User, 'id'>
    & { tasks: Array<(
      Pick<Task, 'id' | 'assignedWorkerAddress' | 'cancelledAt' | 'colonyAddress' | 'createdAt' | 'creatorAddress' | 'dueDate' | 'ethDomainId' | 'ethSkillId' | 'finalizedAt' | 'title' | 'workRequestAddresses'>
      & { assignedWorker: Maybe<(
        Pick<User, 'id'>
        & { profile: Pick<UserProfile, 'avatarHash'> }
      )>, colony: Pick<Colony, 'id' | 'colonyName' | 'displayName' | 'nativeTokenAddress'> }
      & PayoutsFragment
    )> }
  ) };

export type UserTokensQueryVariables = {
  address: Scalars['String']
};


export type UserTokensQuery = { user: (
    Pick<User, 'id'>
    & { tokens: Array<(
      Pick<Token, 'id' | 'address' | 'iconHash' | 'balance'>
      & { details: Pick<TokenInfo, 'decimals' | 'name' | 'symbol'> }
    )> }
  ) };

export type ColonyFromNameQueryVariables = {
  name: Scalars['String'],
  address: Scalars['String']
};


export type ColonyFromNameQuery = (
  Pick<Query, 'colonyAddress'>
  & { colony: FullColonyFragment }
);

export type ColonyNameQueryVariables = {
  address: Scalars['String']
};


export type ColonyNameQuery = Pick<Query, 'colonyName'>;

export type ColonyQueryVariables = {
  address: Scalars['String']
};


export type ColonyQuery = { colony: FullColonyFragment };

export type ColonyTokensQueryVariables = {
  address: Scalars['String']
};


export type ColonyTokensQuery = { colony: (
    Pick<Colony, 'id'>
    & TokensFragment
  ) };

export type TokenBalancesForDomainsQueryVariables = {
  colonyAddress: Scalars['String'],
  tokenAddresses?: Maybe<Array<Scalars['String']>>,
  domainIds?: Maybe<Array<Scalars['Int']>>
};


export type TokenBalancesForDomainsQuery = { colony: (
    Pick<Colony, 'id'>
    & { tokens: Array<(
      Pick<Token, 'id' | 'address'>
      & { balances: Array<Pick<DomainBalance, 'domainId' | 'amount'>> }
    )> }
  ) };

export type ColonyProfileQueryVariables = {
  address: Scalars['String']
};


export type ColonyProfileQuery = { colony: ColonyProfileFragment };

export type UserColonyIdsQueryVariables = {
  address: Scalars['String']
};


export type UserColonyIdsQuery = { user: (
    Pick<User, 'id'>
    & { colonies: Array<Pick<Colony, 'id'>> }
  ) };

export type ColonyTasksQueryVariables = {
  address: Scalars['String']
};


export type ColonyTasksQuery = { colony: (
    Pick<Colony, 'id'>
    & { tasks: Array<(
      Pick<Task, 'id' | 'assignedWorkerAddress' | 'cancelledAt' | 'colonyAddress' | 'createdAt' | 'creatorAddress' | 'dueDate' | 'ethDomainId' | 'ethSkillId' | 'finalizedAt' | 'title' | 'workRequestAddresses'>
      & { assignedWorker: Maybe<(
        Pick<User, 'id'>
        & { profile: Pick<UserProfile, 'avatarHash'> }
      )>, colony: Pick<Colony, 'id' | 'colonyName' | 'displayName' | 'nativeTokenAddress'>, payouts: Array<(
        Pick<TaskPayout, 'amount'>
        & { token: Pick<Token, 'id' | 'address'> }
      )> }
    )> }
  ) };

export type ColonySubscribedUsersQueryVariables = {
  colonyAddress: Scalars['String']
};


export type ColonySubscribedUsersQuery = { colony: (
    Pick<Colony, 'id'>
    & { subscribedUsers: Array<(
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    )> }
  ) };

export type DomainQueryVariables = {
  colonyAddress: Scalars['String'],
  ethDomainId: Scalars['Int']
};


export type DomainQuery = { domain: Pick<Domain, 'id' | 'ethDomainId' | 'name' | 'ethParentDomainId'> };

export type TokenQueryVariables = {
  address: Scalars['String']
};


export type TokenQuery = { token: (
    Pick<Token, 'id' | 'address' | 'iconHash'>
    & { details: Pick<TokenInfo, 'decimals' | 'name' | 'symbol'> }
  ) };

export type TokenInfoQueryVariables = {
  address: Scalars['String']
};


export type TokenInfoQuery = { token: { info: Pick<TokenInfo, 'decimals' | 'name' | 'symbol'> } };

export type ColonyDomainsQueryVariables = {
  colonyAddress: Scalars['String']
};


export type ColonyDomainsQuery = { colony: (
    Pick<Colony, 'id'>
    & { domains: Array<Pick<Domain, 'id' | 'ethDomainId' | 'name' | 'ethParentDomainId'>> }
  ) };

export type AllTokensQueryVariables = {};


export type AllTokensQuery = { allTokens: Array<(
    Pick<Token, 'id' | 'address' | 'iconHash'>
    & { details: Pick<TokenInfo, 'name' | 'symbol' | 'decimals'> }
  )> };

export const PayoutsFragmentDoc = gql`
    fragment Payouts on Task {
  payouts {
    amount
    token {
      id
      address
      details @client {
        decimals
        name
        symbol
      }
    }
  }
}
    `;
export const ColonyProfileFragmentDoc = gql`
    fragment ColonyProfile on Colony {
  id
  colonyAddress
  colonyName
  avatarHash
  description
  displayName
  guideline
  website
}
    `;
export const TokensFragmentDoc = gql`
    fragment Tokens on Colony {
  nativeTokenAddress
  tokens {
    id
    address
    iconHash
    details @client {
      decimals
      name
      symbol
    }
    balances(colonyAddress: $address) @client {
      domainId
      amount
    }
  }
}
    `;
export const FullColonyFragmentDoc = gql`
    fragment FullColony on Colony {
  ...ColonyProfile
  ...Tokens
  isNativeTokenExternal
  version(address: $address) @client
  canMintNativeToken(address: $address) @client
  canUnlockNativeToken(address: $address) @client
  isInRecoveryMode(address: $address) @client
  isNativeTokenLocked(address: $address) @client
}
    ${ColonyProfileFragmentDoc}
${TokensFragmentDoc}`;
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
export const TaskEventFragmentDoc = gql`
    fragment TaskEvent on Event {
  ...EventFields
  context {
    ... on AssignWorkerEvent {
      taskId
      type
      workerAddress
    }
    ... on CancelTaskEvent {
      taskId
      type
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
    }
    ... on FinalizeTaskEvent {
      taskId
      type
    }
    ... on RemoveTaskPayoutEvent {
      amount
      taskId
      tokenAddress
      type
    }
    ... on SendWorkInviteEvent {
      taskId
      type
      workerAddress
    }
    ... on SetTaskDescriptionEvent {
      description
      taskId
      type
    }
    ... on SetTaskDomainEvent {
      ethDomainId
      taskId
      type
    }
    ... on SetTaskDueDateEvent {
      dueDate
      taskId
      type
    }
    ... on SetTaskPayoutEvent {
      amount
      taskId
      tokenAddress
      type
    }
    ... on SetTaskSkillEvent {
      ethSkillId
      taskId
      type
    }
    ... on SetTaskTitleEvent {
      taskId
      title
      type
    }
    ... on TaskMessageEvent {
      message
      taskId
      type
    }
    ... on UnassignWorkerEvent {
      taskId
      type
      workerAddress
    }
  }
}
    ${EventFieldsFragmentDoc}`;
export const AssignWorkerDocument = gql`
    mutation AssignWorker($input: AssignWorkerInput!) {
  assignWorker(input: $input) {
    id
    assignedWorker {
      id
    }
    events {
      ...TaskEvent
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type AssignWorkerMutationFn = ApolloReactCommon.MutationFunction<AssignWorkerMutation, AssignWorkerMutationVariables>;

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
export function useAssignWorkerMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AssignWorkerMutation, AssignWorkerMutationVariables>) {
        return ApolloReactHooks.useMutation<AssignWorkerMutation, AssignWorkerMutationVariables>(AssignWorkerDocument, baseOptions);
      }
export type AssignWorkerMutationHookResult = ReturnType<typeof useAssignWorkerMutation>;
export type AssignWorkerMutationResult = ApolloReactCommon.MutationResult<AssignWorkerMutation>;
export type AssignWorkerMutationOptions = ApolloReactCommon.BaseMutationOptions<AssignWorkerMutation, AssignWorkerMutationVariables>;
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
export type CancelTaskMutationFn = ApolloReactCommon.MutationFunction<CancelTaskMutation, CancelTaskMutationVariables>;

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
export function useCancelTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CancelTaskMutation, CancelTaskMutationVariables>) {
        return ApolloReactHooks.useMutation<CancelTaskMutation, CancelTaskMutationVariables>(CancelTaskDocument, baseOptions);
      }
export type CancelTaskMutationHookResult = ReturnType<typeof useCancelTaskMutation>;
export type CancelTaskMutationResult = ApolloReactCommon.MutationResult<CancelTaskMutation>;
export type CancelTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<CancelTaskMutation, CancelTaskMutationVariables>;
export const CreateTaskDocument = gql`
    mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    id
    colony {
      colonyName
    }
    events {
      ...TaskEvent
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type CreateTaskMutationFn = ApolloReactCommon.MutationFunction<CreateTaskMutation, CreateTaskMutationVariables>;

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
export function useCreateTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateTaskMutation, CreateTaskMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument, baseOptions);
      }
export type CreateTaskMutationHookResult = ReturnType<typeof useCreateTaskMutation>;
export type CreateTaskMutationResult = ApolloReactCommon.MutationResult<CreateTaskMutation>;
export type CreateTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateTaskMutation, CreateTaskMutationVariables>;
export const CreateWorkRequestDocument = gql`
    mutation CreateWorkRequest($input: CreateWorkRequestInput!) {
  createWorkRequest(input: $input) {
    id
    events {
      ...TaskEvent
    }
    workRequests {
      id
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type CreateWorkRequestMutationFn = ApolloReactCommon.MutationFunction<CreateWorkRequestMutation, CreateWorkRequestMutationVariables>;

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
export function useCreateWorkRequestMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateWorkRequestMutation, CreateWorkRequestMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateWorkRequestMutation, CreateWorkRequestMutationVariables>(CreateWorkRequestDocument, baseOptions);
      }
export type CreateWorkRequestMutationHookResult = ReturnType<typeof useCreateWorkRequestMutation>;
export type CreateWorkRequestMutationResult = ApolloReactCommon.MutationResult<CreateWorkRequestMutation>;
export type CreateWorkRequestMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateWorkRequestMutation, CreateWorkRequestMutationVariables>;
export const FinalizeTaskDocument = gql`
    mutation FinalizeTask($input: TaskIdInput!) {
  finalizeTask(input: $input) {
    id
    events {
      ...TaskEvent
    }
    finalizedAt
  }
}
    ${TaskEventFragmentDoc}`;
export type FinalizeTaskMutationFn = ApolloReactCommon.MutationFunction<FinalizeTaskMutation, FinalizeTaskMutationVariables>;

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
export function useFinalizeTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<FinalizeTaskMutation, FinalizeTaskMutationVariables>) {
        return ApolloReactHooks.useMutation<FinalizeTaskMutation, FinalizeTaskMutationVariables>(FinalizeTaskDocument, baseOptions);
      }
export type FinalizeTaskMutationHookResult = ReturnType<typeof useFinalizeTaskMutation>;
export type FinalizeTaskMutationResult = ApolloReactCommon.MutationResult<FinalizeTaskMutation>;
export type FinalizeTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<FinalizeTaskMutation, FinalizeTaskMutationVariables>;
export const RemoveTaskPayoutDocument = gql`
    mutation RemoveTaskPayout($input: RemoveTaskPayoutInput!) {
  removeTaskPayout(input: $input) {
    id
    events {
      ...TaskEvent
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type RemoveTaskPayoutMutationFn = ApolloReactCommon.MutationFunction<RemoveTaskPayoutMutation, RemoveTaskPayoutMutationVariables>;

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
export function useRemoveTaskPayoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveTaskPayoutMutation, RemoveTaskPayoutMutationVariables>) {
        return ApolloReactHooks.useMutation<RemoveTaskPayoutMutation, RemoveTaskPayoutMutationVariables>(RemoveTaskPayoutDocument, baseOptions);
      }
export type RemoveTaskPayoutMutationHookResult = ReturnType<typeof useRemoveTaskPayoutMutation>;
export type RemoveTaskPayoutMutationResult = ApolloReactCommon.MutationResult<RemoveTaskPayoutMutation>;
export type RemoveTaskPayoutMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveTaskPayoutMutation, RemoveTaskPayoutMutationVariables>;
export const SendWorkInviteDocument = gql`
    mutation SendWorkInvite($input: SendWorkInviteInput!) {
  sendWorkInvite(input: $input) {
    id
    events {
      ...TaskEvent
    }
    workInvites {
      id
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type SendWorkInviteMutationFn = ApolloReactCommon.MutationFunction<SendWorkInviteMutation, SendWorkInviteMutationVariables>;

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
export function useSendWorkInviteMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SendWorkInviteMutation, SendWorkInviteMutationVariables>) {
        return ApolloReactHooks.useMutation<SendWorkInviteMutation, SendWorkInviteMutationVariables>(SendWorkInviteDocument, baseOptions);
      }
export type SendWorkInviteMutationHookResult = ReturnType<typeof useSendWorkInviteMutation>;
export type SendWorkInviteMutationResult = ApolloReactCommon.MutationResult<SendWorkInviteMutation>;
export type SendWorkInviteMutationOptions = ApolloReactCommon.BaseMutationOptions<SendWorkInviteMutation, SendWorkInviteMutationVariables>;
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
export type SetTaskDomainMutationFn = ApolloReactCommon.MutationFunction<SetTaskDomainMutation, SetTaskDomainMutationVariables>;

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
export function useSetTaskDomainMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetTaskDomainMutation, SetTaskDomainMutationVariables>) {
        return ApolloReactHooks.useMutation<SetTaskDomainMutation, SetTaskDomainMutationVariables>(SetTaskDomainDocument, baseOptions);
      }
export type SetTaskDomainMutationHookResult = ReturnType<typeof useSetTaskDomainMutation>;
export type SetTaskDomainMutationResult = ApolloReactCommon.MutationResult<SetTaskDomainMutation>;
export type SetTaskDomainMutationOptions = ApolloReactCommon.BaseMutationOptions<SetTaskDomainMutation, SetTaskDomainMutationVariables>;
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
export type SetTaskDescriptionMutationFn = ApolloReactCommon.MutationFunction<SetTaskDescriptionMutation, SetTaskDescriptionMutationVariables>;

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
export function useSetTaskDescriptionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetTaskDescriptionMutation, SetTaskDescriptionMutationVariables>) {
        return ApolloReactHooks.useMutation<SetTaskDescriptionMutation, SetTaskDescriptionMutationVariables>(SetTaskDescriptionDocument, baseOptions);
      }
export type SetTaskDescriptionMutationHookResult = ReturnType<typeof useSetTaskDescriptionMutation>;
export type SetTaskDescriptionMutationResult = ApolloReactCommon.MutationResult<SetTaskDescriptionMutation>;
export type SetTaskDescriptionMutationOptions = ApolloReactCommon.BaseMutationOptions<SetTaskDescriptionMutation, SetTaskDescriptionMutationVariables>;
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
export type SetTaskDueDateMutationFn = ApolloReactCommon.MutationFunction<SetTaskDueDateMutation, SetTaskDueDateMutationVariables>;

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
export function useSetTaskDueDateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetTaskDueDateMutation, SetTaskDueDateMutationVariables>) {
        return ApolloReactHooks.useMutation<SetTaskDueDateMutation, SetTaskDueDateMutationVariables>(SetTaskDueDateDocument, baseOptions);
      }
export type SetTaskDueDateMutationHookResult = ReturnType<typeof useSetTaskDueDateMutation>;
export type SetTaskDueDateMutationResult = ApolloReactCommon.MutationResult<SetTaskDueDateMutation>;
export type SetTaskDueDateMutationOptions = ApolloReactCommon.BaseMutationOptions<SetTaskDueDateMutation, SetTaskDueDateMutationVariables>;
export const SetTaskPayoutDocument = gql`
    mutation SetTaskPayout($input: SetTaskPayoutInput!) {
  setTaskPayout(input: $input) {
    id
    events {
      ...TaskEvent
    }
    payouts {
      amount
      token {
        id
        address
      }
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type SetTaskPayoutMutationFn = ApolloReactCommon.MutationFunction<SetTaskPayoutMutation, SetTaskPayoutMutationVariables>;

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
export function useSetTaskPayoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetTaskPayoutMutation, SetTaskPayoutMutationVariables>) {
        return ApolloReactHooks.useMutation<SetTaskPayoutMutation, SetTaskPayoutMutationVariables>(SetTaskPayoutDocument, baseOptions);
      }
export type SetTaskPayoutMutationHookResult = ReturnType<typeof useSetTaskPayoutMutation>;
export type SetTaskPayoutMutationResult = ApolloReactCommon.MutationResult<SetTaskPayoutMutation>;
export type SetTaskPayoutMutationOptions = ApolloReactCommon.BaseMutationOptions<SetTaskPayoutMutation, SetTaskPayoutMutationVariables>;
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
export type SetTaskSkillMutationFn = ApolloReactCommon.MutationFunction<SetTaskSkillMutation, SetTaskSkillMutationVariables>;

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
export function useSetTaskSkillMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetTaskSkillMutation, SetTaskSkillMutationVariables>) {
        return ApolloReactHooks.useMutation<SetTaskSkillMutation, SetTaskSkillMutationVariables>(SetTaskSkillDocument, baseOptions);
      }
export type SetTaskSkillMutationHookResult = ReturnType<typeof useSetTaskSkillMutation>;
export type SetTaskSkillMutationResult = ApolloReactCommon.MutationResult<SetTaskSkillMutation>;
export type SetTaskSkillMutationOptions = ApolloReactCommon.BaseMutationOptions<SetTaskSkillMutation, SetTaskSkillMutationVariables>;
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
export type SetTaskTitleMutationFn = ApolloReactCommon.MutationFunction<SetTaskTitleMutation, SetTaskTitleMutationVariables>;

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
export function useSetTaskTitleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetTaskTitleMutation, SetTaskTitleMutationVariables>) {
        return ApolloReactHooks.useMutation<SetTaskTitleMutation, SetTaskTitleMutationVariables>(SetTaskTitleDocument, baseOptions);
      }
export type SetTaskTitleMutationHookResult = ReturnType<typeof useSetTaskTitleMutation>;
export type SetTaskTitleMutationResult = ApolloReactCommon.MutationResult<SetTaskTitleMutation>;
export type SetTaskTitleMutationOptions = ApolloReactCommon.BaseMutationOptions<SetTaskTitleMutation, SetTaskTitleMutationVariables>;
export const UnassignWorkerDocument = gql`
    mutation UnassignWorker($input: UnassignWorkerInput!) {
  unassignWorker(input: $input) {
    id
    assignedWorker {
      id
    }
    events {
      ...TaskEvent
    }
  }
}
    ${TaskEventFragmentDoc}`;
export type UnassignWorkerMutationFn = ApolloReactCommon.MutationFunction<UnassignWorkerMutation, UnassignWorkerMutationVariables>;

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
export function useUnassignWorkerMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UnassignWorkerMutation, UnassignWorkerMutationVariables>) {
        return ApolloReactHooks.useMutation<UnassignWorkerMutation, UnassignWorkerMutationVariables>(UnassignWorkerDocument, baseOptions);
      }
export type UnassignWorkerMutationHookResult = ReturnType<typeof useUnassignWorkerMutation>;
export type UnassignWorkerMutationResult = ApolloReactCommon.MutationResult<UnassignWorkerMutation>;
export type UnassignWorkerMutationOptions = ApolloReactCommon.BaseMutationOptions<UnassignWorkerMutation, UnassignWorkerMutationVariables>;
export const SendTaskMessageDocument = gql`
    mutation SendTaskMessage($input: SendTaskMessageInput!) {
  sendTaskMessage(input: $input)
}
    `;
export type SendTaskMessageMutationFn = ApolloReactCommon.MutationFunction<SendTaskMessageMutation, SendTaskMessageMutationVariables>;

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
export function useSendTaskMessageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SendTaskMessageMutation, SendTaskMessageMutationVariables>) {
        return ApolloReactHooks.useMutation<SendTaskMessageMutation, SendTaskMessageMutationVariables>(SendTaskMessageDocument, baseOptions);
      }
export type SendTaskMessageMutationHookResult = ReturnType<typeof useSendTaskMessageMutation>;
export type SendTaskMessageMutationResult = ApolloReactCommon.MutationResult<SendTaskMessageMutation>;
export type SendTaskMessageMutationOptions = ApolloReactCommon.BaseMutationOptions<SendTaskMessageMutation, SendTaskMessageMutationVariables>;
export const SetLoggedInUserDocument = gql`
    mutation SetLoggedInUser($input: LoggedInUserInput!) {
  setLoggedInUser(input: $input) @client {
    id
  }
}
    `;
export type SetLoggedInUserMutationFn = ApolloReactCommon.MutationFunction<SetLoggedInUserMutation, SetLoggedInUserMutationVariables>;

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
export function useSetLoggedInUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetLoggedInUserMutation, SetLoggedInUserMutationVariables>) {
        return ApolloReactHooks.useMutation<SetLoggedInUserMutation, SetLoggedInUserMutationVariables>(SetLoggedInUserDocument, baseOptions);
      }
export type SetLoggedInUserMutationHookResult = ReturnType<typeof useSetLoggedInUserMutation>;
export type SetLoggedInUserMutationResult = ApolloReactCommon.MutationResult<SetLoggedInUserMutation>;
export type SetLoggedInUserMutationOptions = ApolloReactCommon.BaseMutationOptions<SetLoggedInUserMutation, SetLoggedInUserMutationVariables>;
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
export type CreateUserMutationFn = ApolloReactCommon.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

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
export function useCreateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, baseOptions);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = ApolloReactCommon.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
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
export type EditUserMutationFn = ApolloReactCommon.MutationFunction<EditUserMutation, EditUserMutationVariables>;

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
export function useEditUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditUserMutation, EditUserMutationVariables>) {
        return ApolloReactHooks.useMutation<EditUserMutation, EditUserMutationVariables>(EditUserDocument, baseOptions);
      }
export type EditUserMutationHookResult = ReturnType<typeof useEditUserMutation>;
export type EditUserMutationResult = ApolloReactCommon.MutationResult<EditUserMutation>;
export type EditUserMutationOptions = ApolloReactCommon.BaseMutationOptions<EditUserMutation, EditUserMutationVariables>;
export const SetUserTokensDocument = gql`
    mutation SetUserTokens($input: SetUserTokensInput!) {
  setUserTokens(input: $input) {
    id
    tokenAddresses
  }
}
    `;
export type SetUserTokensMutationFn = ApolloReactCommon.MutationFunction<SetUserTokensMutation, SetUserTokensMutationVariables>;

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
export function useSetUserTokensMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetUserTokensMutation, SetUserTokensMutationVariables>) {
        return ApolloReactHooks.useMutation<SetUserTokensMutation, SetUserTokensMutationVariables>(SetUserTokensDocument, baseOptions);
      }
export type SetUserTokensMutationHookResult = ReturnType<typeof useSetUserTokensMutation>;
export type SetUserTokensMutationResult = ApolloReactCommon.MutationResult<SetUserTokensMutation>;
export type SetUserTokensMutationOptions = ApolloReactCommon.BaseMutationOptions<SetUserTokensMutation, SetUserTokensMutationVariables>;
export const SetColonyTokensDocument = gql`
    mutation SetColonyTokens($input: SetColonyTokensInput!) {
  setColonyTokens(input: $input) {
    id
    tokenAddresses
  }
}
    `;
export type SetColonyTokensMutationFn = ApolloReactCommon.MutationFunction<SetColonyTokensMutation, SetColonyTokensMutationVariables>;

/**
 * __useSetColonyTokensMutation__
 *
 * To run a mutation, you first call `useSetColonyTokensMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetColonyTokensMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setColonyTokensMutation, { data, loading, error }] = useSetColonyTokensMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetColonyTokensMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetColonyTokensMutation, SetColonyTokensMutationVariables>) {
        return ApolloReactHooks.useMutation<SetColonyTokensMutation, SetColonyTokensMutationVariables>(SetColonyTokensDocument, baseOptions);
      }
export type SetColonyTokensMutationHookResult = ReturnType<typeof useSetColonyTokensMutation>;
export type SetColonyTokensMutationResult = ApolloReactCommon.MutationResult<SetColonyTokensMutation>;
export type SetColonyTokensMutationOptions = ApolloReactCommon.BaseMutationOptions<SetColonyTokensMutation, SetColonyTokensMutationVariables>;
export const CreateColonyDocument = gql`
    mutation CreateColony($input: CreateColonyInput!) {
  createColony(input: $input) {
    id
    colonyAddress
    colonyName
    avatarHash
    description
    displayName
    guideline
    website
  }
}
    `;
export type CreateColonyMutationFn = ApolloReactCommon.MutationFunction<CreateColonyMutation, CreateColonyMutationVariables>;

/**
 * __useCreateColonyMutation__
 *
 * To run a mutation, you first call `useCreateColonyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateColonyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createColonyMutation, { data, loading, error }] = useCreateColonyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateColonyMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateColonyMutation, CreateColonyMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateColonyMutation, CreateColonyMutationVariables>(CreateColonyDocument, baseOptions);
      }
export type CreateColonyMutationHookResult = ReturnType<typeof useCreateColonyMutation>;
export type CreateColonyMutationResult = ApolloReactCommon.MutationResult<CreateColonyMutation>;
export type CreateColonyMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateColonyMutation, CreateColonyMutationVariables>;
export const EditColonyProfileDocument = gql`
    mutation EditColonyProfile($input: EditColonyProfileInput!) {
  editColonyProfile(input: $input) {
    id
    colonyName
    avatarHash
    description
    displayName
    guideline
    website
  }
}
    `;
export type EditColonyProfileMutationFn = ApolloReactCommon.MutationFunction<EditColonyProfileMutation, EditColonyProfileMutationVariables>;

/**
 * __useEditColonyProfileMutation__
 *
 * To run a mutation, you first call `useEditColonyProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditColonyProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editColonyProfileMutation, { data, loading, error }] = useEditColonyProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditColonyProfileMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditColonyProfileMutation, EditColonyProfileMutationVariables>) {
        return ApolloReactHooks.useMutation<EditColonyProfileMutation, EditColonyProfileMutationVariables>(EditColonyProfileDocument, baseOptions);
      }
export type EditColonyProfileMutationHookResult = ReturnType<typeof useEditColonyProfileMutation>;
export type EditColonyProfileMutationResult = ApolloReactCommon.MutationResult<EditColonyProfileMutation>;
export type EditColonyProfileMutationOptions = ApolloReactCommon.BaseMutationOptions<EditColonyProfileMutation, EditColonyProfileMutationVariables>;
export const MarkNotificationAsReadDocument = gql`
    mutation MarkNotificationAsRead($input: MarkNotificationAsReadInput!) {
  markNotificationAsRead(input: $input)
}
    `;
export type MarkNotificationAsReadMutationFn = ApolloReactCommon.MutationFunction<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>;

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
export function useMarkNotificationAsReadMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>) {
        return ApolloReactHooks.useMutation<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>(MarkNotificationAsReadDocument, baseOptions);
      }
export type MarkNotificationAsReadMutationHookResult = ReturnType<typeof useMarkNotificationAsReadMutation>;
export type MarkNotificationAsReadMutationResult = ApolloReactCommon.MutationResult<MarkNotificationAsReadMutation>;
export type MarkNotificationAsReadMutationOptions = ApolloReactCommon.BaseMutationOptions<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>;
export const MarkAllNotificationsAsReadDocument = gql`
    mutation MarkAllNotificationsAsRead {
  markAllNotificationsAsRead
}
    `;
export type MarkAllNotificationsAsReadMutationFn = ApolloReactCommon.MutationFunction<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>;

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
export function useMarkAllNotificationsAsReadMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>) {
        return ApolloReactHooks.useMutation<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>(MarkAllNotificationsAsReadDocument, baseOptions);
      }
export type MarkAllNotificationsAsReadMutationHookResult = ReturnType<typeof useMarkAllNotificationsAsReadMutation>;
export type MarkAllNotificationsAsReadMutationResult = ApolloReactCommon.MutationResult<MarkAllNotificationsAsReadMutation>;
export type MarkAllNotificationsAsReadMutationOptions = ApolloReactCommon.BaseMutationOptions<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>;
export const SubscribeToColonyDocument = gql`
    mutation SubscribeToColony($input: SubscribeToColonyInput!) {
  subscribeToColony(input: $input) {
    id
  }
}
    `;
export type SubscribeToColonyMutationFn = ApolloReactCommon.MutationFunction<SubscribeToColonyMutation, SubscribeToColonyMutationVariables>;

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
export function useSubscribeToColonyMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SubscribeToColonyMutation, SubscribeToColonyMutationVariables>) {
        return ApolloReactHooks.useMutation<SubscribeToColonyMutation, SubscribeToColonyMutationVariables>(SubscribeToColonyDocument, baseOptions);
      }
export type SubscribeToColonyMutationHookResult = ReturnType<typeof useSubscribeToColonyMutation>;
export type SubscribeToColonyMutationResult = ApolloReactCommon.MutationResult<SubscribeToColonyMutation>;
export type SubscribeToColonyMutationOptions = ApolloReactCommon.BaseMutationOptions<SubscribeToColonyMutation, SubscribeToColonyMutationVariables>;
export const UnsubscribeFromColonyDocument = gql`
    mutation UnsubscribeFromColony($input: UnsubscribeFromColonyInput!) {
  unsubscribeFromColony(input: $input) {
    id
  }
}
    `;
export type UnsubscribeFromColonyMutationFn = ApolloReactCommon.MutationFunction<UnsubscribeFromColonyMutation, UnsubscribeFromColonyMutationVariables>;

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
export function useUnsubscribeFromColonyMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UnsubscribeFromColonyMutation, UnsubscribeFromColonyMutationVariables>) {
        return ApolloReactHooks.useMutation<UnsubscribeFromColonyMutation, UnsubscribeFromColonyMutationVariables>(UnsubscribeFromColonyDocument, baseOptions);
      }
export type UnsubscribeFromColonyMutationHookResult = ReturnType<typeof useUnsubscribeFromColonyMutation>;
export type UnsubscribeFromColonyMutationResult = ApolloReactCommon.MutationResult<UnsubscribeFromColonyMutation>;
export type UnsubscribeFromColonyMutationOptions = ApolloReactCommon.BaseMutationOptions<UnsubscribeFromColonyMutation, UnsubscribeFromColonyMutationVariables>;
export const CreateDomainDocument = gql`
    mutation CreateDomain($input: CreateDomainInput!) {
  createDomain(input: $input) {
    id
    ethDomainId
    ethParentDomainId
    name
  }
}
    `;
export type CreateDomainMutationFn = ApolloReactCommon.MutationFunction<CreateDomainMutation, CreateDomainMutationVariables>;

/**
 * __useCreateDomainMutation__
 *
 * To run a mutation, you first call `useCreateDomainMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDomainMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDomainMutation, { data, loading, error }] = useCreateDomainMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDomainMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateDomainMutation, CreateDomainMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateDomainMutation, CreateDomainMutationVariables>(CreateDomainDocument, baseOptions);
      }
export type CreateDomainMutationHookResult = ReturnType<typeof useCreateDomainMutation>;
export type CreateDomainMutationResult = ApolloReactCommon.MutationResult<CreateDomainMutation>;
export type CreateDomainMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateDomainMutation, CreateDomainMutationVariables>;
export const EditDomainDocument = gql`
    mutation EditDomain($input: EditDomainNameInput!) {
  editDomainName(input: $input) {
    id
    ethDomainId
    ethParentDomainId
    name
  }
}
    `;
export type EditDomainMutationFn = ApolloReactCommon.MutationFunction<EditDomainMutation, EditDomainMutationVariables>;

/**
 * __useEditDomainMutation__
 *
 * To run a mutation, you first call `useEditDomainMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditDomainMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editDomainMutation, { data, loading, error }] = useEditDomainMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditDomainMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditDomainMutation, EditDomainMutationVariables>) {
        return ApolloReactHooks.useMutation<EditDomainMutation, EditDomainMutationVariables>(EditDomainDocument, baseOptions);
      }
export type EditDomainMutationHookResult = ReturnType<typeof useEditDomainMutation>;
export type EditDomainMutationResult = ApolloReactCommon.MutationResult<EditDomainMutation>;
export type EditDomainMutationOptions = ApolloReactCommon.BaseMutationOptions<EditDomainMutation, EditDomainMutationVariables>;
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
    colony {
      id
      colonyAddress
      colonyName
      avatarHash
      displayName
      nativeTokenAddress
    }
    colonyAddress
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
    ethTaskId
    finalizedAt
    payouts {
      amount
      token {
        id
        address
      }
    }
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
export function useTaskQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TaskQuery, TaskQueryVariables>) {
        return ApolloReactHooks.useQuery<TaskQuery, TaskQueryVariables>(TaskDocument, baseOptions);
      }
export function useTaskLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TaskQuery, TaskQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<TaskQuery, TaskQueryVariables>(TaskDocument, baseOptions);
        }
export type TaskQueryHookResult = ReturnType<typeof useTaskQuery>;
export type TaskLazyQueryHookResult = ReturnType<typeof useTaskLazyQuery>;
export type TaskQueryResult = ApolloReactCommon.QueryResult<TaskQuery, TaskQueryVariables>;
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
    colony {
      nativeTokenAddress
      subscribedUsers {
        id
        profile {
          displayName
          walletAddress
          username
          avatarHash
        }
      }
      tokens {
        id
        address
        details @client {
          decimals
          name
          symbol
        }
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
export function useTaskToEditQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TaskToEditQuery, TaskToEditQueryVariables>) {
        return ApolloReactHooks.useQuery<TaskToEditQuery, TaskToEditQueryVariables>(TaskToEditDocument, baseOptions);
      }
export function useTaskToEditLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TaskToEditQuery, TaskToEditQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<TaskToEditQuery, TaskToEditQueryVariables>(TaskToEditDocument, baseOptions);
        }
export type TaskToEditQueryHookResult = ReturnType<typeof useTaskToEditQuery>;
export type TaskToEditLazyQueryHookResult = ReturnType<typeof useTaskToEditLazyQuery>;
export type TaskToEditQueryResult = ApolloReactCommon.QueryResult<TaskToEditQuery, TaskToEditQueryVariables>;
export const TaskFeedEventsDocument = gql`
    query TaskFeedEvents($id: String!) {
  task(id: $id) {
    id
    events {
      ...TaskEvent
    }
  }
}
    ${TaskEventFragmentDoc}`;

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
export function useTaskFeedEventsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TaskFeedEventsQuery, TaskFeedEventsQueryVariables>) {
        return ApolloReactHooks.useQuery<TaskFeedEventsQuery, TaskFeedEventsQueryVariables>(TaskFeedEventsDocument, baseOptions);
      }
export function useTaskFeedEventsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TaskFeedEventsQuery, TaskFeedEventsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<TaskFeedEventsQuery, TaskFeedEventsQueryVariables>(TaskFeedEventsDocument, baseOptions);
        }
export type TaskFeedEventsQueryHookResult = ReturnType<typeof useTaskFeedEventsQuery>;
export type TaskFeedEventsLazyQueryHookResult = ReturnType<typeof useTaskFeedEventsLazyQuery>;
export type TaskFeedEventsQueryResult = ApolloReactCommon.QueryResult<TaskFeedEventsQuery, TaskFeedEventsQueryVariables>;
export const LoggedInUserDocument = gql`
    query LoggedInUser {
  loggedInUser @client {
    walletAddress
    balance
    username
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
export function useLoggedInUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<LoggedInUserQuery, LoggedInUserQueryVariables>) {
        return ApolloReactHooks.useQuery<LoggedInUserQuery, LoggedInUserQueryVariables>(LoggedInUserDocument, baseOptions);
      }
export function useLoggedInUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<LoggedInUserQuery, LoggedInUserQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<LoggedInUserQuery, LoggedInUserQueryVariables>(LoggedInUserDocument, baseOptions);
        }
export type LoggedInUserQueryHookResult = ReturnType<typeof useLoggedInUserQuery>;
export type LoggedInUserLazyQueryHookResult = ReturnType<typeof useLoggedInUserLazyQuery>;
export type LoggedInUserQueryResult = ApolloReactCommon.QueryResult<LoggedInUserQuery, LoggedInUserQueryVariables>;
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
export function useUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserQuery, UserQueryVariables>) {
        return ApolloReactHooks.useQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
      }
export function useUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = ApolloReactCommon.QueryResult<UserQuery, UserQueryVariables>;
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
      colony {
        id
        colonyName
        displayName
        nativeTokenAddress
      }
      colonyAddress
      createdAt
      creatorAddress
      dueDate
      ethDomainId
      ethSkillId
      finalizedAt
      title
      workRequestAddresses
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
export function useUserTasksQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserTasksQuery, UserTasksQueryVariables>) {
        return ApolloReactHooks.useQuery<UserTasksQuery, UserTasksQueryVariables>(UserTasksDocument, baseOptions);
      }
export function useUserTasksLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserTasksQuery, UserTasksQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UserTasksQuery, UserTasksQueryVariables>(UserTasksDocument, baseOptions);
        }
export type UserTasksQueryHookResult = ReturnType<typeof useUserTasksQuery>;
export type UserTasksLazyQueryHookResult = ReturnType<typeof useUserTasksLazyQuery>;
export type UserTasksQueryResult = ApolloReactCommon.QueryResult<UserTasksQuery, UserTasksQueryVariables>;
export const UserTokensDocument = gql`
    query UserTokens($address: String!) {
  user(address: $address) {
    id
    tokens {
      id
      address
      iconHash
      details @client {
        decimals
        name
        symbol
      }
      balance(walletAddress: $address) @client
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
export function useUserTokensQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserTokensQuery, UserTokensQueryVariables>) {
        return ApolloReactHooks.useQuery<UserTokensQuery, UserTokensQueryVariables>(UserTokensDocument, baseOptions);
      }
export function useUserTokensLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserTokensQuery, UserTokensQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UserTokensQuery, UserTokensQueryVariables>(UserTokensDocument, baseOptions);
        }
export type UserTokensQueryHookResult = ReturnType<typeof useUserTokensQuery>;
export type UserTokensLazyQueryHookResult = ReturnType<typeof useUserTokensLazyQuery>;
export type UserTokensQueryResult = ApolloReactCommon.QueryResult<UserTokensQuery, UserTokensQueryVariables>;
export const ColonyFromNameDocument = gql`
    query ColonyFromName($name: String!, $address: String!) {
  colonyAddress(name: $name) @client @export(as: "address")
  colony(address: $address) {
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
export function useColonyFromNameQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ColonyFromNameQuery, ColonyFromNameQueryVariables>) {
        return ApolloReactHooks.useQuery<ColonyFromNameQuery, ColonyFromNameQueryVariables>(ColonyFromNameDocument, baseOptions);
      }
export function useColonyFromNameLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ColonyFromNameQuery, ColonyFromNameQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ColonyFromNameQuery, ColonyFromNameQueryVariables>(ColonyFromNameDocument, baseOptions);
        }
export type ColonyFromNameQueryHookResult = ReturnType<typeof useColonyFromNameQuery>;
export type ColonyFromNameLazyQueryHookResult = ReturnType<typeof useColonyFromNameLazyQuery>;
export type ColonyFromNameQueryResult = ApolloReactCommon.QueryResult<ColonyFromNameQuery, ColonyFromNameQueryVariables>;
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
export function useColonyNameQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ColonyNameQuery, ColonyNameQueryVariables>) {
        return ApolloReactHooks.useQuery<ColonyNameQuery, ColonyNameQueryVariables>(ColonyNameDocument, baseOptions);
      }
export function useColonyNameLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ColonyNameQuery, ColonyNameQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ColonyNameQuery, ColonyNameQueryVariables>(ColonyNameDocument, baseOptions);
        }
export type ColonyNameQueryHookResult = ReturnType<typeof useColonyNameQuery>;
export type ColonyNameLazyQueryHookResult = ReturnType<typeof useColonyNameLazyQuery>;
export type ColonyNameQueryResult = ApolloReactCommon.QueryResult<ColonyNameQuery, ColonyNameQueryVariables>;
export const ColonyDocument = gql`
    query Colony($address: String!) {
  colony(address: $address) {
    ...FullColony
  }
}
    ${FullColonyFragmentDoc}`;

/**
 * __useColonyQuery__
 *
 * To run a query within a React component, call `useColonyQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useColonyQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ColonyQuery, ColonyQueryVariables>) {
        return ApolloReactHooks.useQuery<ColonyQuery, ColonyQueryVariables>(ColonyDocument, baseOptions);
      }
export function useColonyLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ColonyQuery, ColonyQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ColonyQuery, ColonyQueryVariables>(ColonyDocument, baseOptions);
        }
export type ColonyQueryHookResult = ReturnType<typeof useColonyQuery>;
export type ColonyLazyQueryHookResult = ReturnType<typeof useColonyLazyQuery>;
export type ColonyQueryResult = ApolloReactCommon.QueryResult<ColonyQuery, ColonyQueryVariables>;
export const ColonyTokensDocument = gql`
    query ColonyTokens($address: String!) {
  colony(address: $address) {
    id
    ...Tokens
  }
}
    ${TokensFragmentDoc}`;

/**
 * __useColonyTokensQuery__
 *
 * To run a query within a React component, call `useColonyTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyTokensQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useColonyTokensQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ColonyTokensQuery, ColonyTokensQueryVariables>) {
        return ApolloReactHooks.useQuery<ColonyTokensQuery, ColonyTokensQueryVariables>(ColonyTokensDocument, baseOptions);
      }
export function useColonyTokensLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ColonyTokensQuery, ColonyTokensQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ColonyTokensQuery, ColonyTokensQueryVariables>(ColonyTokensDocument, baseOptions);
        }
export type ColonyTokensQueryHookResult = ReturnType<typeof useColonyTokensQuery>;
export type ColonyTokensLazyQueryHookResult = ReturnType<typeof useColonyTokensLazyQuery>;
export type ColonyTokensQueryResult = ApolloReactCommon.QueryResult<ColonyTokensQuery, ColonyTokensQueryVariables>;
export const TokenBalancesForDomainsDocument = gql`
    query TokenBalancesForDomains($colonyAddress: String!, $tokenAddresses: [String!], $domainIds: [Int!]) {
  colony(address: $colonyAddress) {
    id
    tokens(addresses: $tokenAddresses) {
      id
      address
      balances(colonyAddress: $colonyAddress, domainIds: $domainIds) @client {
        domainId
        amount
      }
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
export function useTokenBalancesForDomainsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TokenBalancesForDomainsQuery, TokenBalancesForDomainsQueryVariables>) {
        return ApolloReactHooks.useQuery<TokenBalancesForDomainsQuery, TokenBalancesForDomainsQueryVariables>(TokenBalancesForDomainsDocument, baseOptions);
      }
export function useTokenBalancesForDomainsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TokenBalancesForDomainsQuery, TokenBalancesForDomainsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<TokenBalancesForDomainsQuery, TokenBalancesForDomainsQueryVariables>(TokenBalancesForDomainsDocument, baseOptions);
        }
export type TokenBalancesForDomainsQueryHookResult = ReturnType<typeof useTokenBalancesForDomainsQuery>;
export type TokenBalancesForDomainsLazyQueryHookResult = ReturnType<typeof useTokenBalancesForDomainsLazyQuery>;
export type TokenBalancesForDomainsQueryResult = ApolloReactCommon.QueryResult<TokenBalancesForDomainsQuery, TokenBalancesForDomainsQueryVariables>;
export const ColonyProfileDocument = gql`
    query ColonyProfile($address: String!) {
  colony(address: $address) {
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
export function useColonyProfileQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ColonyProfileQuery, ColonyProfileQueryVariables>) {
        return ApolloReactHooks.useQuery<ColonyProfileQuery, ColonyProfileQueryVariables>(ColonyProfileDocument, baseOptions);
      }
export function useColonyProfileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ColonyProfileQuery, ColonyProfileQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ColonyProfileQuery, ColonyProfileQueryVariables>(ColonyProfileDocument, baseOptions);
        }
export type ColonyProfileQueryHookResult = ReturnType<typeof useColonyProfileQuery>;
export type ColonyProfileLazyQueryHookResult = ReturnType<typeof useColonyProfileLazyQuery>;
export type ColonyProfileQueryResult = ApolloReactCommon.QueryResult<ColonyProfileQuery, ColonyProfileQueryVariables>;
export const UserColonyIdsDocument = gql`
    query UserColonyIds($address: String!) {
  user(address: $address) {
    id
    colonies {
      id
    }
  }
}
    `;

/**
 * __useUserColonyIdsQuery__
 *
 * To run a query within a React component, call `useUserColonyIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserColonyIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserColonyIdsQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useUserColonyIdsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserColonyIdsQuery, UserColonyIdsQueryVariables>) {
        return ApolloReactHooks.useQuery<UserColonyIdsQuery, UserColonyIdsQueryVariables>(UserColonyIdsDocument, baseOptions);
      }
export function useUserColonyIdsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserColonyIdsQuery, UserColonyIdsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UserColonyIdsQuery, UserColonyIdsQueryVariables>(UserColonyIdsDocument, baseOptions);
        }
export type UserColonyIdsQueryHookResult = ReturnType<typeof useUserColonyIdsQuery>;
export type UserColonyIdsLazyQueryHookResult = ReturnType<typeof useUserColonyIdsLazyQuery>;
export type UserColonyIdsQueryResult = ApolloReactCommon.QueryResult<UserColonyIdsQuery, UserColonyIdsQueryVariables>;
export const ColonyTasksDocument = gql`
    query ColonyTasks($address: String!) {
  colony(address: $address) {
    id
    tasks {
      id
      assignedWorker {
        id
        profile {
          avatarHash
        }
      }
      assignedWorkerAddress
      cancelledAt
      colony {
        id
        colonyName
        displayName
        nativeTokenAddress
      }
      payouts {
        amount
        token {
          id
          address
        }
      }
      colonyAddress
      createdAt
      creatorAddress
      dueDate
      ethDomainId
      ethSkillId
      finalizedAt
      title
      workRequestAddresses
    }
  }
}
    `;

/**
 * __useColonyTasksQuery__
 *
 * To run a query within a React component, call `useColonyTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyTasksQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useColonyTasksQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ColonyTasksQuery, ColonyTasksQueryVariables>) {
        return ApolloReactHooks.useQuery<ColonyTasksQuery, ColonyTasksQueryVariables>(ColonyTasksDocument, baseOptions);
      }
export function useColonyTasksLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ColonyTasksQuery, ColonyTasksQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ColonyTasksQuery, ColonyTasksQueryVariables>(ColonyTasksDocument, baseOptions);
        }
export type ColonyTasksQueryHookResult = ReturnType<typeof useColonyTasksQuery>;
export type ColonyTasksLazyQueryHookResult = ReturnType<typeof useColonyTasksLazyQuery>;
export type ColonyTasksQueryResult = ApolloReactCommon.QueryResult<ColonyTasksQuery, ColonyTasksQueryVariables>;
export const ColonySubscribedUsersDocument = gql`
    query ColonySubscribedUsers($colonyAddress: String!) {
  colony(address: $colonyAddress) {
    id
    subscribedUsers {
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
export function useColonySubscribedUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ColonySubscribedUsersQuery, ColonySubscribedUsersQueryVariables>) {
        return ApolloReactHooks.useQuery<ColonySubscribedUsersQuery, ColonySubscribedUsersQueryVariables>(ColonySubscribedUsersDocument, baseOptions);
      }
export function useColonySubscribedUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ColonySubscribedUsersQuery, ColonySubscribedUsersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ColonySubscribedUsersQuery, ColonySubscribedUsersQueryVariables>(ColonySubscribedUsersDocument, baseOptions);
        }
export type ColonySubscribedUsersQueryHookResult = ReturnType<typeof useColonySubscribedUsersQuery>;
export type ColonySubscribedUsersLazyQueryHookResult = ReturnType<typeof useColonySubscribedUsersLazyQuery>;
export type ColonySubscribedUsersQueryResult = ApolloReactCommon.QueryResult<ColonySubscribedUsersQuery, ColonySubscribedUsersQueryVariables>;
export const DomainDocument = gql`
    query Domain($colonyAddress: String!, $ethDomainId: Int!) {
  domain(colonyAddress: $colonyAddress, ethDomainId: $ethDomainId) {
    id
    ethDomainId
    name
    ethParentDomainId
  }
}
    `;

/**
 * __useDomainQuery__
 *
 * To run a query within a React component, call `useDomainQuery` and pass it any options that fit your needs.
 * When your component renders, `useDomainQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDomainQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      ethDomainId: // value for 'ethDomainId'
 *   },
 * });
 */
export function useDomainQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<DomainQuery, DomainQueryVariables>) {
        return ApolloReactHooks.useQuery<DomainQuery, DomainQueryVariables>(DomainDocument, baseOptions);
      }
export function useDomainLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DomainQuery, DomainQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<DomainQuery, DomainQueryVariables>(DomainDocument, baseOptions);
        }
export type DomainQueryHookResult = ReturnType<typeof useDomainQuery>;
export type DomainLazyQueryHookResult = ReturnType<typeof useDomainLazyQuery>;
export type DomainQueryResult = ApolloReactCommon.QueryResult<DomainQuery, DomainQueryVariables>;
export const TokenDocument = gql`
    query Token($address: String!) {
  token(address: $address) {
    id
    address
    iconHash
    details @client {
      decimals
      name
      symbol
    }
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
export function useTokenQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TokenQuery, TokenQueryVariables>) {
        return ApolloReactHooks.useQuery<TokenQuery, TokenQueryVariables>(TokenDocument, baseOptions);
      }
export function useTokenLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TokenQuery, TokenQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<TokenQuery, TokenQueryVariables>(TokenDocument, baseOptions);
        }
export type TokenQueryHookResult = ReturnType<typeof useTokenQuery>;
export type TokenLazyQueryHookResult = ReturnType<typeof useTokenLazyQuery>;
export type TokenQueryResult = ApolloReactCommon.QueryResult<TokenQuery, TokenQueryVariables>;
export const TokenInfoDocument = gql`
    query TokenInfo($address: String!) {
  token(address: $address) {
    info {
      decimals
      name
      symbol
    }
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
export function useTokenInfoQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TokenInfoQuery, TokenInfoQueryVariables>) {
        return ApolloReactHooks.useQuery<TokenInfoQuery, TokenInfoQueryVariables>(TokenInfoDocument, baseOptions);
      }
export function useTokenInfoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TokenInfoQuery, TokenInfoQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<TokenInfoQuery, TokenInfoQueryVariables>(TokenInfoDocument, baseOptions);
        }
export type TokenInfoQueryHookResult = ReturnType<typeof useTokenInfoQuery>;
export type TokenInfoLazyQueryHookResult = ReturnType<typeof useTokenInfoLazyQuery>;
export type TokenInfoQueryResult = ApolloReactCommon.QueryResult<TokenInfoQuery, TokenInfoQueryVariables>;
export const ColonyDomainsDocument = gql`
    query ColonyDomains($colonyAddress: String!) {
  colony(address: $colonyAddress) {
    id
    domains {
      id
      ethDomainId
      name
      ethParentDomainId
    }
  }
}
    `;

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
export function useColonyDomainsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ColonyDomainsQuery, ColonyDomainsQueryVariables>) {
        return ApolloReactHooks.useQuery<ColonyDomainsQuery, ColonyDomainsQueryVariables>(ColonyDomainsDocument, baseOptions);
      }
export function useColonyDomainsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ColonyDomainsQuery, ColonyDomainsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ColonyDomainsQuery, ColonyDomainsQueryVariables>(ColonyDomainsDocument, baseOptions);
        }
export type ColonyDomainsQueryHookResult = ReturnType<typeof useColonyDomainsQuery>;
export type ColonyDomainsLazyQueryHookResult = ReturnType<typeof useColonyDomainsLazyQuery>;
export type ColonyDomainsQueryResult = ApolloReactCommon.QueryResult<ColonyDomainsQuery, ColonyDomainsQueryVariables>;
export const AllTokensDocument = gql`
    query AllTokens {
  allTokens {
    id
    address
    iconHash
    details: info {
      name
      symbol
      decimals
    }
  }
}
    `;

/**
 * __useAllTokensQuery__
 *
 * To run a query within a React component, call `useAllTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllTokensQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllTokensQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AllTokensQuery, AllTokensQueryVariables>) {
        return ApolloReactHooks.useQuery<AllTokensQuery, AllTokensQueryVariables>(AllTokensDocument, baseOptions);
      }
export function useAllTokensLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AllTokensQuery, AllTokensQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<AllTokensQuery, AllTokensQueryVariables>(AllTokensDocument, baseOptions);
        }
export type AllTokensQueryHookResult = ReturnType<typeof useAllTokensQuery>;
export type AllTokensLazyQueryHookResult = ReturnType<typeof useAllTokensLazyQuery>;
export type AllTokensQueryResult = ApolloReactCommon.QueryResult<AllTokensQuery, AllTokensQueryVariables>;
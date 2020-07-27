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
            "name": "AcceptLevelTaskSubmissionEvent"
          },
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
            "name": "CreateLevelTaskSubmissionEvent"
          },
          {
            "name": "CreateWorkRequestEvent"
          },
          {
            "name": "EnrollUserInProgramEvent"
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
            "name": "UnlockNextLevelEvent"
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

export type Colony = {
  avatarHash?: Maybe<Scalars['String']>;
  canMintNativeToken: Scalars['Boolean'];
  canUnlockNativeToken: Scalars['Boolean'];
  colonyAddress: Scalars['String'];
  colonyName: Scalars['String'];
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  domains: Array<Domain>;
  founder?: Maybe<User>;
  founderAddress: Scalars['String'];
  guideline?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isInRecoveryMode: Scalars['Boolean'];
  isNativeTokenExternal: Scalars['Boolean'];
  isNativeTokenLocked: Scalars['Boolean'];
  nativeToken: Token;
  nativeTokenAddress: Scalars['String'];
  programs: Array<Program>;
  roles: Array<UserRoles>;
  subscribedUsers: Array<User>;
  suggestions: Array<Suggestion>;
  taskIds: Array<Scalars['String']>;
  tasks: Array<Task>;
  tokenAddresses: Array<Scalars['String']>;
  tokens: Array<Token>;
  transfers: Array<Transfer>;
  unclaimedTransfers: Array<Transfer>;
  version: Scalars['Int'];
  website?: Maybe<Scalars['String']>;
};


export type ColonyTokensArgs = {
  addresses?: Maybe<Array<Scalars['String']>>;
};

export type Domain = {
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  colonyAddress: Scalars['String'];
  ethDomainId: Scalars['Int'];
  ethParentDomainId?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  colony?: Maybe<Colony>;
  parent?: Maybe<Domain>;
  tasks: Array<Task>;
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

export type AcceptLevelTaskSubmissionEvent = {
  type: EventType;
  acceptedBy: Scalars['String'];
  levelId: Scalars['String'];
  payouts: Array<TaskPayout>;
  persistentTaskId: Scalars['String'];
  programId: Scalars['String'];
  submissionId: Scalars['String'];
};

export type CreateLevelTaskSubmissionEvent = {
  type: EventType;
  programId: Scalars['String'];
  persistentTaskId: Scalars['String'];
  levelId: Scalars['String'];
  submissionId: Scalars['String'];
};

export type EnrollUserInProgramEvent = {
  type: EventType;
  programId: Scalars['String'];
};

export type UnlockNextLevelEvent = {
  type: EventType;
  levelId: Scalars['String'];
  nextLevelId?: Maybe<Scalars['String']>;
  persistentTaskId: Scalars['String'];
  programId: Scalars['String'];
  submissionId: Scalars['String'];
};

export type EventContext = AcceptLevelTaskSubmissionEvent | AssignWorkerEvent | CancelTaskEvent | CreateDomainEvent | CreateTaskEvent | CreateLevelTaskSubmissionEvent | CreateWorkRequestEvent | EnrollUserInProgramEvent | FinalizeTaskEvent | NewUserEvent | RemoveTaskPayoutEvent | SendWorkInviteEvent | SetTaskDescriptionEvent | SetTaskDomainEvent | SetTaskDueDateEvent | SetTaskPayoutEvent | SetTaskPendingEvent | SetTaskSkillEvent | RemoveTaskSkillEvent | SetTaskTitleEvent | TaskMessageEvent | UnassignWorkerEvent | UnlockNextLevelEvent;

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

export enum LevelStatus {
  Active = 'Active',
  Deleted = 'Deleted'
}

export type Level = {
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  creatorAddress: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  achievement?: Maybe<Scalars['String']>;
  numRequiredSteps?: Maybe<Scalars['Int']>;
  programId: Scalars['String'];
  program: Program;
  stepIds: Array<Scalars['String']>;
  steps: Array<PersistentTask>;
  status: LevelStatus;
  unlocked: Scalars['Boolean'];
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

export type CreateColonyInput = {
  colonyAddress: Scalars['String'];
  colonyName: Scalars['String'];
  displayName: Scalars['String'];
  tokenAddress: Scalars['String'];
  tokenName: Scalars['String'];
  tokenSymbol: Scalars['String'];
  tokenDecimals: Scalars['Int'];
  tokenIsExternal: Scalars['Boolean'];
  tokenIconHash?: Maybe<Scalars['String']>;
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

export type EditColonyProfileInput = {
  colonyAddress: Scalars['String'];
  avatarHash?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  guideline?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
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

export type CreateDomainInput = {
  colonyAddress: Scalars['String'];
  ethDomainId: Scalars['Int'];
  ethParentDomainId?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
};

export type EditDomainNameInput = {
  colonyAddress: Scalars['String'];
  ethDomainId: Scalars['Int'];
  name: Scalars['String'];
};

export type SetColonyTokensInput = {
  tokenAddresses: Array<Maybe<Scalars['String']>>;
  colonyAddress: Scalars['String'];
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

export type CreateLevelTaskSubmissionInput = {
  levelId: Scalars['String'];
  persistentTaskId: Scalars['String'];
  submission: Scalars['String'];
};

export type EditSubmissionInput = {
  id: Scalars['String'];
  submission: Scalars['String'];
};

export type AcceptLevelTaskSubmissionInput = {
  levelId: Scalars['String'];
  submissionId: Scalars['String'];
};

export type CreateLevelTaskInput = {
  levelId: Scalars['String'];
};

export type RemoveLevelTaskInput = {
  id: Scalars['String'];
  levelId: Scalars['String'];
};

export type Payout = {
  amount: Scalars['String'];
  tokenAddress: Scalars['String'];
};

export type EditPersistentTaskInput = {
  id: Scalars['String'];
  ethDomainId?: Maybe<Scalars['Int']>;
  ethSkillId?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  payouts?: Maybe<Array<Payout>>;
};

export type CreateLevelInput = {
  programId: Scalars['String'];
};

export type EditLevelInput = {
  id: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  achievement?: Maybe<Scalars['String']>;
  numRequiredSteps?: Maybe<Scalars['Int']>;
};

export type ReorderLevelStepsInput = {
  id: Scalars['String'];
  stepIds: Array<Scalars['String']>;
};

export type RemoveLevelInput = {
  id: Scalars['String'];
};

export type CreateProgramInput = {
  colonyAddress: Scalars['String'];
};

export type EnrollInProgramInput = {
  id: Scalars['String'];
};

export type EditProgramInput = {
  id: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type ReorderProgramLevelsInput = {
  id: Scalars['String'];
  levelIds: Array<Scalars['String']>;
};

export type PublishProgramInput = {
  id: Scalars['String'];
};

export type RemoveProgramInput = {
  id: Scalars['String'];
};

export type Mutation = {
  acceptLevelTaskSubmission?: Maybe<Submission>;
  addUpvoteToSuggestion?: Maybe<Suggestion>;
  assignWorker?: Maybe<Task>;
  cancelTask?: Maybe<Task>;
  clearLoggedInUser: LoggedInUser;
  createColony?: Maybe<Colony>;
  createDomain?: Maybe<Domain>;
  createLevel?: Maybe<Level>;
  createLevelTask?: Maybe<PersistentTask>;
  createLevelTaskSubmission?: Maybe<Submission>;
  createProgram?: Maybe<Program>;
  createSuggestion?: Maybe<Suggestion>;
  createTask?: Maybe<Task>;
  createTaskFromSuggestion?: Maybe<Task>;
  createUser?: Maybe<User>;
  createWorkRequest?: Maybe<Task>;
  editColonyProfile?: Maybe<Colony>;
  editDomainName?: Maybe<Domain>;
  editLevel?: Maybe<Level>;
  editPersistentTask?: Maybe<PersistentTask>;
  editProgram?: Maybe<Program>;
  editSubmission?: Maybe<Submission>;
  editUser?: Maybe<User>;
  enrollInProgram?: Maybe<Program>;
  finalizeTask?: Maybe<Task>;
  markAllNotificationsAsRead: Scalars['Boolean'];
  markNotificationAsRead: Scalars['Boolean'];
  publishProgram?: Maybe<Program>;
  removeLevel?: Maybe<Level>;
  removeLevelTask?: Maybe<PersistentTask>;
  removeProgram?: Maybe<Program>;
  removeTaskPayout?: Maybe<Task>;
  removeTaskSkill?: Maybe<Task>;
  removeUpvoteFromSuggestion?: Maybe<Suggestion>;
  reorderLevelSteps?: Maybe<Level>;
  reorderProgramLevels?: Maybe<Program>;
  sendTaskMessage: Scalars['Boolean'];
  sendWorkInvite?: Maybe<Task>;
  setColonyTokens?: Maybe<Colony>;
  setLoggedInUser: LoggedInUser;
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
};


export type MutationAcceptLevelTaskSubmissionArgs = {
  input: AcceptLevelTaskSubmissionInput;
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


export type MutationCreateColonyArgs = {
  input: CreateColonyInput;
};


export type MutationCreateDomainArgs = {
  input: CreateDomainInput;
};


export type MutationCreateLevelArgs = {
  input: CreateLevelInput;
};


export type MutationCreateLevelTaskArgs = {
  input: CreateLevelTaskInput;
};


export type MutationCreateLevelTaskSubmissionArgs = {
  input: CreateLevelTaskSubmissionInput;
};


export type MutationCreateProgramArgs = {
  input: CreateProgramInput;
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


export type MutationEditColonyProfileArgs = {
  input: EditColonyProfileInput;
};


export type MutationEditDomainNameArgs = {
  input: EditDomainNameInput;
};


export type MutationEditLevelArgs = {
  input: EditLevelInput;
};


export type MutationEditPersistentTaskArgs = {
  input: EditPersistentTaskInput;
};


export type MutationEditProgramArgs = {
  input: EditProgramInput;
};


export type MutationEditSubmissionArgs = {
  input: EditSubmissionInput;
};


export type MutationEditUserArgs = {
  input: EditUserInput;
};


export type MutationEnrollInProgramArgs = {
  input: EnrollInProgramInput;
};


export type MutationFinalizeTaskArgs = {
  input: FinalizeTaskInput;
};


export type MutationMarkNotificationAsReadArgs = {
  input: MarkNotificationAsReadInput;
};


export type MutationPublishProgramArgs = {
  input: PublishProgramInput;
};


export type MutationRemoveLevelArgs = {
  input: RemoveLevelInput;
};


export type MutationRemoveLevelTaskArgs = {
  input: RemoveLevelTaskInput;
};


export type MutationRemoveProgramArgs = {
  input: RemoveProgramInput;
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


export type MutationReorderLevelStepsArgs = {
  input: ReorderLevelStepsInput;
};


export type MutationReorderProgramLevelsArgs = {
  input: ReorderProgramLevelsInput;
};


export type MutationSendTaskMessageArgs = {
  input: SendTaskMessageInput;
};


export type MutationSendWorkInviteArgs = {
  input: SendWorkInviteInput;
};


export type MutationSetColonyTokensArgs = {
  input: SetColonyTokensInput;
};


export type MutationSetLoggedInUserArgs = {
  input?: Maybe<LoggedInUserInput>;
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

export enum PersistentTaskStatus {
  Active = 'Active',
  Closed = 'Closed',
  Deleted = 'Deleted'
}

export type PersistentTask = {
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  colonyAddress: Scalars['String'];
  creatorAddress: Scalars['String'];
  ethDomainId?: Maybe<Scalars['Int']>;
  domain?: Maybe<Domain>;
  ethSkillId?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  payouts: Array<TaskPayout>;
  submissions: Array<Submission>;
  status: PersistentTaskStatus;
  currentUserSubmission?: Maybe<Submission>;
};

export enum ProgramStatus {
  Draft = 'Draft',
  Active = 'Active',
  Deleted = 'Deleted'
}

export type Program = {
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  creatorAddress: Scalars['String'];
  colonyAddress: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  levelIds: Array<Scalars['String']>;
  levels: Array<Level>;
  enrolledUserAddresses: Array<Scalars['String']>;
  enrolled: Scalars['Boolean'];
  status: ProgramStatus;
  submissions: Array<ProgramSubmission>;
};

export type Query = {
  colony: Colony;
  colonyAddress: Scalars['String'];
  colonyName: Scalars['String'];
  domain: Domain;
  level: Level;
  loggedInUser: LoggedInUser;
  program: Program;
  systemInfo: SystemInfo;
  task: Task;
  token: Token;
  tokenInfo: TokenInfo;
  tokens: Array<Token>;
  user: User;
  userAddress: Scalars['String'];
  userReputation: Scalars['String'];
  username: Scalars['String'];
};


export type QueryColonyArgs = {
  address: Scalars['String'];
};


export type QueryColonyAddressArgs = {
  name: Scalars['String'];
};


export type QueryColonyNameArgs = {
  address: Scalars['String'];
};


export type QueryDomainArgs = {
  colonyAddress: Scalars['String'];
  ethDomainId: Scalars['Int'];
};


export type QueryLevelArgs = {
  id: Scalars['String'];
};


export type QueryProgramArgs = {
  id: Scalars['String'];
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

export enum SubmissionStatus {
  Open = 'Open',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Deleted = 'Deleted'
}

export type Submission = {
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  creatorAddress: Scalars['String'];
  creator: User;
  persistentTaskId: Scalars['String'];
  submission: Scalars['String'];
  status: SubmissionStatus;
  statusChangedAt?: Maybe<Scalars['DateTime']>;
  task: PersistentTask;
};

export type ProgramSubmission = {
  id: Scalars['String'];
  levelId: Scalars['String'];
  level: Level;
  submission: Submission;
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
  colony: Colony;
  colonyAddress: Scalars['String'];
  commentCount: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  creator: User;
  creatorAddress: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  domain: Domain;
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
  colonies: Array<Colony>;
  colonyAddresses: Array<Scalars['String']>;
  completedLevels: Array<Level>;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  notifications: Array<Notification>;
  profile: UserProfile;
  reputation: Scalars['String'];
  taskIds: Array<Scalars['String']>;
  tasks: Array<Task>;
  tokenAddresses: Array<Scalars['String']>;
  tokenTransfers: Array<Transfer>;
  tokens: Array<Token>;
};


export type UserCompletedLevelsArgs = {
  colonyAddress: Scalars['String'];
};


export type UserNotificationsArgs = {
  read?: Maybe<Scalars['Boolean']>;
};


export type UserReputationArgs = {
  colonyAddress: Scalars['String'];
  domainId?: Maybe<Scalars['Int']>;
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
  AcceptLevelTaskSubmission = 'AcceptLevelTaskSubmission',
  AssignWorker = 'AssignWorker',
  CancelTask = 'CancelTask',
  CreateDomain = 'CreateDomain',
  CreateLevelTaskSubmission = 'CreateLevelTaskSubmission',
  CreateTask = 'CreateTask',
  CreateWorkRequest = 'CreateWorkRequest',
  EnrollUserInProgram = 'EnrollUserInProgram',
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
  UnlockNextLevel = 'UnlockNextLevel'
}

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type LoggedInUserInput = {
  balance?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  walletAddress?: Maybe<Scalars['String']>;
  ethereal?: Maybe<Scalars['Boolean']>;
};

export type LoggedInUser = {
  id: Scalars['String'];
  balance: Scalars['String'];
  username?: Maybe<Scalars['String']>;
  walletAddress: Scalars['String'];
  ethereal: Scalars['Boolean'];
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


export type TokenBalanceArgs = {
  walletAddress: Scalars['String'];
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

export type PayoutsFragment = { payouts: Array<(
    Pick<TaskPayout, 'amount' | 'tokenAddress'>
    & { token: Pick<Token, 'id' | 'address' | 'decimals' | 'name' | 'symbol'> }
  )> };

export type PersistentTaskPayoutsFragment = { payouts: Array<(
    Pick<TaskPayout, 'amount' | 'tokenAddress'>
    & { token: Pick<Token, 'id' | 'address' | 'decimals' | 'name' | 'symbol'> }
  )> };

export type CreateTaskFieldsFragment = (
  Pick<Task, 'id' | 'assignedWorkerAddress' | 'cancelledAt' | 'colonyAddress' | 'commentCount' | 'createdAt' | 'creatorAddress' | 'dueDate' | 'ethDomainId' | 'ethSkillId' | 'finalizedAt' | 'title' | 'workRequestAddresses' | 'txHash'>
  & { assignedWorker?: Maybe<(
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'avatarHash'> }
  )>, colony: Pick<Colony, 'id' | 'colonyName' | 'displayName' | 'nativeTokenAddress'>, events: Array<Pick<Event, 'id' | 'type'>> }
  & PayoutsFragment
);

export type TokensFragment = (
  Pick<Colony, 'nativeTokenAddress' | 'tokenAddresses'>
  & { tokens: Array<(
    Pick<Token, 'id' | 'address' | 'iconHash' | 'decimals' | 'name' | 'symbol'>
    & { balances: Array<Pick<DomainBalance, 'domainId' | 'amount'>> }
  )> }
);

export type ColonyProfileFragment = Pick<Colony, 'id' | 'colonyAddress' | 'colonyName' | 'avatarHash' | 'description' | 'displayName' | 'guideline' | 'website'>;

export type DomainFieldsFragment = Pick<Domain, 'id' | 'ethDomainId' | 'name' | 'ethParentDomainId'>;

export type FullColonyFragment = (
  Pick<Colony, 'isNativeTokenExternal' | 'version' | 'canMintNativeToken' | 'canUnlockNativeToken' | 'isInRecoveryMode' | 'isNativeTokenLocked'>
  & { domains: Array<DomainFieldsFragment>, roles: Array<(
    Pick<UserRoles, 'address'>
    & { domains: Array<Pick<DomainRoles, 'domainId' | 'roles'>> }
  )> }
  & ColonyProfileFragment
  & TokensFragment
);

export type SuggestionFieldsFragment = (
  Pick<Suggestion, 'id' | 'createdAt' | 'colonyAddress' | 'creatorAddress' | 'ethDomainId' | 'status' | 'title' | 'taskId' | 'upvotes'>
  & { creator: (
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'displayName' | 'username' | 'walletAddress'> }
  ) }
);

export type ProgramFieldsFragment = (
  Pick<Program, 'id' | 'createdAt' | 'creatorAddress' | 'colonyAddress' | 'description' | 'enrolled' | 'enrolledUserAddresses' | 'levelIds' | 'status' | 'title'>
  & { levels: Array<(
    Pick<Level, 'id' | 'achievement' | 'description' | 'numRequiredSteps' | 'programId' | 'stepIds' | 'status' | 'title'>
    & { steps: Array<PersistentTaskFieldsFragment> }
  )> }
);

export type LevelFieldsFragment = (
  Pick<Level, 'id' | 'achievement' | 'createdAt' | 'creatorAddress' | 'description' | 'numRequiredSteps' | 'programId' | 'status' | 'stepIds' | 'title'>
  & { steps: Array<PersistentTaskFieldsFragment> }
);

export type ProgramSubmissionFieldsFragment = (
  Pick<ProgramSubmission, 'id'>
  & { level: Pick<Level, 'id' | 'title'>, submission: (
    Pick<Submission, 'id' | 'createdAt' | 'status' | 'statusChangedAt' | 'submission'>
    & { creator: (
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    ), task: (
      Pick<PersistentTask, 'id' | 'colonyAddress' | 'description' | 'ethSkillId' | 'title'>
      & { domain?: Maybe<Pick<Domain, 'id' | 'ethDomainId' | 'name'>> }
      & PersistentTaskPayoutsFragment
    ) }
  ) }
);

export type SubmissionFieldsFragment = (
  Pick<Submission, 'id' | 'createdAt' | 'status' | 'statusChangedAt' | 'submission'>
  & { task: Pick<PersistentTask, 'id'> }
);

export type PersistentTaskFieldsFragment = (
  Pick<PersistentTask, 'id' | 'colonyAddress' | 'createdAt' | 'creatorAddress' | 'description' | 'ethDomainId' | 'ethSkillId' | 'status' | 'title'>
  & { currentUserSubmission?: Maybe<SubmissionFieldsFragment>, submissions: Array<SubmissionFieldsFragment> }
  & PersistentTaskPayoutsFragment
);

export type EventFieldsFragment = (
  Pick<Event, 'createdAt' | 'initiatorAddress' | 'sourceId' | 'sourceType' | 'type'>
  & { initiator?: Maybe<(
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
  )> }
);

export type EventContextFragment = { context: (
    Pick<AcceptLevelTaskSubmissionEvent, 'acceptedBy' | 'levelId' | 'persistentTaskId' | 'programId' | 'submissionId' | 'type'>
    & { payouts: Array<(
      Pick<TaskPayout, 'amount' | 'tokenAddress'>
      & { token: Pick<Token, 'id' | 'address' | 'decimals' | 'name' | 'symbol'> }
    )> }
  ) | Pick<AssignWorkerEvent, 'taskId' | 'type' | 'workerAddress' | 'colonyAddress'> | Pick<CancelTaskEvent, 'taskId' | 'type' | 'colonyAddress'> | Pick<CreateDomainEvent, 'type' | 'ethDomainId' | 'colonyAddress'> | Pick<CreateTaskEvent, 'colonyAddress' | 'ethDomainId' | 'taskId' | 'type'> | Pick<CreateLevelTaskSubmissionEvent, 'levelId' | 'persistentTaskId' | 'programId' | 'submissionId' | 'type'> | Pick<CreateWorkRequestEvent, 'taskId' | 'type' | 'colonyAddress'> | Pick<EnrollUserInProgramEvent, 'programId' | 'type'> | Pick<FinalizeTaskEvent, 'taskId' | 'type' | 'colonyAddress'> | Pick<RemoveTaskPayoutEvent, 'amount' | 'taskId' | 'tokenAddress' | 'type' | 'colonyAddress'> | Pick<SendWorkInviteEvent, 'taskId' | 'type' | 'workerAddress' | 'colonyAddress'> | Pick<SetTaskDescriptionEvent, 'description' | 'taskId' | 'type' | 'colonyAddress'> | Pick<SetTaskDomainEvent, 'ethDomainId' | 'taskId' | 'type' | 'colonyAddress'> | Pick<SetTaskDueDateEvent, 'dueDate' | 'taskId' | 'type' | 'colonyAddress'> | Pick<SetTaskPayoutEvent, 'amount' | 'taskId' | 'tokenAddress' | 'type' | 'colonyAddress'> | Pick<SetTaskPendingEvent, 'taskId' | 'type' | 'colonyAddress' | 'txHash'> | Pick<SetTaskSkillEvent, 'ethSkillId' | 'taskId' | 'type' | 'colonyAddress'> | Pick<RemoveTaskSkillEvent, 'ethSkillId' | 'taskId' | 'type' | 'colonyAddress'> | Pick<SetTaskTitleEvent, 'taskId' | 'title' | 'type' | 'colonyAddress'> | Pick<TaskMessageEvent, 'colonyAddress' | 'message' | 'taskId' | 'type'> | Pick<UnassignWorkerEvent, 'taskId' | 'type' | 'workerAddress' | 'colonyAddress'> | Pick<UnlockNextLevelEvent, 'levelId' | 'nextLevelId' | 'persistentTaskId' | 'programId' | 'submissionId' | 'type'> };

export type TaskEventFragment = (
  EventFieldsFragment
  & EventContextFragment
);

export type AssignWorkerMutationVariables = {
  input: AssignWorkerInput;
};


export type AssignWorkerMutation = { assignWorker?: Maybe<(
    Pick<Task, 'id' | 'assignedWorkerAddress'>
    & { assignedWorker?: Maybe<Pick<User, 'id'>>, events: Array<TaskEventFragment> }
  )> };

export type CancelTaskMutationVariables = {
  input: TaskIdInput;
};


export type CancelTaskMutation = { cancelTask?: Maybe<(
    Pick<Task, 'id' | 'cancelledAt'>
    & { events: Array<TaskEventFragment> }
  )> };

export type CreateTaskMutationVariables = {
  input: CreateTaskInput;
};


export type CreateTaskMutation = { createTask?: Maybe<CreateTaskFieldsFragment> };

export type CreateWorkRequestMutationVariables = {
  input: CreateWorkRequestInput;
};


export type CreateWorkRequestMutation = { createWorkRequest?: Maybe<(
    Pick<Task, 'id' | 'workRequestAddresses'>
    & { events: Array<TaskEventFragment>, workRequests: Array<Pick<User, 'id'>> }
  )> };

export type FinalizeTaskMutationVariables = {
  input: FinalizeTaskInput;
};


export type FinalizeTaskMutation = { finalizeTask?: Maybe<(
    Pick<Task, 'id' | 'colonyAddress' | 'ethPotId' | 'finalizedAt'>
    & { events: Array<TaskEventFragment>, finalizedPayment?: Maybe<Pick<TaskFinalizedPayment, 'amount' | 'tokenAddress' | 'workerAddress' | 'transactionHash'>> }
  )> };

export type RemoveTaskPayoutMutationVariables = {
  input: RemoveTaskPayoutInput;
};


export type RemoveTaskPayoutMutation = { removeTaskPayout?: Maybe<(
    Pick<Task, 'id'>
    & { events: Array<TaskEventFragment> }
    & PayoutsFragment
  )> };

export type SendWorkInviteMutationVariables = {
  input: SendWorkInviteInput;
};


export type SendWorkInviteMutation = { sendWorkInvite?: Maybe<(
    Pick<Task, 'id' | 'workInviteAddresses'>
    & { events: Array<TaskEventFragment>, workInvites: Array<Pick<User, 'id'>> }
  )> };

export type SetTaskDomainMutationVariables = {
  input: SetTaskDomainInput;
};


export type SetTaskDomainMutation = { setTaskDomain?: Maybe<(
    Pick<Task, 'id' | 'ethDomainId'>
    & { events: Array<TaskEventFragment> }
  )> };

export type SetTaskDescriptionMutationVariables = {
  input: SetTaskDescriptionInput;
};


export type SetTaskDescriptionMutation = { setTaskDescription?: Maybe<(
    Pick<Task, 'id' | 'description'>
    & { events: Array<TaskEventFragment> }
  )> };

export type SetTaskDueDateMutationVariables = {
  input: SetTaskDueDateInput;
};


export type SetTaskDueDateMutation = { setTaskDueDate?: Maybe<(
    Pick<Task, 'id' | 'dueDate'>
    & { events: Array<TaskEventFragment> }
  )> };

export type SetTaskPayoutMutationVariables = {
  input: SetTaskPayoutInput;
};


export type SetTaskPayoutMutation = { setTaskPayout?: Maybe<(
    Pick<Task, 'id'>
    & { events: Array<TaskEventFragment>, payouts: Array<(
      Pick<TaskPayout, 'amount' | 'tokenAddress'>
      & { token: Pick<Token, 'id' | 'address'> }
    )> }
  )> };

export type SetTaskSkillMutationVariables = {
  input: SetTaskSkillInput;
};


export type SetTaskSkillMutation = { setTaskSkill?: Maybe<(
    Pick<Task, 'id' | 'ethSkillId'>
    & { events: Array<TaskEventFragment> }
  )> };

export type RemoveTaskSkillMutationVariables = {
  input: RemoveTaskSkillInput;
};


export type RemoveTaskSkillMutation = { removeTaskSkill?: Maybe<(
    Pick<Task, 'id' | 'ethSkillId'>
    & { events: Array<TaskEventFragment> }
  )> };

export type SetTaskTitleMutationVariables = {
  input: SetTaskTitleInput;
};


export type SetTaskTitleMutation = { setTaskTitle?: Maybe<(
    Pick<Task, 'id' | 'title'>
    & { events: Array<TaskEventFragment> }
  )> };

export type UnassignWorkerMutationVariables = {
  input: UnassignWorkerInput;
};


export type UnassignWorkerMutation = { unassignWorker?: Maybe<(
    Pick<Task, 'id' | 'assignedWorkerAddress'>
    & { assignedWorker?: Maybe<Pick<User, 'id'>>, events: Array<TaskEventFragment> }
  )> };

export type SetTaskPendingMutationVariables = {
  input: SetTaskPendingInput;
};


export type SetTaskPendingMutation = { setTaskPending?: Maybe<(
    Pick<Task, 'id'>
    & { events: Array<TaskEventFragment> }
  )> };

export type SendTaskMessageMutationVariables = {
  input: SendTaskMessageInput;
};


export type SendTaskMessageMutation = Pick<Mutation, 'sendTaskMessage'>;

export type SetLoggedInUserMutationVariables = {
  input: LoggedInUserInput;
};


export type SetLoggedInUserMutation = { setLoggedInUser: Pick<LoggedInUser, 'id'> };

export type ClearLoggedInUserMutationVariables = {};


export type ClearLoggedInUserMutation = { clearLoggedInUser: Pick<LoggedInUser, 'id'> };

export type CreateUserMutationVariables = {
  createUserInput: CreateUserInput;
  loggedInUserInput: LoggedInUserInput;
};


export type CreateUserMutation = { createUser?: Maybe<Pick<User, 'id'>>, setLoggedInUser: Pick<LoggedInUser, 'id'> };

export type EditUserMutationVariables = {
  input: EditUserInput;
};


export type EditUserMutation = { editUser?: Maybe<(
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'avatarHash' | 'bio' | 'displayName' | 'location' | 'website'> }
  )> };

export type SetUserTokensMutationVariables = {
  input: SetUserTokensInput;
};


export type SetUserTokensMutation = { setUserTokens?: Maybe<Pick<User, 'id' | 'tokenAddresses'>> };

export type SetColonyTokensMutationVariables = {
  input: SetColonyTokensInput;
};


export type SetColonyTokensMutation = { setColonyTokens?: Maybe<Pick<Colony, 'id' | 'tokenAddresses'>> };

export type CreateColonyMutationVariables = {
  input: CreateColonyInput;
};


export type CreateColonyMutation = { createColony?: Maybe<Pick<Colony, 'id' | 'colonyAddress' | 'colonyName' | 'avatarHash' | 'description' | 'displayName' | 'guideline' | 'website'>> };

export type EditColonyProfileMutationVariables = {
  input: EditColonyProfileInput;
};


export type EditColonyProfileMutation = { editColonyProfile?: Maybe<Pick<Colony, 'id' | 'colonyName' | 'avatarHash' | 'description' | 'displayName' | 'guideline' | 'website'>> };

export type MarkNotificationAsReadMutationVariables = {
  input: MarkNotificationAsReadInput;
};


export type MarkNotificationAsReadMutation = Pick<Mutation, 'markNotificationAsRead'>;

export type MarkAllNotificationsAsReadMutationVariables = {};


export type MarkAllNotificationsAsReadMutation = Pick<Mutation, 'markAllNotificationsAsRead'>;

export type SubscribeToColonyMutationVariables = {
  input: SubscribeToColonyInput;
};


export type SubscribeToColonyMutation = { subscribeToColony?: Maybe<Pick<User, 'id' | 'colonyAddresses'>> };

export type UnsubscribeFromColonyMutationVariables = {
  input: UnsubscribeFromColonyInput;
};


export type UnsubscribeFromColonyMutation = { unsubscribeFromColony?: Maybe<Pick<User, 'id' | 'colonyAddresses'>> };

export type CreateDomainMutationVariables = {
  input: CreateDomainInput;
};


export type CreateDomainMutation = { createDomain?: Maybe<Pick<Domain, 'id' | 'ethDomainId' | 'ethParentDomainId' | 'name'>> };

export type EditDomainMutationVariables = {
  input: EditDomainNameInput;
};


export type EditDomainMutation = { editDomainName?: Maybe<Pick<Domain, 'id' | 'ethDomainId' | 'ethParentDomainId' | 'name'>> };

export type CreateSuggestionMutationVariables = {
  input: CreateSuggestionInput;
};


export type CreateSuggestionMutation = { createSuggestion?: Maybe<SuggestionFieldsFragment> };

export type SetSuggestionStatusMutationVariables = {
  input: SetSuggestionStatusInput;
};


export type SetSuggestionStatusMutation = { setSuggestionStatus?: Maybe<Pick<Suggestion, 'id' | 'status' | 'taskId'>> };

export type AddUpvoteToSuggestionMutationVariables = {
  input: AddUpvoteToSuggestionInput;
};


export type AddUpvoteToSuggestionMutation = { addUpvoteToSuggestion?: Maybe<Pick<Suggestion, 'id' | 'upvotes'>> };

export type RemoveUpvoteFromSuggestionMutationVariables = {
  input: RemoveUpvoteFromSuggestionInput;
};


export type RemoveUpvoteFromSuggestionMutation = { removeUpvoteFromSuggestion?: Maybe<Pick<Suggestion, 'id' | 'upvotes'>> };

export type CreateTaskFromSuggestionMutationVariables = {
  input: CreateTaskFromSuggestionInput;
};


export type CreateTaskFromSuggestionMutation = { createTaskFromSuggestion?: Maybe<CreateTaskFieldsFragment> };

export type CreateProgramMutationVariables = {
  input: CreateProgramInput;
};


export type CreateProgramMutation = { createProgram?: Maybe<ProgramFieldsFragment> };

export type EditProgramMutationVariables = {
  input: EditProgramInput;
};


export type EditProgramMutation = { editProgram?: Maybe<Pick<Program, 'id' | 'description' | 'title'>> };

export type RemoveProgramMutationVariables = {
  input: RemoveProgramInput;
};


export type RemoveProgramMutation = { removeProgram?: Maybe<Pick<Program, 'id' | 'status'>> };

export type PublishProgramMutationVariables = {
  input: PublishProgramInput;
};


export type PublishProgramMutation = { publishProgram?: Maybe<Pick<Program, 'id' | 'status'>> };

export type EnrollInProgramMutationVariables = {
  input: EnrollInProgramInput;
};


export type EnrollInProgramMutation = { enrollInProgram?: Maybe<(
    Pick<Program, 'id' | 'enrolled' | 'enrolledUserAddresses'>
    & { levels: Array<Pick<Level, 'id' | 'unlocked'>> }
  )> };

export type CreateLevelMutationVariables = {
  input: CreateLevelInput;
};


export type CreateLevelMutation = { createLevel?: Maybe<(
    Pick<Level, 'unlocked'>
    & LevelFieldsFragment
  )> };

export type EditLevelMutationVariables = {
  input: EditLevelInput;
};


export type EditLevelMutation = { editLevel?: Maybe<LevelFieldsFragment> };

export type RemoveLevelMutationVariables = {
  input: RemoveLevelInput;
};


export type RemoveLevelMutation = { removeLevel?: Maybe<Pick<Level, 'id' | 'status'>> };

export type ReorderProgramLevelsMutationVariables = {
  input: ReorderProgramLevelsInput;
};


export type ReorderProgramLevelsMutation = { reorderProgramLevels?: Maybe<(
    Pick<Program, 'id' | 'levelIds'>
    & { levels: Array<Pick<Level, 'id'>> }
  )> };

export type CreateLevelTaskMutationVariables = {
  input: CreateLevelTaskInput;
};


export type CreateLevelTaskMutation = { createLevelTask?: Maybe<PersistentTaskFieldsFragment> };

export type RemoveLevelTaskMutationVariables = {
  input: RemoveLevelTaskInput;
};


export type RemoveLevelTaskMutation = { removeLevelTask?: Maybe<Pick<PersistentTask, 'id' | 'status'>> };

export type EditPersistentTaskMutationVariables = {
  input: EditPersistentTaskInput;
};


export type EditPersistentTaskMutation = { editPersistentTask?: Maybe<(
    Pick<PersistentTask, 'id' | 'description' | 'ethDomainId' | 'ethSkillId' | 'title'>
    & PersistentTaskPayoutsFragment
  )> };

export type CreateLevelTaskSubmissionMutationVariables = {
  input: CreateLevelTaskSubmissionInput;
};


export type CreateLevelTaskSubmissionMutation = { createLevelTaskSubmission?: Maybe<Pick<Submission, 'id' | 'status' | 'submission'>> };

export type EditSubmissionMutationVariables = {
  input: EditSubmissionInput;
};


export type EditSubmissionMutation = { editSubmission?: Maybe<Pick<Submission, 'id' | 'status' | 'submission'>> };

export type AcceptLevelTaskSubmissionMutationVariables = {
  input: AcceptLevelTaskSubmissionInput;
};


export type AcceptLevelTaskSubmissionMutation = { acceptLevelTaskSubmission?: Maybe<Pick<Submission, 'id' | 'status'>> };

export type TaskQueryVariables = {
  id: Scalars['String'];
};


export type TaskQuery = { task: (
    Pick<Task, 'id' | 'assignedWorkerAddress' | 'cancelledAt' | 'colonyAddress' | 'commentCount' | 'createdAt' | 'creatorAddress' | 'description' | 'dueDate' | 'ethDomainId' | 'ethSkillId' | 'ethPotId' | 'finalizedAt' | 'title' | 'workInviteAddresses' | 'workRequestAddresses' | 'txHash'>
    & { assignedWorker?: Maybe<(
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    )>, colony: Pick<Colony, 'id' | 'colonyAddress' | 'colonyName' | 'avatarHash' | 'displayName' | 'nativeTokenAddress'>, creator: (
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

export type TaskToEditQueryVariables = {
  id: Scalars['String'];
};


export type TaskToEditQuery = { task: (
    Pick<Task, 'id'>
    & { assignedWorker?: Maybe<(
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    )>, workRequests: Array<(
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    )>, colony: (
      Pick<Colony, 'id' | 'nativeTokenAddress' | 'tokenAddresses'>
      & { subscribedUsers: Array<(
        Pick<User, 'id'>
        & { profile: Pick<UserProfile, 'displayName' | 'walletAddress' | 'username' | 'avatarHash'> }
      )>, tokens: Array<Pick<Token, 'id' | 'address' | 'decimals' | 'name' | 'symbol'>> }
    ) }
    & PayoutsFragment
  ) };

export type TaskFeedEventsQueryVariables = {
  id: Scalars['String'];
};


export type TaskFeedEventsQuery = { task: (
    Pick<Task, 'id' | 'colonyAddress' | 'ethDomainId' | 'ethPotId' | 'finalizedAt' | 'txHash'>
    & { events: Array<TaskEventFragment>, finalizedPayment?: Maybe<Pick<TaskFinalizedPayment, 'amount' | 'tokenAddress' | 'workerAddress' | 'transactionHash'>> }
    & PayoutsFragment
  ) };

export type LoggedInUserQueryVariables = {};


export type LoggedInUserQuery = { loggedInUser: Pick<LoggedInUser, 'walletAddress' | 'balance' | 'username' | 'ethereal'> };

export type UserQueryVariables = {
  address: Scalars['String'];
};


export type UserQuery = { user: (
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'username' | 'walletAddress' | 'displayName' | 'bio' | 'location' | 'website' | 'avatarHash'> }
  ) };

export type UserWithReputationQueryVariables = {
  address: Scalars['String'];
  colonyAddress: Scalars['String'];
  domainId?: Maybe<Scalars['Int']>;
};


export type UserWithReputationQuery = { user: (
    Pick<User, 'id' | 'reputation'>
    & { profile: Pick<UserProfile, 'username' | 'walletAddress' | 'displayName' | 'bio' | 'location' | 'website' | 'avatarHash'> }
  ) };

export type UserReputationQueryVariables = {
  address: Scalars['String'];
  colonyAddress: Scalars['String'];
  domainId?: Maybe<Scalars['Int']>;
};


export type UserReputationQuery = Pick<Query, 'userReputation'>;

export type UserTasksQueryVariables = {
  address: Scalars['String'];
};


export type UserTasksQuery = { user: (
    Pick<User, 'id'>
    & { tasks: Array<(
      Pick<Task, 'id' | 'assignedWorkerAddress' | 'cancelledAt' | 'colonyAddress' | 'commentCount' | 'createdAt' | 'creatorAddress' | 'dueDate' | 'ethDomainId' | 'ethSkillId' | 'finalizedAt' | 'title' | 'workRequestAddresses' | 'txHash'>
      & { assignedWorker?: Maybe<(
        Pick<User, 'id'>
        & { profile: Pick<UserProfile, 'avatarHash'> }
      )>, colony: Pick<Colony, 'id' | 'colonyName' | 'displayName' | 'nativeTokenAddress'>, events: Array<Pick<Event, 'id' | 'type'>> }
      & PayoutsFragment
    )> }
  ) };

export type UserTokensQueryVariables = {
  address: Scalars['String'];
};


export type UserTokensQuery = { user: (
    Pick<User, 'id' | 'tokenAddresses'>
    & { tokens: Array<Pick<Token, 'id' | 'address' | 'iconHash' | 'decimals' | 'name' | 'symbol' | 'balance'>> }
  ) };

export type UsernameQueryVariables = {
  address: Scalars['String'];
};


export type UsernameQuery = Pick<Query, 'username'>;

export type UserAddressQueryVariables = {
  name: Scalars['String'];
};


export type UserAddressQuery = Pick<Query, 'userAddress'>;

export type ColonyFromNameQueryVariables = {
  name: Scalars['String'];
  address: Scalars['String'];
};


export type ColonyFromNameQuery = (
  Pick<Query, 'colonyAddress'>
  & { colony: FullColonyFragment }
);

export type ColonyNameQueryVariables = {
  address: Scalars['String'];
};


export type ColonyNameQuery = Pick<Query, 'colonyName'>;

export type ColonyAddressQueryVariables = {
  name: Scalars['String'];
};


export type ColonyAddressQuery = Pick<Query, 'colonyAddress'>;

export type ColonyQueryVariables = {
  address: Scalars['String'];
};


export type ColonyQuery = { colony: FullColonyFragment };

export type ColonyTokensQueryVariables = {
  address: Scalars['String'];
};


export type ColonyTokensQuery = { colony: (
    Pick<Colony, 'id'>
    & TokensFragment
  ) };

export type ColonyNativeTokenQueryVariables = {
  address: Scalars['String'];
};


export type ColonyNativeTokenQuery = { colony: Pick<Colony, 'id' | 'nativeTokenAddress'> };

export type ColonyRolesQueryVariables = {
  address: Scalars['String'];
};


export type ColonyRolesQuery = { colony: (
    Pick<Colony, 'id' | 'colonyAddress'>
    & { roles: Array<(
      Pick<UserRoles, 'address'>
      & { domains: Array<Pick<DomainRoles, 'domainId' | 'roles'>> }
    )> }
  ) };

export type ColonyTransfersQueryVariables = {
  address: Scalars['String'];
};


export type ColonyTransfersQuery = { colony: (
    Pick<Colony, 'id' | 'colonyAddress'>
    & { transfers: Array<Pick<Transfer, 'amount' | 'hash' | 'colonyAddress' | 'date' | 'from' | 'incoming' | 'to' | 'token'>>, unclaimedTransfers: Array<Pick<Transfer, 'amount' | 'hash' | 'colonyAddress' | 'date' | 'from' | 'incoming' | 'to' | 'token'>> }
  ) };

export type TokenBalancesForDomainsQueryVariables = {
  colonyAddress: Scalars['String'];
  tokenAddresses: Array<Scalars['String']>;
  domainIds?: Maybe<Array<Scalars['Int']>>;
};


export type TokenBalancesForDomainsQuery = { tokens: Array<(
    Pick<Token, 'id' | 'address' | 'iconHash' | 'decimals' | 'name' | 'symbol'>
    & { balances: Array<Pick<DomainBalance, 'domainId' | 'amount'>> }
  )> };

export type ColonyProfileQueryVariables = {
  address: Scalars['String'];
};


export type ColonyProfileQuery = { colony: ColonyProfileFragment };

export type UserColonyAddressesQueryVariables = {
  address: Scalars['String'];
};


export type UserColonyAddressesQuery = { user: Pick<User, 'id' | 'colonyAddresses'> };

export type ColonyTasksQueryVariables = {
  address: Scalars['String'];
};


export type ColonyTasksQuery = { colony: (
    Pick<Colony, 'id'>
    & { tasks: Array<(
      Pick<Task, 'id' | 'assignedWorkerAddress' | 'cancelledAt' | 'colonyAddress' | 'commentCount' | 'createdAt' | 'creatorAddress' | 'dueDate' | 'ethDomainId' | 'ethSkillId' | 'finalizedAt' | 'title' | 'workRequestAddresses' | 'txHash'>
      & { assignedWorker?: Maybe<(
        Pick<User, 'id'>
        & { profile: Pick<UserProfile, 'avatarHash'> }
      )>, colony: Pick<Colony, 'id' | 'colonyName' | 'displayName' | 'nativeTokenAddress'>, events: Array<Pick<Event, 'id' | 'type'>> }
      & PayoutsFragment
    )> }
  ) };

export type ColonyProgramsQueryVariables = {
  address: Scalars['String'];
};


export type ColonyProgramsQuery = { colony: (
    Pick<Colony, 'id'>
    & { programs: Array<ProgramFieldsFragment> }
  ) };

export type ProgramQueryVariables = {
  id: Scalars['String'];
};


export type ProgramQuery = { program: ProgramFieldsFragment };

export type ProgramLevelsQueryVariables = {
  id: Scalars['String'];
};


export type ProgramLevelsQuery = { program: (
    Pick<Program, 'id' | 'levelIds'>
    & { levels: Array<LevelFieldsFragment> }
  ) };

export type LevelQueryVariables = {
  id: Scalars['String'];
};


export type LevelQuery = { level: (
    Pick<Level, 'unlocked'>
    & LevelFieldsFragment
  ) };

export type ProgramLevelsWithUnlockedQueryVariables = {
  id: Scalars['String'];
};


export type ProgramLevelsWithUnlockedQuery = { program: (
    Pick<Program, 'id' | 'levelIds'>
    & { levels: Array<(
      Pick<Level, 'unlocked'>
      & LevelFieldsFragment
    )> }
  ) };

export type ProgramSubmissionsQueryVariables = {
  id: Scalars['String'];
};


export type ProgramSubmissionsQuery = { program: (
    Pick<Program, 'id'>
    & { submissions: Array<ProgramSubmissionFieldsFragment> }
  ) };

export type ColonySubscribedUsersQueryVariables = {
  colonyAddress: Scalars['String'];
};


export type ColonySubscribedUsersQuery = { colony: (
    Pick<Colony, 'id'>
    & { subscribedUsers: Array<(
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    )> }
  ) };

export type DomainQueryVariables = {
  colonyAddress: Scalars['String'];
  ethDomainId: Scalars['Int'];
};


export type DomainQuery = { domain: Pick<Domain, 'id' | 'ethDomainId' | 'name' | 'ethParentDomainId'> };

export type TokenQueryVariables = {
  address: Scalars['String'];
};


export type TokenQuery = { token: Pick<Token, 'id' | 'address' | 'iconHash' | 'decimals' | 'name' | 'symbol'> };

export type TokenInfoQueryVariables = {
  address: Scalars['String'];
};


export type TokenInfoQuery = { tokenInfo: Pick<TokenInfo, 'decimals' | 'name' | 'symbol' | 'iconHash'> };

export type ColonyDomainsQueryVariables = {
  colonyAddress: Scalars['String'];
};


export type ColonyDomainsQuery = { colony: (
    Pick<Colony, 'id'>
    & { domains: Array<Pick<Domain, 'id' | 'ethDomainId' | 'name' | 'ethParentDomainId'>> }
  ) };

export type ColonySuggestionsQueryVariables = {
  colonyAddress: Scalars['String'];
};


export type ColonySuggestionsQuery = { colony: (
    Pick<Colony, 'id'>
    & { suggestions: Array<SuggestionFieldsFragment> }
  ) };

export type UserNotificationsQueryVariables = {
  address: Scalars['String'];
};


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

export type UserBadgesQueryVariables = {
  address: Scalars['String'];
  colonyAddress: Scalars['String'];
};


export type UserBadgesQuery = { user: (
    Pick<User, 'id'>
    & { completedLevels: Array<(
      Pick<Level, 'id' | 'achievement' | 'title'>
      & { program: Pick<Program, 'title'> }
    )> }
  ) };

export type SystemInfoQueryVariables = {};


export type SystemInfoQuery = { systemInfo: Pick<SystemInfo, 'version'> };

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
  colony {
    id
    colonyName
    displayName
    nativeTokenAddress
  }
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
    fragment DomainFields on Domain {
  id
  ethDomainId
  name
  ethParentDomainId
}
    `;
export const FullColonyFragmentDoc = gql`
    fragment FullColony on Colony {
  ...ColonyProfile
  ...Tokens
  isNativeTokenExternal
  domains {
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
}
    ${ColonyProfileFragmentDoc}
${TokensFragmentDoc}
${DomainFieldsFragmentDoc}`;
export const SuggestionFieldsFragmentDoc = gql`
    fragment SuggestionFields on Suggestion {
  id
  createdAt
  colonyAddress
  creatorAddress
  creator {
    id
    profile {
      displayName
      username
      walletAddress
    }
  }
  ethDomainId
  status
  title
  taskId
  upvotes
}
    `;
export const SubmissionFieldsFragmentDoc = gql`
    fragment SubmissionFields on Submission {
  id
  createdAt
  task {
    id
  }
  status
  statusChangedAt
  submission
}
    `;
export const PersistentTaskPayoutsFragmentDoc = gql`
    fragment PersistentTaskPayouts on PersistentTask {
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
export const PersistentTaskFieldsFragmentDoc = gql`
    fragment PersistentTaskFields on PersistentTask {
  id
  colonyAddress
  createdAt
  creatorAddress
  currentUserSubmission {
    ...SubmissionFields
  }
  description
  ethDomainId
  ethSkillId
  ...PersistentTaskPayouts
  status
  submissions {
    ...SubmissionFields
  }
  title
}
    ${SubmissionFieldsFragmentDoc}
${PersistentTaskPayoutsFragmentDoc}`;
export const ProgramFieldsFragmentDoc = gql`
    fragment ProgramFields on Program {
  id
  createdAt
  creatorAddress
  colonyAddress
  description
  enrolled
  enrolledUserAddresses
  levels {
    id
    achievement
    description
    numRequiredSteps
    programId
    stepIds
    steps {
      ...PersistentTaskFields
    }
    status
    title
  }
  levelIds
  status
  title
}
    ${PersistentTaskFieldsFragmentDoc}`;
export const LevelFieldsFragmentDoc = gql`
    fragment LevelFields on Level {
  id
  achievement
  createdAt
  creatorAddress
  description
  numRequiredSteps
  programId
  status
  stepIds
  steps {
    ...PersistentTaskFields
  }
  title
}
    ${PersistentTaskFieldsFragmentDoc}`;
export const ProgramSubmissionFieldsFragmentDoc = gql`
    fragment ProgramSubmissionFields on ProgramSubmission {
  id
  level {
    id
    title
  }
  submission {
    id
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
    task {
      id
      colonyAddress
      description
      ethSkillId
      title
      domain {
        id
        ethDomainId
        name
      }
      ...PersistentTaskPayouts
    }
    status
    statusChangedAt
    submission
  }
}
    ${PersistentTaskPayoutsFragmentDoc}`;
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
    ... on AcceptLevelTaskSubmissionEvent {
      acceptedBy
      levelId
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
      persistentTaskId
      programId
      submissionId
      type
    }
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
    ... on CreateLevelTaskSubmissionEvent {
      levelId
      persistentTaskId
      programId
      submissionId
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
      colonyAddress
    }
    ... on EnrollUserInProgramEvent {
      programId
      type
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
    ... on UnlockNextLevelEvent {
      levelId
      nextLevelId
      persistentTaskId
      programId
      submissionId
      type
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
    ...CreateTaskFields
  }
}
    ${CreateTaskFieldsFragmentDoc}`;
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
    workRequestAddresses
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
    ...Payouts
  }
}
    ${TaskEventFragmentDoc}
${PayoutsFragmentDoc}`;
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
    workInviteAddresses
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
      tokenAddress
      token @client {
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
export type RemoveTaskSkillMutationFn = ApolloReactCommon.MutationFunction<RemoveTaskSkillMutation, RemoveTaskSkillMutationVariables>;

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
export function useRemoveTaskSkillMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveTaskSkillMutation, RemoveTaskSkillMutationVariables>) {
        return ApolloReactHooks.useMutation<RemoveTaskSkillMutation, RemoveTaskSkillMutationVariables>(RemoveTaskSkillDocument, baseOptions);
      }
export type RemoveTaskSkillMutationHookResult = ReturnType<typeof useRemoveTaskSkillMutation>;
export type RemoveTaskSkillMutationResult = ApolloReactCommon.MutationResult<RemoveTaskSkillMutation>;
export type RemoveTaskSkillMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveTaskSkillMutation, RemoveTaskSkillMutationVariables>;
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
export type SetTaskPendingMutationFn = ApolloReactCommon.MutationFunction<SetTaskPendingMutation, SetTaskPendingMutationVariables>;

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
export function useSetTaskPendingMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetTaskPendingMutation, SetTaskPendingMutationVariables>) {
        return ApolloReactHooks.useMutation<SetTaskPendingMutation, SetTaskPendingMutationVariables>(SetTaskPendingDocument, baseOptions);
      }
export type SetTaskPendingMutationHookResult = ReturnType<typeof useSetTaskPendingMutation>;
export type SetTaskPendingMutationResult = ApolloReactCommon.MutationResult<SetTaskPendingMutation>;
export type SetTaskPendingMutationOptions = ApolloReactCommon.BaseMutationOptions<SetTaskPendingMutation, SetTaskPendingMutationVariables>;
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
export const ClearLoggedInUserDocument = gql`
    mutation ClearLoggedInUser {
  clearLoggedInUser @client {
    id
  }
}
    `;
export type ClearLoggedInUserMutationFn = ApolloReactCommon.MutationFunction<ClearLoggedInUserMutation, ClearLoggedInUserMutationVariables>;

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
export function useClearLoggedInUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ClearLoggedInUserMutation, ClearLoggedInUserMutationVariables>) {
        return ApolloReactHooks.useMutation<ClearLoggedInUserMutation, ClearLoggedInUserMutationVariables>(ClearLoggedInUserDocument, baseOptions);
      }
export type ClearLoggedInUserMutationHookResult = ReturnType<typeof useClearLoggedInUserMutation>;
export type ClearLoggedInUserMutationResult = ApolloReactCommon.MutationResult<ClearLoggedInUserMutation>;
export type ClearLoggedInUserMutationOptions = ApolloReactCommon.BaseMutationOptions<ClearLoggedInUserMutation, ClearLoggedInUserMutationVariables>;
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
    colonyAddresses
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
    colonyAddresses
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
export const CreateSuggestionDocument = gql`
    mutation CreateSuggestion($input: CreateSuggestionInput!) {
  createSuggestion(input: $input) {
    ...SuggestionFields
  }
}
    ${SuggestionFieldsFragmentDoc}`;
export type CreateSuggestionMutationFn = ApolloReactCommon.MutationFunction<CreateSuggestionMutation, CreateSuggestionMutationVariables>;

/**
 * __useCreateSuggestionMutation__
 *
 * To run a mutation, you first call `useCreateSuggestionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSuggestionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSuggestionMutation, { data, loading, error }] = useCreateSuggestionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSuggestionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateSuggestionMutation, CreateSuggestionMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateSuggestionMutation, CreateSuggestionMutationVariables>(CreateSuggestionDocument, baseOptions);
      }
export type CreateSuggestionMutationHookResult = ReturnType<typeof useCreateSuggestionMutation>;
export type CreateSuggestionMutationResult = ApolloReactCommon.MutationResult<CreateSuggestionMutation>;
export type CreateSuggestionMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateSuggestionMutation, CreateSuggestionMutationVariables>;
export const SetSuggestionStatusDocument = gql`
    mutation SetSuggestionStatus($input: SetSuggestionStatusInput!) {
  setSuggestionStatus(input: $input) {
    id
    status
    taskId
  }
}
    `;
export type SetSuggestionStatusMutationFn = ApolloReactCommon.MutationFunction<SetSuggestionStatusMutation, SetSuggestionStatusMutationVariables>;

/**
 * __useSetSuggestionStatusMutation__
 *
 * To run a mutation, you first call `useSetSuggestionStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetSuggestionStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setSuggestionStatusMutation, { data, loading, error }] = useSetSuggestionStatusMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetSuggestionStatusMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetSuggestionStatusMutation, SetSuggestionStatusMutationVariables>) {
        return ApolloReactHooks.useMutation<SetSuggestionStatusMutation, SetSuggestionStatusMutationVariables>(SetSuggestionStatusDocument, baseOptions);
      }
export type SetSuggestionStatusMutationHookResult = ReturnType<typeof useSetSuggestionStatusMutation>;
export type SetSuggestionStatusMutationResult = ApolloReactCommon.MutationResult<SetSuggestionStatusMutation>;
export type SetSuggestionStatusMutationOptions = ApolloReactCommon.BaseMutationOptions<SetSuggestionStatusMutation, SetSuggestionStatusMutationVariables>;
export const AddUpvoteToSuggestionDocument = gql`
    mutation AddUpvoteToSuggestion($input: AddUpvoteToSuggestionInput!) {
  addUpvoteToSuggestion(input: $input) {
    id
    upvotes
  }
}
    `;
export type AddUpvoteToSuggestionMutationFn = ApolloReactCommon.MutationFunction<AddUpvoteToSuggestionMutation, AddUpvoteToSuggestionMutationVariables>;

/**
 * __useAddUpvoteToSuggestionMutation__
 *
 * To run a mutation, you first call `useAddUpvoteToSuggestionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUpvoteToSuggestionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUpvoteToSuggestionMutation, { data, loading, error }] = useAddUpvoteToSuggestionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddUpvoteToSuggestionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddUpvoteToSuggestionMutation, AddUpvoteToSuggestionMutationVariables>) {
        return ApolloReactHooks.useMutation<AddUpvoteToSuggestionMutation, AddUpvoteToSuggestionMutationVariables>(AddUpvoteToSuggestionDocument, baseOptions);
      }
export type AddUpvoteToSuggestionMutationHookResult = ReturnType<typeof useAddUpvoteToSuggestionMutation>;
export type AddUpvoteToSuggestionMutationResult = ApolloReactCommon.MutationResult<AddUpvoteToSuggestionMutation>;
export type AddUpvoteToSuggestionMutationOptions = ApolloReactCommon.BaseMutationOptions<AddUpvoteToSuggestionMutation, AddUpvoteToSuggestionMutationVariables>;
export const RemoveUpvoteFromSuggestionDocument = gql`
    mutation RemoveUpvoteFromSuggestion($input: RemoveUpvoteFromSuggestionInput!) {
  removeUpvoteFromSuggestion(input: $input) {
    id
    upvotes
  }
}
    `;
export type RemoveUpvoteFromSuggestionMutationFn = ApolloReactCommon.MutationFunction<RemoveUpvoteFromSuggestionMutation, RemoveUpvoteFromSuggestionMutationVariables>;

/**
 * __useRemoveUpvoteFromSuggestionMutation__
 *
 * To run a mutation, you first call `useRemoveUpvoteFromSuggestionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUpvoteFromSuggestionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUpvoteFromSuggestionMutation, { data, loading, error }] = useRemoveUpvoteFromSuggestionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveUpvoteFromSuggestionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveUpvoteFromSuggestionMutation, RemoveUpvoteFromSuggestionMutationVariables>) {
        return ApolloReactHooks.useMutation<RemoveUpvoteFromSuggestionMutation, RemoveUpvoteFromSuggestionMutationVariables>(RemoveUpvoteFromSuggestionDocument, baseOptions);
      }
export type RemoveUpvoteFromSuggestionMutationHookResult = ReturnType<typeof useRemoveUpvoteFromSuggestionMutation>;
export type RemoveUpvoteFromSuggestionMutationResult = ApolloReactCommon.MutationResult<RemoveUpvoteFromSuggestionMutation>;
export type RemoveUpvoteFromSuggestionMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveUpvoteFromSuggestionMutation, RemoveUpvoteFromSuggestionMutationVariables>;
export const CreateTaskFromSuggestionDocument = gql`
    mutation CreateTaskFromSuggestion($input: CreateTaskFromSuggestionInput!) {
  createTaskFromSuggestion(input: $input) {
    ...CreateTaskFields
  }
}
    ${CreateTaskFieldsFragmentDoc}`;
export type CreateTaskFromSuggestionMutationFn = ApolloReactCommon.MutationFunction<CreateTaskFromSuggestionMutation, CreateTaskFromSuggestionMutationVariables>;

/**
 * __useCreateTaskFromSuggestionMutation__
 *
 * To run a mutation, you first call `useCreateTaskFromSuggestionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskFromSuggestionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskFromSuggestionMutation, { data, loading, error }] = useCreateTaskFromSuggestionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTaskFromSuggestionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateTaskFromSuggestionMutation, CreateTaskFromSuggestionMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateTaskFromSuggestionMutation, CreateTaskFromSuggestionMutationVariables>(CreateTaskFromSuggestionDocument, baseOptions);
      }
export type CreateTaskFromSuggestionMutationHookResult = ReturnType<typeof useCreateTaskFromSuggestionMutation>;
export type CreateTaskFromSuggestionMutationResult = ApolloReactCommon.MutationResult<CreateTaskFromSuggestionMutation>;
export type CreateTaskFromSuggestionMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateTaskFromSuggestionMutation, CreateTaskFromSuggestionMutationVariables>;
export const CreateProgramDocument = gql`
    mutation CreateProgram($input: CreateProgramInput!) {
  createProgram(input: $input) {
    ...ProgramFields
  }
}
    ${ProgramFieldsFragmentDoc}`;
export type CreateProgramMutationFn = ApolloReactCommon.MutationFunction<CreateProgramMutation, CreateProgramMutationVariables>;

/**
 * __useCreateProgramMutation__
 *
 * To run a mutation, you first call `useCreateProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProgramMutation, { data, loading, error }] = useCreateProgramMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProgramMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateProgramMutation, CreateProgramMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateProgramMutation, CreateProgramMutationVariables>(CreateProgramDocument, baseOptions);
      }
export type CreateProgramMutationHookResult = ReturnType<typeof useCreateProgramMutation>;
export type CreateProgramMutationResult = ApolloReactCommon.MutationResult<CreateProgramMutation>;
export type CreateProgramMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateProgramMutation, CreateProgramMutationVariables>;
export const EditProgramDocument = gql`
    mutation EditProgram($input: EditProgramInput!) {
  editProgram(input: $input) {
    id
    description
    title
  }
}
    `;
export type EditProgramMutationFn = ApolloReactCommon.MutationFunction<EditProgramMutation, EditProgramMutationVariables>;

/**
 * __useEditProgramMutation__
 *
 * To run a mutation, you first call `useEditProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editProgramMutation, { data, loading, error }] = useEditProgramMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditProgramMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditProgramMutation, EditProgramMutationVariables>) {
        return ApolloReactHooks.useMutation<EditProgramMutation, EditProgramMutationVariables>(EditProgramDocument, baseOptions);
      }
export type EditProgramMutationHookResult = ReturnType<typeof useEditProgramMutation>;
export type EditProgramMutationResult = ApolloReactCommon.MutationResult<EditProgramMutation>;
export type EditProgramMutationOptions = ApolloReactCommon.BaseMutationOptions<EditProgramMutation, EditProgramMutationVariables>;
export const RemoveProgramDocument = gql`
    mutation RemoveProgram($input: RemoveProgramInput!) {
  removeProgram(input: $input) {
    id
    status
  }
}
    `;
export type RemoveProgramMutationFn = ApolloReactCommon.MutationFunction<RemoveProgramMutation, RemoveProgramMutationVariables>;

/**
 * __useRemoveProgramMutation__
 *
 * To run a mutation, you first call `useRemoveProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeProgramMutation, { data, loading, error }] = useRemoveProgramMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveProgramMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveProgramMutation, RemoveProgramMutationVariables>) {
        return ApolloReactHooks.useMutation<RemoveProgramMutation, RemoveProgramMutationVariables>(RemoveProgramDocument, baseOptions);
      }
export type RemoveProgramMutationHookResult = ReturnType<typeof useRemoveProgramMutation>;
export type RemoveProgramMutationResult = ApolloReactCommon.MutationResult<RemoveProgramMutation>;
export type RemoveProgramMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveProgramMutation, RemoveProgramMutationVariables>;
export const PublishProgramDocument = gql`
    mutation PublishProgram($input: PublishProgramInput!) {
  publishProgram(input: $input) {
    id
    status
  }
}
    `;
export type PublishProgramMutationFn = ApolloReactCommon.MutationFunction<PublishProgramMutation, PublishProgramMutationVariables>;

/**
 * __usePublishProgramMutation__
 *
 * To run a mutation, you first call `usePublishProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishProgramMutation, { data, loading, error }] = usePublishProgramMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function usePublishProgramMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PublishProgramMutation, PublishProgramMutationVariables>) {
        return ApolloReactHooks.useMutation<PublishProgramMutation, PublishProgramMutationVariables>(PublishProgramDocument, baseOptions);
      }
export type PublishProgramMutationHookResult = ReturnType<typeof usePublishProgramMutation>;
export type PublishProgramMutationResult = ApolloReactCommon.MutationResult<PublishProgramMutation>;
export type PublishProgramMutationOptions = ApolloReactCommon.BaseMutationOptions<PublishProgramMutation, PublishProgramMutationVariables>;
export const EnrollInProgramDocument = gql`
    mutation EnrollInProgram($input: EnrollInProgramInput!) {
  enrollInProgram(input: $input) {
    id
    enrolled
    enrolledUserAddresses
    levels {
      id
      unlocked
    }
  }
}
    `;
export type EnrollInProgramMutationFn = ApolloReactCommon.MutationFunction<EnrollInProgramMutation, EnrollInProgramMutationVariables>;

/**
 * __useEnrollInProgramMutation__
 *
 * To run a mutation, you first call `useEnrollInProgramMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnrollInProgramMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [enrollInProgramMutation, { data, loading, error }] = useEnrollInProgramMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEnrollInProgramMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EnrollInProgramMutation, EnrollInProgramMutationVariables>) {
        return ApolloReactHooks.useMutation<EnrollInProgramMutation, EnrollInProgramMutationVariables>(EnrollInProgramDocument, baseOptions);
      }
export type EnrollInProgramMutationHookResult = ReturnType<typeof useEnrollInProgramMutation>;
export type EnrollInProgramMutationResult = ApolloReactCommon.MutationResult<EnrollInProgramMutation>;
export type EnrollInProgramMutationOptions = ApolloReactCommon.BaseMutationOptions<EnrollInProgramMutation, EnrollInProgramMutationVariables>;
export const CreateLevelDocument = gql`
    mutation CreateLevel($input: CreateLevelInput!) {
  createLevel(input: $input) {
    ...LevelFields
    unlocked
  }
}
    ${LevelFieldsFragmentDoc}`;
export type CreateLevelMutationFn = ApolloReactCommon.MutationFunction<CreateLevelMutation, CreateLevelMutationVariables>;

/**
 * __useCreateLevelMutation__
 *
 * To run a mutation, you first call `useCreateLevelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLevelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLevelMutation, { data, loading, error }] = useCreateLevelMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLevelMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateLevelMutation, CreateLevelMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateLevelMutation, CreateLevelMutationVariables>(CreateLevelDocument, baseOptions);
      }
export type CreateLevelMutationHookResult = ReturnType<typeof useCreateLevelMutation>;
export type CreateLevelMutationResult = ApolloReactCommon.MutationResult<CreateLevelMutation>;
export type CreateLevelMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateLevelMutation, CreateLevelMutationVariables>;
export const EditLevelDocument = gql`
    mutation EditLevel($input: EditLevelInput!) {
  editLevel(input: $input) {
    ...LevelFields
  }
}
    ${LevelFieldsFragmentDoc}`;
export type EditLevelMutationFn = ApolloReactCommon.MutationFunction<EditLevelMutation, EditLevelMutationVariables>;

/**
 * __useEditLevelMutation__
 *
 * To run a mutation, you first call `useEditLevelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditLevelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editLevelMutation, { data, loading, error }] = useEditLevelMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditLevelMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditLevelMutation, EditLevelMutationVariables>) {
        return ApolloReactHooks.useMutation<EditLevelMutation, EditLevelMutationVariables>(EditLevelDocument, baseOptions);
      }
export type EditLevelMutationHookResult = ReturnType<typeof useEditLevelMutation>;
export type EditLevelMutationResult = ApolloReactCommon.MutationResult<EditLevelMutation>;
export type EditLevelMutationOptions = ApolloReactCommon.BaseMutationOptions<EditLevelMutation, EditLevelMutationVariables>;
export const RemoveLevelDocument = gql`
    mutation RemoveLevel($input: RemoveLevelInput!) {
  removeLevel(input: $input) {
    id
    status
  }
}
    `;
export type RemoveLevelMutationFn = ApolloReactCommon.MutationFunction<RemoveLevelMutation, RemoveLevelMutationVariables>;

/**
 * __useRemoveLevelMutation__
 *
 * To run a mutation, you first call `useRemoveLevelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveLevelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeLevelMutation, { data, loading, error }] = useRemoveLevelMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveLevelMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveLevelMutation, RemoveLevelMutationVariables>) {
        return ApolloReactHooks.useMutation<RemoveLevelMutation, RemoveLevelMutationVariables>(RemoveLevelDocument, baseOptions);
      }
export type RemoveLevelMutationHookResult = ReturnType<typeof useRemoveLevelMutation>;
export type RemoveLevelMutationResult = ApolloReactCommon.MutationResult<RemoveLevelMutation>;
export type RemoveLevelMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveLevelMutation, RemoveLevelMutationVariables>;
export const ReorderProgramLevelsDocument = gql`
    mutation ReorderProgramLevels($input: ReorderProgramLevelsInput!) {
  reorderProgramLevels(input: $input) {
    id
    levelIds
    levels {
      id
    }
  }
}
    `;
export type ReorderProgramLevelsMutationFn = ApolloReactCommon.MutationFunction<ReorderProgramLevelsMutation, ReorderProgramLevelsMutationVariables>;

/**
 * __useReorderProgramLevelsMutation__
 *
 * To run a mutation, you first call `useReorderProgramLevelsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReorderProgramLevelsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reorderProgramLevelsMutation, { data, loading, error }] = useReorderProgramLevelsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useReorderProgramLevelsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ReorderProgramLevelsMutation, ReorderProgramLevelsMutationVariables>) {
        return ApolloReactHooks.useMutation<ReorderProgramLevelsMutation, ReorderProgramLevelsMutationVariables>(ReorderProgramLevelsDocument, baseOptions);
      }
export type ReorderProgramLevelsMutationHookResult = ReturnType<typeof useReorderProgramLevelsMutation>;
export type ReorderProgramLevelsMutationResult = ApolloReactCommon.MutationResult<ReorderProgramLevelsMutation>;
export type ReorderProgramLevelsMutationOptions = ApolloReactCommon.BaseMutationOptions<ReorderProgramLevelsMutation, ReorderProgramLevelsMutationVariables>;
export const CreateLevelTaskDocument = gql`
    mutation CreateLevelTask($input: CreateLevelTaskInput!) {
  createLevelTask(input: $input) {
    ...PersistentTaskFields
  }
}
    ${PersistentTaskFieldsFragmentDoc}`;
export type CreateLevelTaskMutationFn = ApolloReactCommon.MutationFunction<CreateLevelTaskMutation, CreateLevelTaskMutationVariables>;

/**
 * __useCreateLevelTaskMutation__
 *
 * To run a mutation, you first call `useCreateLevelTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLevelTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLevelTaskMutation, { data, loading, error }] = useCreateLevelTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLevelTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateLevelTaskMutation, CreateLevelTaskMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateLevelTaskMutation, CreateLevelTaskMutationVariables>(CreateLevelTaskDocument, baseOptions);
      }
export type CreateLevelTaskMutationHookResult = ReturnType<typeof useCreateLevelTaskMutation>;
export type CreateLevelTaskMutationResult = ApolloReactCommon.MutationResult<CreateLevelTaskMutation>;
export type CreateLevelTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateLevelTaskMutation, CreateLevelTaskMutationVariables>;
export const RemoveLevelTaskDocument = gql`
    mutation RemoveLevelTask($input: RemoveLevelTaskInput!) {
  removeLevelTask(input: $input) {
    id
    status
  }
}
    `;
export type RemoveLevelTaskMutationFn = ApolloReactCommon.MutationFunction<RemoveLevelTaskMutation, RemoveLevelTaskMutationVariables>;

/**
 * __useRemoveLevelTaskMutation__
 *
 * To run a mutation, you first call `useRemoveLevelTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveLevelTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeLevelTaskMutation, { data, loading, error }] = useRemoveLevelTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemoveLevelTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveLevelTaskMutation, RemoveLevelTaskMutationVariables>) {
        return ApolloReactHooks.useMutation<RemoveLevelTaskMutation, RemoveLevelTaskMutationVariables>(RemoveLevelTaskDocument, baseOptions);
      }
export type RemoveLevelTaskMutationHookResult = ReturnType<typeof useRemoveLevelTaskMutation>;
export type RemoveLevelTaskMutationResult = ApolloReactCommon.MutationResult<RemoveLevelTaskMutation>;
export type RemoveLevelTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveLevelTaskMutation, RemoveLevelTaskMutationVariables>;
export const EditPersistentTaskDocument = gql`
    mutation EditPersistentTask($input: EditPersistentTaskInput!) {
  editPersistentTask(input: $input) {
    id
    description
    ethDomainId
    ethSkillId
    ...PersistentTaskPayouts
    title
  }
}
    ${PersistentTaskPayoutsFragmentDoc}`;
export type EditPersistentTaskMutationFn = ApolloReactCommon.MutationFunction<EditPersistentTaskMutation, EditPersistentTaskMutationVariables>;

/**
 * __useEditPersistentTaskMutation__
 *
 * To run a mutation, you first call `useEditPersistentTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditPersistentTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editPersistentTaskMutation, { data, loading, error }] = useEditPersistentTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditPersistentTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditPersistentTaskMutation, EditPersistentTaskMutationVariables>) {
        return ApolloReactHooks.useMutation<EditPersistentTaskMutation, EditPersistentTaskMutationVariables>(EditPersistentTaskDocument, baseOptions);
      }
export type EditPersistentTaskMutationHookResult = ReturnType<typeof useEditPersistentTaskMutation>;
export type EditPersistentTaskMutationResult = ApolloReactCommon.MutationResult<EditPersistentTaskMutation>;
export type EditPersistentTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<EditPersistentTaskMutation, EditPersistentTaskMutationVariables>;
export const CreateLevelTaskSubmissionDocument = gql`
    mutation CreateLevelTaskSubmission($input: CreateLevelTaskSubmissionInput!) {
  createLevelTaskSubmission(input: $input) {
    id
    status
    submission
  }
}
    `;
export type CreateLevelTaskSubmissionMutationFn = ApolloReactCommon.MutationFunction<CreateLevelTaskSubmissionMutation, CreateLevelTaskSubmissionMutationVariables>;

/**
 * __useCreateLevelTaskSubmissionMutation__
 *
 * To run a mutation, you first call `useCreateLevelTaskSubmissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLevelTaskSubmissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLevelTaskSubmissionMutation, { data, loading, error }] = useCreateLevelTaskSubmissionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateLevelTaskSubmissionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateLevelTaskSubmissionMutation, CreateLevelTaskSubmissionMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateLevelTaskSubmissionMutation, CreateLevelTaskSubmissionMutationVariables>(CreateLevelTaskSubmissionDocument, baseOptions);
      }
export type CreateLevelTaskSubmissionMutationHookResult = ReturnType<typeof useCreateLevelTaskSubmissionMutation>;
export type CreateLevelTaskSubmissionMutationResult = ApolloReactCommon.MutationResult<CreateLevelTaskSubmissionMutation>;
export type CreateLevelTaskSubmissionMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateLevelTaskSubmissionMutation, CreateLevelTaskSubmissionMutationVariables>;
export const EditSubmissionDocument = gql`
    mutation EditSubmission($input: EditSubmissionInput!) {
  editSubmission(input: $input) {
    id
    status
    submission
  }
}
    `;
export type EditSubmissionMutationFn = ApolloReactCommon.MutationFunction<EditSubmissionMutation, EditSubmissionMutationVariables>;

/**
 * __useEditSubmissionMutation__
 *
 * To run a mutation, you first call `useEditSubmissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditSubmissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editSubmissionMutation, { data, loading, error }] = useEditSubmissionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditSubmissionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditSubmissionMutation, EditSubmissionMutationVariables>) {
        return ApolloReactHooks.useMutation<EditSubmissionMutation, EditSubmissionMutationVariables>(EditSubmissionDocument, baseOptions);
      }
export type EditSubmissionMutationHookResult = ReturnType<typeof useEditSubmissionMutation>;
export type EditSubmissionMutationResult = ApolloReactCommon.MutationResult<EditSubmissionMutation>;
export type EditSubmissionMutationOptions = ApolloReactCommon.BaseMutationOptions<EditSubmissionMutation, EditSubmissionMutationVariables>;
export const AcceptLevelTaskSubmissionDocument = gql`
    mutation AcceptLevelTaskSubmission($input: AcceptLevelTaskSubmissionInput!) {
  acceptLevelTaskSubmission(input: $input) {
    id
    status
  }
}
    `;
export type AcceptLevelTaskSubmissionMutationFn = ApolloReactCommon.MutationFunction<AcceptLevelTaskSubmissionMutation, AcceptLevelTaskSubmissionMutationVariables>;

/**
 * __useAcceptLevelTaskSubmissionMutation__
 *
 * To run a mutation, you first call `useAcceptLevelTaskSubmissionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptLevelTaskSubmissionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptLevelTaskSubmissionMutation, { data, loading, error }] = useAcceptLevelTaskSubmissionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAcceptLevelTaskSubmissionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AcceptLevelTaskSubmissionMutation, AcceptLevelTaskSubmissionMutationVariables>) {
        return ApolloReactHooks.useMutation<AcceptLevelTaskSubmissionMutation, AcceptLevelTaskSubmissionMutationVariables>(AcceptLevelTaskSubmissionDocument, baseOptions);
      }
export type AcceptLevelTaskSubmissionMutationHookResult = ReturnType<typeof useAcceptLevelTaskSubmissionMutation>;
export type AcceptLevelTaskSubmissionMutationResult = ApolloReactCommon.MutationResult<AcceptLevelTaskSubmissionMutation>;
export type AcceptLevelTaskSubmissionMutationOptions = ApolloReactCommon.BaseMutationOptions<AcceptLevelTaskSubmissionMutation, AcceptLevelTaskSubmissionMutationVariables>;
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
      id
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
      tokenAddresses
      tokens @client {
        id
        address
        decimals
        name
        symbol
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
    ethereal
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
export function useUserWithReputationQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserWithReputationQuery, UserWithReputationQueryVariables>) {
        return ApolloReactHooks.useQuery<UserWithReputationQuery, UserWithReputationQueryVariables>(UserWithReputationDocument, baseOptions);
      }
export function useUserWithReputationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserWithReputationQuery, UserWithReputationQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UserWithReputationQuery, UserWithReputationQueryVariables>(UserWithReputationDocument, baseOptions);
        }
export type UserWithReputationQueryHookResult = ReturnType<typeof useUserWithReputationQuery>;
export type UserWithReputationLazyQueryHookResult = ReturnType<typeof useUserWithReputationLazyQuery>;
export type UserWithReputationQueryResult = ApolloReactCommon.QueryResult<UserWithReputationQuery, UserWithReputationQueryVariables>;
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
export function useUserReputationQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserReputationQuery, UserReputationQueryVariables>) {
        return ApolloReactHooks.useQuery<UserReputationQuery, UserReputationQueryVariables>(UserReputationDocument, baseOptions);
      }
export function useUserReputationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserReputationQuery, UserReputationQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UserReputationQuery, UserReputationQueryVariables>(UserReputationDocument, baseOptions);
        }
export type UserReputationQueryHookResult = ReturnType<typeof useUserReputationQuery>;
export type UserReputationLazyQueryHookResult = ReturnType<typeof useUserReputationLazyQuery>;
export type UserReputationQueryResult = ApolloReactCommon.QueryResult<UserReputationQuery, UserReputationQueryVariables>;
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
    tokenAddresses
    tokens @client {
      id
      address
      iconHash
      decimals
      name
      symbol
      balance(walletAddress: $address)
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
export function useUsernameQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UsernameQuery, UsernameQueryVariables>) {
        return ApolloReactHooks.useQuery<UsernameQuery, UsernameQueryVariables>(UsernameDocument, baseOptions);
      }
export function useUsernameLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UsernameQuery, UsernameQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UsernameQuery, UsernameQueryVariables>(UsernameDocument, baseOptions);
        }
export type UsernameQueryHookResult = ReturnType<typeof useUsernameQuery>;
export type UsernameLazyQueryHookResult = ReturnType<typeof useUsernameLazyQuery>;
export type UsernameQueryResult = ApolloReactCommon.QueryResult<UsernameQuery, UsernameQueryVariables>;
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
export function useUserAddressQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserAddressQuery, UserAddressQueryVariables>) {
        return ApolloReactHooks.useQuery<UserAddressQuery, UserAddressQueryVariables>(UserAddressDocument, baseOptions);
      }
export function useUserAddressLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserAddressQuery, UserAddressQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UserAddressQuery, UserAddressQueryVariables>(UserAddressDocument, baseOptions);
        }
export type UserAddressQueryHookResult = ReturnType<typeof useUserAddressQuery>;
export type UserAddressLazyQueryHookResult = ReturnType<typeof useUserAddressLazyQuery>;
export type UserAddressQueryResult = ApolloReactCommon.QueryResult<UserAddressQuery, UserAddressQueryVariables>;
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
export function useColonyAddressQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ColonyAddressQuery, ColonyAddressQueryVariables>) {
        return ApolloReactHooks.useQuery<ColonyAddressQuery, ColonyAddressQueryVariables>(ColonyAddressDocument, baseOptions);
      }
export function useColonyAddressLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ColonyAddressQuery, ColonyAddressQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ColonyAddressQuery, ColonyAddressQueryVariables>(ColonyAddressDocument, baseOptions);
        }
export type ColonyAddressQueryHookResult = ReturnType<typeof useColonyAddressQuery>;
export type ColonyAddressLazyQueryHookResult = ReturnType<typeof useColonyAddressLazyQuery>;
export type ColonyAddressQueryResult = ApolloReactCommon.QueryResult<ColonyAddressQuery, ColonyAddressQueryVariables>;
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
export const ColonyNativeTokenDocument = gql`
    query ColonyNativeToken($address: String!) {
  colony(address: $address) {
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
export function useColonyNativeTokenQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ColonyNativeTokenQuery, ColonyNativeTokenQueryVariables>) {
        return ApolloReactHooks.useQuery<ColonyNativeTokenQuery, ColonyNativeTokenQueryVariables>(ColonyNativeTokenDocument, baseOptions);
      }
export function useColonyNativeTokenLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ColonyNativeTokenQuery, ColonyNativeTokenQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ColonyNativeTokenQuery, ColonyNativeTokenQueryVariables>(ColonyNativeTokenDocument, baseOptions);
        }
export type ColonyNativeTokenQueryHookResult = ReturnType<typeof useColonyNativeTokenQuery>;
export type ColonyNativeTokenLazyQueryHookResult = ReturnType<typeof useColonyNativeTokenLazyQuery>;
export type ColonyNativeTokenQueryResult = ApolloReactCommon.QueryResult<ColonyNativeTokenQuery, ColonyNativeTokenQueryVariables>;
export const ColonyRolesDocument = gql`
    query ColonyRoles($address: String!) {
  colony(address: $address) {
    id
    colonyAddress
    roles @client {
      address
      domains {
        domainId
        roles
      }
    }
  }
}
    `;

/**
 * __useColonyRolesQuery__
 *
 * To run a query within a React component, call `useColonyRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyRolesQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useColonyRolesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ColonyRolesQuery, ColonyRolesQueryVariables>) {
        return ApolloReactHooks.useQuery<ColonyRolesQuery, ColonyRolesQueryVariables>(ColonyRolesDocument, baseOptions);
      }
export function useColonyRolesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ColonyRolesQuery, ColonyRolesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ColonyRolesQuery, ColonyRolesQueryVariables>(ColonyRolesDocument, baseOptions);
        }
export type ColonyRolesQueryHookResult = ReturnType<typeof useColonyRolesQuery>;
export type ColonyRolesLazyQueryHookResult = ReturnType<typeof useColonyRolesLazyQuery>;
export type ColonyRolesQueryResult = ApolloReactCommon.QueryResult<ColonyRolesQuery, ColonyRolesQueryVariables>;
export const ColonyTransfersDocument = gql`
    query ColonyTransfers($address: String!) {
  colony(address: $address) {
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
export function useColonyTransfersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ColonyTransfersQuery, ColonyTransfersQueryVariables>) {
        return ApolloReactHooks.useQuery<ColonyTransfersQuery, ColonyTransfersQueryVariables>(ColonyTransfersDocument, baseOptions);
      }
export function useColonyTransfersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ColonyTransfersQuery, ColonyTransfersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ColonyTransfersQuery, ColonyTransfersQueryVariables>(ColonyTransfersDocument, baseOptions);
        }
export type ColonyTransfersQueryHookResult = ReturnType<typeof useColonyTransfersQuery>;
export type ColonyTransfersLazyQueryHookResult = ReturnType<typeof useColonyTransfersLazyQuery>;
export type ColonyTransfersQueryResult = ApolloReactCommon.QueryResult<ColonyTransfersQuery, ColonyTransfersQueryVariables>;
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
export function useUserColonyAddressesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserColonyAddressesQuery, UserColonyAddressesQueryVariables>) {
        return ApolloReactHooks.useQuery<UserColonyAddressesQuery, UserColonyAddressesQueryVariables>(UserColonyAddressesDocument, baseOptions);
      }
export function useUserColonyAddressesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserColonyAddressesQuery, UserColonyAddressesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UserColonyAddressesQuery, UserColonyAddressesQueryVariables>(UserColonyAddressesDocument, baseOptions);
        }
export type UserColonyAddressesQueryHookResult = ReturnType<typeof useUserColonyAddressesQuery>;
export type UserColonyAddressesLazyQueryHookResult = ReturnType<typeof useUserColonyAddressesLazyQuery>;
export type UserColonyAddressesQueryResult = ApolloReactCommon.QueryResult<UserColonyAddressesQuery, UserColonyAddressesQueryVariables>;
export const ColonyTasksDocument = gql`
    query ColonyTasks($address: String!) {
  colony(address: $address) {
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
export const ColonyProgramsDocument = gql`
    query ColonyPrograms($address: String!) {
  colony(address: $address) {
    id
    programs {
      ...ProgramFields
    }
  }
}
    ${ProgramFieldsFragmentDoc}`;

/**
 * __useColonyProgramsQuery__
 *
 * To run a query within a React component, call `useColonyProgramsQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonyProgramsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonyProgramsQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useColonyProgramsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ColonyProgramsQuery, ColonyProgramsQueryVariables>) {
        return ApolloReactHooks.useQuery<ColonyProgramsQuery, ColonyProgramsQueryVariables>(ColonyProgramsDocument, baseOptions);
      }
export function useColonyProgramsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ColonyProgramsQuery, ColonyProgramsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ColonyProgramsQuery, ColonyProgramsQueryVariables>(ColonyProgramsDocument, baseOptions);
        }
export type ColonyProgramsQueryHookResult = ReturnType<typeof useColonyProgramsQuery>;
export type ColonyProgramsLazyQueryHookResult = ReturnType<typeof useColonyProgramsLazyQuery>;
export type ColonyProgramsQueryResult = ApolloReactCommon.QueryResult<ColonyProgramsQuery, ColonyProgramsQueryVariables>;
export const ProgramDocument = gql`
    query Program($id: String!) {
  program(id: $id) {
    ...ProgramFields
  }
}
    ${ProgramFieldsFragmentDoc}`;

/**
 * __useProgramQuery__
 *
 * To run a query within a React component, call `useProgramQuery` and pass it any options that fit your needs.
 * When your component renders, `useProgramQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProgramQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProgramQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ProgramQuery, ProgramQueryVariables>) {
        return ApolloReactHooks.useQuery<ProgramQuery, ProgramQueryVariables>(ProgramDocument, baseOptions);
      }
export function useProgramLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ProgramQuery, ProgramQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ProgramQuery, ProgramQueryVariables>(ProgramDocument, baseOptions);
        }
export type ProgramQueryHookResult = ReturnType<typeof useProgramQuery>;
export type ProgramLazyQueryHookResult = ReturnType<typeof useProgramLazyQuery>;
export type ProgramQueryResult = ApolloReactCommon.QueryResult<ProgramQuery, ProgramQueryVariables>;
export const ProgramLevelsDocument = gql`
    query ProgramLevels($id: String!) {
  program(id: $id) {
    id
    levelIds
    levels {
      ...LevelFields
    }
  }
}
    ${LevelFieldsFragmentDoc}`;

/**
 * __useProgramLevelsQuery__
 *
 * To run a query within a React component, call `useProgramLevelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProgramLevelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProgramLevelsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProgramLevelsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ProgramLevelsQuery, ProgramLevelsQueryVariables>) {
        return ApolloReactHooks.useQuery<ProgramLevelsQuery, ProgramLevelsQueryVariables>(ProgramLevelsDocument, baseOptions);
      }
export function useProgramLevelsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ProgramLevelsQuery, ProgramLevelsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ProgramLevelsQuery, ProgramLevelsQueryVariables>(ProgramLevelsDocument, baseOptions);
        }
export type ProgramLevelsQueryHookResult = ReturnType<typeof useProgramLevelsQuery>;
export type ProgramLevelsLazyQueryHookResult = ReturnType<typeof useProgramLevelsLazyQuery>;
export type ProgramLevelsQueryResult = ApolloReactCommon.QueryResult<ProgramLevelsQuery, ProgramLevelsQueryVariables>;
export const LevelDocument = gql`
    query Level($id: String!) {
  level(id: $id) {
    ...LevelFields
    unlocked
  }
}
    ${LevelFieldsFragmentDoc}`;

/**
 * __useLevelQuery__
 *
 * To run a query within a React component, call `useLevelQuery` and pass it any options that fit your needs.
 * When your component renders, `useLevelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLevelQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useLevelQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<LevelQuery, LevelQueryVariables>) {
        return ApolloReactHooks.useQuery<LevelQuery, LevelQueryVariables>(LevelDocument, baseOptions);
      }
export function useLevelLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<LevelQuery, LevelQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<LevelQuery, LevelQueryVariables>(LevelDocument, baseOptions);
        }
export type LevelQueryHookResult = ReturnType<typeof useLevelQuery>;
export type LevelLazyQueryHookResult = ReturnType<typeof useLevelLazyQuery>;
export type LevelQueryResult = ApolloReactCommon.QueryResult<LevelQuery, LevelQueryVariables>;
export const ProgramLevelsWithUnlockedDocument = gql`
    query ProgramLevelsWithUnlocked($id: String!) {
  program(id: $id) {
    id
    levelIds
    levels {
      ...LevelFields
      unlocked
    }
  }
}
    ${LevelFieldsFragmentDoc}`;

/**
 * __useProgramLevelsWithUnlockedQuery__
 *
 * To run a query within a React component, call `useProgramLevelsWithUnlockedQuery` and pass it any options that fit your needs.
 * When your component renders, `useProgramLevelsWithUnlockedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProgramLevelsWithUnlockedQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProgramLevelsWithUnlockedQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ProgramLevelsWithUnlockedQuery, ProgramLevelsWithUnlockedQueryVariables>) {
        return ApolloReactHooks.useQuery<ProgramLevelsWithUnlockedQuery, ProgramLevelsWithUnlockedQueryVariables>(ProgramLevelsWithUnlockedDocument, baseOptions);
      }
export function useProgramLevelsWithUnlockedLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ProgramLevelsWithUnlockedQuery, ProgramLevelsWithUnlockedQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ProgramLevelsWithUnlockedQuery, ProgramLevelsWithUnlockedQueryVariables>(ProgramLevelsWithUnlockedDocument, baseOptions);
        }
export type ProgramLevelsWithUnlockedQueryHookResult = ReturnType<typeof useProgramLevelsWithUnlockedQuery>;
export type ProgramLevelsWithUnlockedLazyQueryHookResult = ReturnType<typeof useProgramLevelsWithUnlockedLazyQuery>;
export type ProgramLevelsWithUnlockedQueryResult = ApolloReactCommon.QueryResult<ProgramLevelsWithUnlockedQuery, ProgramLevelsWithUnlockedQueryVariables>;
export const ProgramSubmissionsDocument = gql`
    query ProgramSubmissions($id: String!) {
  program(id: $id) {
    id
    submissions {
      ...ProgramSubmissionFields
    }
  }
}
    ${ProgramSubmissionFieldsFragmentDoc}`;

/**
 * __useProgramSubmissionsQuery__
 *
 * To run a query within a React component, call `useProgramSubmissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProgramSubmissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProgramSubmissionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProgramSubmissionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ProgramSubmissionsQuery, ProgramSubmissionsQueryVariables>) {
        return ApolloReactHooks.useQuery<ProgramSubmissionsQuery, ProgramSubmissionsQueryVariables>(ProgramSubmissionsDocument, baseOptions);
      }
export function useProgramSubmissionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ProgramSubmissionsQuery, ProgramSubmissionsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ProgramSubmissionsQuery, ProgramSubmissionsQueryVariables>(ProgramSubmissionsDocument, baseOptions);
        }
export type ProgramSubmissionsQueryHookResult = ReturnType<typeof useProgramSubmissionsQuery>;
export type ProgramSubmissionsLazyQueryHookResult = ReturnType<typeof useProgramSubmissionsLazyQuery>;
export type ProgramSubmissionsQueryResult = ApolloReactCommon.QueryResult<ProgramSubmissionsQuery, ProgramSubmissionsQueryVariables>;
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
export const ColonySuggestionsDocument = gql`
    query ColonySuggestions($colonyAddress: String!) {
  colony(address: $colonyAddress) {
    id
    suggestions {
      ...SuggestionFields
    }
  }
}
    ${SuggestionFieldsFragmentDoc}`;

/**
 * __useColonySuggestionsQuery__
 *
 * To run a query within a React component, call `useColonySuggestionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useColonySuggestionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColonySuggestionsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useColonySuggestionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ColonySuggestionsQuery, ColonySuggestionsQueryVariables>) {
        return ApolloReactHooks.useQuery<ColonySuggestionsQuery, ColonySuggestionsQueryVariables>(ColonySuggestionsDocument, baseOptions);
      }
export function useColonySuggestionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ColonySuggestionsQuery, ColonySuggestionsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ColonySuggestionsQuery, ColonySuggestionsQueryVariables>(ColonySuggestionsDocument, baseOptions);
        }
export type ColonySuggestionsQueryHookResult = ReturnType<typeof useColonySuggestionsQuery>;
export type ColonySuggestionsLazyQueryHookResult = ReturnType<typeof useColonySuggestionsLazyQuery>;
export type ColonySuggestionsQueryResult = ApolloReactCommon.QueryResult<ColonySuggestionsQuery, ColonySuggestionsQueryVariables>;
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
export function useUserNotificationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserNotificationsQuery, UserNotificationsQueryVariables>) {
        return ApolloReactHooks.useQuery<UserNotificationsQuery, UserNotificationsQueryVariables>(UserNotificationsDocument, baseOptions);
      }
export function useUserNotificationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserNotificationsQuery, UserNotificationsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UserNotificationsQuery, UserNotificationsQueryVariables>(UserNotificationsDocument, baseOptions);
        }
export type UserNotificationsQueryHookResult = ReturnType<typeof useUserNotificationsQuery>;
export type UserNotificationsLazyQueryHookResult = ReturnType<typeof useUserNotificationsLazyQuery>;
export type UserNotificationsQueryResult = ApolloReactCommon.QueryResult<UserNotificationsQuery, UserNotificationsQueryVariables>;
export const UserBadgesDocument = gql`
    query UserBadges($address: String!, $colonyAddress: String!) {
  user(address: $address) {
    id
    completedLevels(colonyAddress: $colonyAddress) {
      id
      achievement
      title
      program {
        title
      }
    }
  }
}
    `;

/**
 * __useUserBadgesQuery__
 *
 * To run a query within a React component, call `useUserBadgesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserBadgesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserBadgesQuery({
 *   variables: {
 *      address: // value for 'address'
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useUserBadgesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserBadgesQuery, UserBadgesQueryVariables>) {
        return ApolloReactHooks.useQuery<UserBadgesQuery, UserBadgesQueryVariables>(UserBadgesDocument, baseOptions);
      }
export function useUserBadgesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserBadgesQuery, UserBadgesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UserBadgesQuery, UserBadgesQueryVariables>(UserBadgesDocument, baseOptions);
        }
export type UserBadgesQueryHookResult = ReturnType<typeof useUserBadgesQuery>;
export type UserBadgesLazyQueryHookResult = ReturnType<typeof useUserBadgesLazyQuery>;
export type UserBadgesQueryResult = ApolloReactCommon.QueryResult<UserBadgesQuery, UserBadgesQueryVariables>;
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
export function useSystemInfoQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SystemInfoQuery, SystemInfoQueryVariables>) {
        return ApolloReactHooks.useQuery<SystemInfoQuery, SystemInfoQueryVariables>(SystemInfoDocument, baseOptions);
      }
export function useSystemInfoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SystemInfoQuery, SystemInfoQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SystemInfoQuery, SystemInfoQueryVariables>(SystemInfoDocument, baseOptions);
        }
export type SystemInfoQueryHookResult = ReturnType<typeof useSystemInfoQuery>;
export type SystemInfoLazyQueryHookResult = ReturnType<typeof useSystemInfoLazyQuery>;
export type SystemInfoQueryResult = ApolloReactCommon.QueryResult<SystemInfoQuery, SystemInfoQueryVariables>;
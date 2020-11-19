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
  colony?: Maybe<Colony>;
  colonyAddress: Scalars['String'];
  color?: Maybe<Scalars['Int']>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  ethDomainId: Scalars['Int'];
  ethParentDomainId?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  name: Scalars['String'];
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

export type DomainFieldsFragment = Pick<Domain, 'id' | 'color' | 'description' | 'ethDomainId' | 'name' | 'ethParentDomainId'>;

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

export type SetColonyTokensMutationVariables = Exact<{
  input: SetColonyTokensInput;
}>;


export type SetColonyTokensMutation = { setColonyTokens?: Maybe<Pick<Colony, 'id' | 'tokenAddresses'>> };

export type CreateColonyMutationVariables = Exact<{
  input: CreateColonyInput;
}>;


export type CreateColonyMutation = { createColony?: Maybe<Pick<Colony, 'id' | 'colonyAddress' | 'colonyName' | 'avatarHash' | 'description' | 'displayName' | 'guideline' | 'website'>> };

export type EditColonyProfileMutationVariables = Exact<{
  input: EditColonyProfileInput;
}>;


export type EditColonyProfileMutation = { editColonyProfile?: Maybe<Pick<Colony, 'id' | 'colonyName' | 'avatarHash' | 'description' | 'displayName' | 'guideline' | 'website'>> };

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

export type CreateDomainMutationVariables = Exact<{
  input: CreateDomainInput;
}>;


export type CreateDomainMutation = { createDomain?: Maybe<Pick<Domain, 'id' | 'ethDomainId' | 'ethParentDomainId' | 'name'>> };

export type EditDomainMutationVariables = Exact<{
  input: EditDomainNameInput;
}>;


export type EditDomainMutation = { editDomainName?: Maybe<Pick<Domain, 'id' | 'ethDomainId' | 'ethParentDomainId' | 'name'>> };

export type CreateSuggestionMutationVariables = Exact<{
  input: CreateSuggestionInput;
}>;


export type CreateSuggestionMutation = { createSuggestion?: Maybe<SuggestionFieldsFragment> };

export type SetSuggestionStatusMutationVariables = Exact<{
  input: SetSuggestionStatusInput;
}>;


export type SetSuggestionStatusMutation = { setSuggestionStatus?: Maybe<Pick<Suggestion, 'id' | 'status' | 'taskId'>> };

export type AddUpvoteToSuggestionMutationVariables = Exact<{
  input: AddUpvoteToSuggestionInput;
}>;


export type AddUpvoteToSuggestionMutation = { addUpvoteToSuggestion?: Maybe<Pick<Suggestion, 'id' | 'upvotes'>> };

export type RemoveUpvoteFromSuggestionMutationVariables = Exact<{
  input: RemoveUpvoteFromSuggestionInput;
}>;


export type RemoveUpvoteFromSuggestionMutation = { removeUpvoteFromSuggestion?: Maybe<Pick<Suggestion, 'id' | 'upvotes'>> };

export type CreateTaskFromSuggestionMutationVariables = Exact<{
  input: CreateTaskFromSuggestionInput;
}>;


export type CreateTaskFromSuggestionMutation = { createTaskFromSuggestion?: Maybe<CreateTaskFieldsFragment> };

export type CreateProgramMutationVariables = Exact<{
  input: CreateProgramInput;
}>;


export type CreateProgramMutation = { createProgram?: Maybe<ProgramFieldsFragment> };

export type EditProgramMutationVariables = Exact<{
  input: EditProgramInput;
}>;


export type EditProgramMutation = { editProgram?: Maybe<Pick<Program, 'id' | 'description' | 'title'>> };

export type RemoveProgramMutationVariables = Exact<{
  input: RemoveProgramInput;
}>;


export type RemoveProgramMutation = { removeProgram?: Maybe<Pick<Program, 'id' | 'status'>> };

export type PublishProgramMutationVariables = Exact<{
  input: PublishProgramInput;
}>;


export type PublishProgramMutation = { publishProgram?: Maybe<Pick<Program, 'id' | 'status'>> };

export type EnrollInProgramMutationVariables = Exact<{
  input: EnrollInProgramInput;
}>;


export type EnrollInProgramMutation = { enrollInProgram?: Maybe<(
    Pick<Program, 'id' | 'enrolled' | 'enrolledUserAddresses'>
    & { levels: Array<Pick<Level, 'id' | 'unlocked'>> }
  )> };

export type CreateLevelMutationVariables = Exact<{
  input: CreateLevelInput;
}>;


export type CreateLevelMutation = { createLevel?: Maybe<(
    Pick<Level, 'unlocked'>
    & LevelFieldsFragment
  )> };

export type EditLevelMutationVariables = Exact<{
  input: EditLevelInput;
}>;


export type EditLevelMutation = { editLevel?: Maybe<LevelFieldsFragment> };

export type RemoveLevelMutationVariables = Exact<{
  input: RemoveLevelInput;
}>;


export type RemoveLevelMutation = { removeLevel?: Maybe<Pick<Level, 'id' | 'status'>> };

export type ReorderProgramLevelsMutationVariables = Exact<{
  input: ReorderProgramLevelsInput;
}>;


export type ReorderProgramLevelsMutation = { reorderProgramLevels?: Maybe<(
    Pick<Program, 'id' | 'levelIds'>
    & { levels: Array<Pick<Level, 'id'>> }
  )> };

export type CreateLevelTaskMutationVariables = Exact<{
  input: CreateLevelTaskInput;
}>;


export type CreateLevelTaskMutation = { createLevelTask?: Maybe<PersistentTaskFieldsFragment> };

export type RemoveLevelTaskMutationVariables = Exact<{
  input: RemoveLevelTaskInput;
}>;


export type RemoveLevelTaskMutation = { removeLevelTask?: Maybe<Pick<PersistentTask, 'id' | 'status'>> };

export type EditPersistentTaskMutationVariables = Exact<{
  input: EditPersistentTaskInput;
}>;


export type EditPersistentTaskMutation = { editPersistentTask?: Maybe<(
    Pick<PersistentTask, 'id' | 'description' | 'ethDomainId' | 'ethSkillId' | 'title'>
    & PersistentTaskPayoutsFragment
  )> };

export type CreateLevelTaskSubmissionMutationVariables = Exact<{
  input: CreateLevelTaskSubmissionInput;
}>;


export type CreateLevelTaskSubmissionMutation = { createLevelTaskSubmission?: Maybe<Pick<Submission, 'id' | 'status' | 'submission'>> };

export type EditSubmissionMutationVariables = Exact<{
  input: EditSubmissionInput;
}>;


export type EditSubmissionMutation = { editSubmission?: Maybe<Pick<Submission, 'id' | 'status' | 'submission'>> };

export type AcceptLevelTaskSubmissionMutationVariables = Exact<{
  input: AcceptLevelTaskSubmissionInput;
}>;


export type AcceptLevelTaskSubmissionMutation = { acceptLevelTaskSubmission?: Maybe<Pick<Submission, 'id' | 'status'>> };

export type TaskQueryVariables = Exact<{
  id: Scalars['String'];
}>;


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
    )>, colony: (
      Pick<Colony, 'id' | 'nativeTokenAddress' | 'tokenAddresses'>
      & { subscribedUsers: Array<(
        Pick<User, 'id'>
        & { profile: Pick<UserProfile, 'displayName' | 'walletAddress' | 'username' | 'avatarHash'> }
      )>, tokens: Array<Pick<Token, 'id' | 'address' | 'decimals' | 'name' | 'symbol'>> }
    ) }
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
      )>, colony: Pick<Colony, 'id' | 'colonyName' | 'displayName' | 'nativeTokenAddress'>, events: Array<Pick<Event, 'id' | 'type'>> }
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

export type ColonyFromNameQueryVariables = Exact<{
  name: Scalars['String'];
  address: Scalars['String'];
}>;


export type ColonyFromNameQuery = (
  Pick<Query, 'colonyAddress'>
  & { colony: FullColonyFragment }
);

export type ColonyNameQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ColonyNameQuery = Pick<Query, 'colonyName'>;

export type ColonyAddressQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type ColonyAddressQuery = Pick<Query, 'colonyAddress'>;

export type ColonyQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ColonyQuery = { colony: FullColonyFragment };

export type ColonyTokensQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ColonyTokensQuery = { colony: (
    Pick<Colony, 'id'>
    & TokensFragment
  ) };

export type ColonyNativeTokenQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ColonyNativeTokenQuery = { colony: Pick<Colony, 'id' | 'nativeTokenAddress'> };

export type ColonyRolesQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ColonyRolesQuery = { colony: (
    Pick<Colony, 'id' | 'colonyAddress'>
    & { roles: Array<(
      Pick<UserRoles, 'address'>
      & { domains: Array<Pick<DomainRoles, 'domainId' | 'roles'>> }
    )> }
  ) };

export type ColonyTransfersQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ColonyTransfersQuery = { colony: (
    Pick<Colony, 'id' | 'colonyAddress'>
    & { transfers: Array<Pick<Transfer, 'amount' | 'hash' | 'colonyAddress' | 'date' | 'from' | 'incoming' | 'to' | 'token'>>, unclaimedTransfers: Array<Pick<Transfer, 'amount' | 'hash' | 'colonyAddress' | 'date' | 'from' | 'incoming' | 'to' | 'token'>> }
  ) };

export type TokenBalancesForDomainsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  tokenAddresses: Array<Scalars['String']>;
  domainIds?: Maybe<Array<Scalars['Int']>>;
}>;


export type TokenBalancesForDomainsQuery = { tokens: Array<(
    Pick<Token, 'id' | 'address' | 'iconHash' | 'decimals' | 'name' | 'symbol'>
    & { balances: Array<Pick<DomainBalance, 'domainId' | 'amount'>> }
  )> };

export type ColonyProfileQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ColonyProfileQuery = { colony: ColonyProfileFragment };

export type UserColoniesQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type UserColoniesQuery = { user: (
    Pick<User, 'id' | 'colonyAddresses'>
    & { colonies: Array<Pick<Colony, 'id' | 'avatarHash' | 'colonyAddress' | 'colonyName' | 'displayName'>> }
  ) };

export type UserColonyAddressesQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type UserColonyAddressesQuery = { user: Pick<User, 'id' | 'colonyAddresses'> };

export type ColonyTasksQueryVariables = Exact<{
  address: Scalars['String'];
}>;


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

export type ColonyProgramsQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type ColonyProgramsQuery = { colony: (
    Pick<Colony, 'id'>
    & { programs: Array<ProgramFieldsFragment> }
  ) };

export type ProgramQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ProgramQuery = { program: ProgramFieldsFragment };

export type ProgramLevelsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ProgramLevelsQuery = { program: (
    Pick<Program, 'id' | 'levelIds'>
    & { levels: Array<LevelFieldsFragment> }
  ) };

export type LevelQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type LevelQuery = { level: (
    Pick<Level, 'unlocked'>
    & LevelFieldsFragment
  ) };

export type ProgramLevelsWithUnlockedQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ProgramLevelsWithUnlockedQuery = { program: (
    Pick<Program, 'id' | 'levelIds'>
    & { levels: Array<(
      Pick<Level, 'unlocked'>
      & LevelFieldsFragment
    )> }
  ) };

export type ProgramSubmissionsQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type ProgramSubmissionsQuery = { program: (
    Pick<Program, 'id'>
    & { submissions: Array<ProgramSubmissionFieldsFragment> }
  ) };

export type ColonySubscribedUsersQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type ColonySubscribedUsersQuery = { colony: (
    Pick<Colony, 'id'>
    & { subscribedUsers: Array<(
      Pick<User, 'id'>
      & { profile: Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'> }
    )> }
  ) };

export type DomainQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
  ethDomainId: Scalars['Int'];
}>;


export type DomainQuery = { domain: Pick<Domain, 'id' | 'ethDomainId' | 'name' | 'ethParentDomainId'> };

export type TokenQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type TokenQuery = { token: Pick<Token, 'id' | 'address' | 'iconHash' | 'decimals' | 'name' | 'symbol'> };

export type TokenInfoQueryVariables = Exact<{
  address: Scalars['String'];
}>;


export type TokenInfoQuery = { tokenInfo: Pick<TokenInfo, 'decimals' | 'name' | 'symbol' | 'iconHash'> };

export type ColonyDomainsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type ColonyDomainsQuery = { colony: (
    Pick<Colony, 'id'>
    & { domains: Array<DomainFieldsFragment> }
  ) };

export type ColonySuggestionsQueryVariables = Exact<{
  colonyAddress: Scalars['String'];
}>;


export type ColonySuggestionsQuery = { colony: (
    Pick<Colony, 'id'>
    & { suggestions: Array<SuggestionFieldsFragment> }
  ) };

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

export type UserBadgesQueryVariables = Exact<{
  address: Scalars['String'];
  colonyAddress: Scalars['String'];
}>;


export type UserBadgesQuery = { user: (
    Pick<User, 'id'>
    & { completedLevels: Array<(
      Pick<Level, 'id' | 'achievement' | 'title'>
      & { program: Pick<Program, 'title'> }
    )> }
  ) };

export type SystemInfoQueryVariables = Exact<{ [key: string]: never; }>;


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
  color @client
  description @client
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
export const SetColonyTokensDocument = gql`
    mutation SetColonyTokens($input: SetColonyTokensInput!) {
  setColonyTokens(input: $input) {
    id
    tokenAddresses
  }
}
    `;
export type SetColonyTokensMutationFn = Apollo.MutationFunction<SetColonyTokensMutation, SetColonyTokensMutationVariables>;

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
export function useSetColonyTokensMutation(baseOptions?: Apollo.MutationHookOptions<SetColonyTokensMutation, SetColonyTokensMutationVariables>) {
        return Apollo.useMutation<SetColonyTokensMutation, SetColonyTokensMutationVariables>(SetColonyTokensDocument, baseOptions);
      }
export type SetColonyTokensMutationHookResult = ReturnType<typeof useSetColonyTokensMutation>;
export type SetColonyTokensMutationResult = Apollo.MutationResult<SetColonyTokensMutation>;
export type SetColonyTokensMutationOptions = Apollo.BaseMutationOptions<SetColonyTokensMutation, SetColonyTokensMutationVariables>;
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
export type CreateColonyMutationFn = Apollo.MutationFunction<CreateColonyMutation, CreateColonyMutationVariables>;

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
export function useCreateColonyMutation(baseOptions?: Apollo.MutationHookOptions<CreateColonyMutation, CreateColonyMutationVariables>) {
        return Apollo.useMutation<CreateColonyMutation, CreateColonyMutationVariables>(CreateColonyDocument, baseOptions);
      }
export type CreateColonyMutationHookResult = ReturnType<typeof useCreateColonyMutation>;
export type CreateColonyMutationResult = Apollo.MutationResult<CreateColonyMutation>;
export type CreateColonyMutationOptions = Apollo.BaseMutationOptions<CreateColonyMutation, CreateColonyMutationVariables>;
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
export type EditColonyProfileMutationFn = Apollo.MutationFunction<EditColonyProfileMutation, EditColonyProfileMutationVariables>;

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
export function useEditColonyProfileMutation(baseOptions?: Apollo.MutationHookOptions<EditColonyProfileMutation, EditColonyProfileMutationVariables>) {
        return Apollo.useMutation<EditColonyProfileMutation, EditColonyProfileMutationVariables>(EditColonyProfileDocument, baseOptions);
      }
export type EditColonyProfileMutationHookResult = ReturnType<typeof useEditColonyProfileMutation>;
export type EditColonyProfileMutationResult = Apollo.MutationResult<EditColonyProfileMutation>;
export type EditColonyProfileMutationOptions = Apollo.BaseMutationOptions<EditColonyProfileMutation, EditColonyProfileMutationVariables>;
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
export type CreateDomainMutationFn = Apollo.MutationFunction<CreateDomainMutation, CreateDomainMutationVariables>;

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
export function useCreateDomainMutation(baseOptions?: Apollo.MutationHookOptions<CreateDomainMutation, CreateDomainMutationVariables>) {
        return Apollo.useMutation<CreateDomainMutation, CreateDomainMutationVariables>(CreateDomainDocument, baseOptions);
      }
export type CreateDomainMutationHookResult = ReturnType<typeof useCreateDomainMutation>;
export type CreateDomainMutationResult = Apollo.MutationResult<CreateDomainMutation>;
export type CreateDomainMutationOptions = Apollo.BaseMutationOptions<CreateDomainMutation, CreateDomainMutationVariables>;
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
export type EditDomainMutationFn = Apollo.MutationFunction<EditDomainMutation, EditDomainMutationVariables>;

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
export function useEditDomainMutation(baseOptions?: Apollo.MutationHookOptions<EditDomainMutation, EditDomainMutationVariables>) {
        return Apollo.useMutation<EditDomainMutation, EditDomainMutationVariables>(EditDomainDocument, baseOptions);
      }
export type EditDomainMutationHookResult = ReturnType<typeof useEditDomainMutation>;
export type EditDomainMutationResult = Apollo.MutationResult<EditDomainMutation>;
export type EditDomainMutationOptions = Apollo.BaseMutationOptions<EditDomainMutation, EditDomainMutationVariables>;
export const CreateSuggestionDocument = gql`
    mutation CreateSuggestion($input: CreateSuggestionInput!) {
  createSuggestion(input: $input) {
    ...SuggestionFields
  }
}
    ${SuggestionFieldsFragmentDoc}`;
export type CreateSuggestionMutationFn = Apollo.MutationFunction<CreateSuggestionMutation, CreateSuggestionMutationVariables>;

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
export function useCreateSuggestionMutation(baseOptions?: Apollo.MutationHookOptions<CreateSuggestionMutation, CreateSuggestionMutationVariables>) {
        return Apollo.useMutation<CreateSuggestionMutation, CreateSuggestionMutationVariables>(CreateSuggestionDocument, baseOptions);
      }
export type CreateSuggestionMutationHookResult = ReturnType<typeof useCreateSuggestionMutation>;
export type CreateSuggestionMutationResult = Apollo.MutationResult<CreateSuggestionMutation>;
export type CreateSuggestionMutationOptions = Apollo.BaseMutationOptions<CreateSuggestionMutation, CreateSuggestionMutationVariables>;
export const SetSuggestionStatusDocument = gql`
    mutation SetSuggestionStatus($input: SetSuggestionStatusInput!) {
  setSuggestionStatus(input: $input) {
    id
    status
    taskId
  }
}
    `;
export type SetSuggestionStatusMutationFn = Apollo.MutationFunction<SetSuggestionStatusMutation, SetSuggestionStatusMutationVariables>;

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
export function useSetSuggestionStatusMutation(baseOptions?: Apollo.MutationHookOptions<SetSuggestionStatusMutation, SetSuggestionStatusMutationVariables>) {
        return Apollo.useMutation<SetSuggestionStatusMutation, SetSuggestionStatusMutationVariables>(SetSuggestionStatusDocument, baseOptions);
      }
export type SetSuggestionStatusMutationHookResult = ReturnType<typeof useSetSuggestionStatusMutation>;
export type SetSuggestionStatusMutationResult = Apollo.MutationResult<SetSuggestionStatusMutation>;
export type SetSuggestionStatusMutationOptions = Apollo.BaseMutationOptions<SetSuggestionStatusMutation, SetSuggestionStatusMutationVariables>;
export const AddUpvoteToSuggestionDocument = gql`
    mutation AddUpvoteToSuggestion($input: AddUpvoteToSuggestionInput!) {
  addUpvoteToSuggestion(input: $input) {
    id
    upvotes
  }
}
    `;
export type AddUpvoteToSuggestionMutationFn = Apollo.MutationFunction<AddUpvoteToSuggestionMutation, AddUpvoteToSuggestionMutationVariables>;

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
export function useAddUpvoteToSuggestionMutation(baseOptions?: Apollo.MutationHookOptions<AddUpvoteToSuggestionMutation, AddUpvoteToSuggestionMutationVariables>) {
        return Apollo.useMutation<AddUpvoteToSuggestionMutation, AddUpvoteToSuggestionMutationVariables>(AddUpvoteToSuggestionDocument, baseOptions);
      }
export type AddUpvoteToSuggestionMutationHookResult = ReturnType<typeof useAddUpvoteToSuggestionMutation>;
export type AddUpvoteToSuggestionMutationResult = Apollo.MutationResult<AddUpvoteToSuggestionMutation>;
export type AddUpvoteToSuggestionMutationOptions = Apollo.BaseMutationOptions<AddUpvoteToSuggestionMutation, AddUpvoteToSuggestionMutationVariables>;
export const RemoveUpvoteFromSuggestionDocument = gql`
    mutation RemoveUpvoteFromSuggestion($input: RemoveUpvoteFromSuggestionInput!) {
  removeUpvoteFromSuggestion(input: $input) {
    id
    upvotes
  }
}
    `;
export type RemoveUpvoteFromSuggestionMutationFn = Apollo.MutationFunction<RemoveUpvoteFromSuggestionMutation, RemoveUpvoteFromSuggestionMutationVariables>;

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
export function useRemoveUpvoteFromSuggestionMutation(baseOptions?: Apollo.MutationHookOptions<RemoveUpvoteFromSuggestionMutation, RemoveUpvoteFromSuggestionMutationVariables>) {
        return Apollo.useMutation<RemoveUpvoteFromSuggestionMutation, RemoveUpvoteFromSuggestionMutationVariables>(RemoveUpvoteFromSuggestionDocument, baseOptions);
      }
export type RemoveUpvoteFromSuggestionMutationHookResult = ReturnType<typeof useRemoveUpvoteFromSuggestionMutation>;
export type RemoveUpvoteFromSuggestionMutationResult = Apollo.MutationResult<RemoveUpvoteFromSuggestionMutation>;
export type RemoveUpvoteFromSuggestionMutationOptions = Apollo.BaseMutationOptions<RemoveUpvoteFromSuggestionMutation, RemoveUpvoteFromSuggestionMutationVariables>;
export const CreateTaskFromSuggestionDocument = gql`
    mutation CreateTaskFromSuggestion($input: CreateTaskFromSuggestionInput!) {
  createTaskFromSuggestion(input: $input) {
    ...CreateTaskFields
  }
}
    ${CreateTaskFieldsFragmentDoc}`;
export type CreateTaskFromSuggestionMutationFn = Apollo.MutationFunction<CreateTaskFromSuggestionMutation, CreateTaskFromSuggestionMutationVariables>;

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
export function useCreateTaskFromSuggestionMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaskFromSuggestionMutation, CreateTaskFromSuggestionMutationVariables>) {
        return Apollo.useMutation<CreateTaskFromSuggestionMutation, CreateTaskFromSuggestionMutationVariables>(CreateTaskFromSuggestionDocument, baseOptions);
      }
export type CreateTaskFromSuggestionMutationHookResult = ReturnType<typeof useCreateTaskFromSuggestionMutation>;
export type CreateTaskFromSuggestionMutationResult = Apollo.MutationResult<CreateTaskFromSuggestionMutation>;
export type CreateTaskFromSuggestionMutationOptions = Apollo.BaseMutationOptions<CreateTaskFromSuggestionMutation, CreateTaskFromSuggestionMutationVariables>;
export const CreateProgramDocument = gql`
    mutation CreateProgram($input: CreateProgramInput!) {
  createProgram(input: $input) {
    ...ProgramFields
  }
}
    ${ProgramFieldsFragmentDoc}`;
export type CreateProgramMutationFn = Apollo.MutationFunction<CreateProgramMutation, CreateProgramMutationVariables>;

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
export function useCreateProgramMutation(baseOptions?: Apollo.MutationHookOptions<CreateProgramMutation, CreateProgramMutationVariables>) {
        return Apollo.useMutation<CreateProgramMutation, CreateProgramMutationVariables>(CreateProgramDocument, baseOptions);
      }
export type CreateProgramMutationHookResult = ReturnType<typeof useCreateProgramMutation>;
export type CreateProgramMutationResult = Apollo.MutationResult<CreateProgramMutation>;
export type CreateProgramMutationOptions = Apollo.BaseMutationOptions<CreateProgramMutation, CreateProgramMutationVariables>;
export const EditProgramDocument = gql`
    mutation EditProgram($input: EditProgramInput!) {
  editProgram(input: $input) {
    id
    description
    title
  }
}
    `;
export type EditProgramMutationFn = Apollo.MutationFunction<EditProgramMutation, EditProgramMutationVariables>;

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
export function useEditProgramMutation(baseOptions?: Apollo.MutationHookOptions<EditProgramMutation, EditProgramMutationVariables>) {
        return Apollo.useMutation<EditProgramMutation, EditProgramMutationVariables>(EditProgramDocument, baseOptions);
      }
export type EditProgramMutationHookResult = ReturnType<typeof useEditProgramMutation>;
export type EditProgramMutationResult = Apollo.MutationResult<EditProgramMutation>;
export type EditProgramMutationOptions = Apollo.BaseMutationOptions<EditProgramMutation, EditProgramMutationVariables>;
export const RemoveProgramDocument = gql`
    mutation RemoveProgram($input: RemoveProgramInput!) {
  removeProgram(input: $input) {
    id
    status
  }
}
    `;
export type RemoveProgramMutationFn = Apollo.MutationFunction<RemoveProgramMutation, RemoveProgramMutationVariables>;

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
export function useRemoveProgramMutation(baseOptions?: Apollo.MutationHookOptions<RemoveProgramMutation, RemoveProgramMutationVariables>) {
        return Apollo.useMutation<RemoveProgramMutation, RemoveProgramMutationVariables>(RemoveProgramDocument, baseOptions);
      }
export type RemoveProgramMutationHookResult = ReturnType<typeof useRemoveProgramMutation>;
export type RemoveProgramMutationResult = Apollo.MutationResult<RemoveProgramMutation>;
export type RemoveProgramMutationOptions = Apollo.BaseMutationOptions<RemoveProgramMutation, RemoveProgramMutationVariables>;
export const PublishProgramDocument = gql`
    mutation PublishProgram($input: PublishProgramInput!) {
  publishProgram(input: $input) {
    id
    status
  }
}
    `;
export type PublishProgramMutationFn = Apollo.MutationFunction<PublishProgramMutation, PublishProgramMutationVariables>;

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
export function usePublishProgramMutation(baseOptions?: Apollo.MutationHookOptions<PublishProgramMutation, PublishProgramMutationVariables>) {
        return Apollo.useMutation<PublishProgramMutation, PublishProgramMutationVariables>(PublishProgramDocument, baseOptions);
      }
export type PublishProgramMutationHookResult = ReturnType<typeof usePublishProgramMutation>;
export type PublishProgramMutationResult = Apollo.MutationResult<PublishProgramMutation>;
export type PublishProgramMutationOptions = Apollo.BaseMutationOptions<PublishProgramMutation, PublishProgramMutationVariables>;
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
export type EnrollInProgramMutationFn = Apollo.MutationFunction<EnrollInProgramMutation, EnrollInProgramMutationVariables>;

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
export function useEnrollInProgramMutation(baseOptions?: Apollo.MutationHookOptions<EnrollInProgramMutation, EnrollInProgramMutationVariables>) {
        return Apollo.useMutation<EnrollInProgramMutation, EnrollInProgramMutationVariables>(EnrollInProgramDocument, baseOptions);
      }
export type EnrollInProgramMutationHookResult = ReturnType<typeof useEnrollInProgramMutation>;
export type EnrollInProgramMutationResult = Apollo.MutationResult<EnrollInProgramMutation>;
export type EnrollInProgramMutationOptions = Apollo.BaseMutationOptions<EnrollInProgramMutation, EnrollInProgramMutationVariables>;
export const CreateLevelDocument = gql`
    mutation CreateLevel($input: CreateLevelInput!) {
  createLevel(input: $input) {
    ...LevelFields
    unlocked
  }
}
    ${LevelFieldsFragmentDoc}`;
export type CreateLevelMutationFn = Apollo.MutationFunction<CreateLevelMutation, CreateLevelMutationVariables>;

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
export function useCreateLevelMutation(baseOptions?: Apollo.MutationHookOptions<CreateLevelMutation, CreateLevelMutationVariables>) {
        return Apollo.useMutation<CreateLevelMutation, CreateLevelMutationVariables>(CreateLevelDocument, baseOptions);
      }
export type CreateLevelMutationHookResult = ReturnType<typeof useCreateLevelMutation>;
export type CreateLevelMutationResult = Apollo.MutationResult<CreateLevelMutation>;
export type CreateLevelMutationOptions = Apollo.BaseMutationOptions<CreateLevelMutation, CreateLevelMutationVariables>;
export const EditLevelDocument = gql`
    mutation EditLevel($input: EditLevelInput!) {
  editLevel(input: $input) {
    ...LevelFields
  }
}
    ${LevelFieldsFragmentDoc}`;
export type EditLevelMutationFn = Apollo.MutationFunction<EditLevelMutation, EditLevelMutationVariables>;

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
export function useEditLevelMutation(baseOptions?: Apollo.MutationHookOptions<EditLevelMutation, EditLevelMutationVariables>) {
        return Apollo.useMutation<EditLevelMutation, EditLevelMutationVariables>(EditLevelDocument, baseOptions);
      }
export type EditLevelMutationHookResult = ReturnType<typeof useEditLevelMutation>;
export type EditLevelMutationResult = Apollo.MutationResult<EditLevelMutation>;
export type EditLevelMutationOptions = Apollo.BaseMutationOptions<EditLevelMutation, EditLevelMutationVariables>;
export const RemoveLevelDocument = gql`
    mutation RemoveLevel($input: RemoveLevelInput!) {
  removeLevel(input: $input) {
    id
    status
  }
}
    `;
export type RemoveLevelMutationFn = Apollo.MutationFunction<RemoveLevelMutation, RemoveLevelMutationVariables>;

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
export function useRemoveLevelMutation(baseOptions?: Apollo.MutationHookOptions<RemoveLevelMutation, RemoveLevelMutationVariables>) {
        return Apollo.useMutation<RemoveLevelMutation, RemoveLevelMutationVariables>(RemoveLevelDocument, baseOptions);
      }
export type RemoveLevelMutationHookResult = ReturnType<typeof useRemoveLevelMutation>;
export type RemoveLevelMutationResult = Apollo.MutationResult<RemoveLevelMutation>;
export type RemoveLevelMutationOptions = Apollo.BaseMutationOptions<RemoveLevelMutation, RemoveLevelMutationVariables>;
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
export type ReorderProgramLevelsMutationFn = Apollo.MutationFunction<ReorderProgramLevelsMutation, ReorderProgramLevelsMutationVariables>;

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
export function useReorderProgramLevelsMutation(baseOptions?: Apollo.MutationHookOptions<ReorderProgramLevelsMutation, ReorderProgramLevelsMutationVariables>) {
        return Apollo.useMutation<ReorderProgramLevelsMutation, ReorderProgramLevelsMutationVariables>(ReorderProgramLevelsDocument, baseOptions);
      }
export type ReorderProgramLevelsMutationHookResult = ReturnType<typeof useReorderProgramLevelsMutation>;
export type ReorderProgramLevelsMutationResult = Apollo.MutationResult<ReorderProgramLevelsMutation>;
export type ReorderProgramLevelsMutationOptions = Apollo.BaseMutationOptions<ReorderProgramLevelsMutation, ReorderProgramLevelsMutationVariables>;
export const CreateLevelTaskDocument = gql`
    mutation CreateLevelTask($input: CreateLevelTaskInput!) {
  createLevelTask(input: $input) {
    ...PersistentTaskFields
  }
}
    ${PersistentTaskFieldsFragmentDoc}`;
export type CreateLevelTaskMutationFn = Apollo.MutationFunction<CreateLevelTaskMutation, CreateLevelTaskMutationVariables>;

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
export function useCreateLevelTaskMutation(baseOptions?: Apollo.MutationHookOptions<CreateLevelTaskMutation, CreateLevelTaskMutationVariables>) {
        return Apollo.useMutation<CreateLevelTaskMutation, CreateLevelTaskMutationVariables>(CreateLevelTaskDocument, baseOptions);
      }
export type CreateLevelTaskMutationHookResult = ReturnType<typeof useCreateLevelTaskMutation>;
export type CreateLevelTaskMutationResult = Apollo.MutationResult<CreateLevelTaskMutation>;
export type CreateLevelTaskMutationOptions = Apollo.BaseMutationOptions<CreateLevelTaskMutation, CreateLevelTaskMutationVariables>;
export const RemoveLevelTaskDocument = gql`
    mutation RemoveLevelTask($input: RemoveLevelTaskInput!) {
  removeLevelTask(input: $input) {
    id
    status
  }
}
    `;
export type RemoveLevelTaskMutationFn = Apollo.MutationFunction<RemoveLevelTaskMutation, RemoveLevelTaskMutationVariables>;

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
export function useRemoveLevelTaskMutation(baseOptions?: Apollo.MutationHookOptions<RemoveLevelTaskMutation, RemoveLevelTaskMutationVariables>) {
        return Apollo.useMutation<RemoveLevelTaskMutation, RemoveLevelTaskMutationVariables>(RemoveLevelTaskDocument, baseOptions);
      }
export type RemoveLevelTaskMutationHookResult = ReturnType<typeof useRemoveLevelTaskMutation>;
export type RemoveLevelTaskMutationResult = Apollo.MutationResult<RemoveLevelTaskMutation>;
export type RemoveLevelTaskMutationOptions = Apollo.BaseMutationOptions<RemoveLevelTaskMutation, RemoveLevelTaskMutationVariables>;
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
export type EditPersistentTaskMutationFn = Apollo.MutationFunction<EditPersistentTaskMutation, EditPersistentTaskMutationVariables>;

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
export function useEditPersistentTaskMutation(baseOptions?: Apollo.MutationHookOptions<EditPersistentTaskMutation, EditPersistentTaskMutationVariables>) {
        return Apollo.useMutation<EditPersistentTaskMutation, EditPersistentTaskMutationVariables>(EditPersistentTaskDocument, baseOptions);
      }
export type EditPersistentTaskMutationHookResult = ReturnType<typeof useEditPersistentTaskMutation>;
export type EditPersistentTaskMutationResult = Apollo.MutationResult<EditPersistentTaskMutation>;
export type EditPersistentTaskMutationOptions = Apollo.BaseMutationOptions<EditPersistentTaskMutation, EditPersistentTaskMutationVariables>;
export const CreateLevelTaskSubmissionDocument = gql`
    mutation CreateLevelTaskSubmission($input: CreateLevelTaskSubmissionInput!) {
  createLevelTaskSubmission(input: $input) {
    id
    status
    submission
  }
}
    `;
export type CreateLevelTaskSubmissionMutationFn = Apollo.MutationFunction<CreateLevelTaskSubmissionMutation, CreateLevelTaskSubmissionMutationVariables>;

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
export function useCreateLevelTaskSubmissionMutation(baseOptions?: Apollo.MutationHookOptions<CreateLevelTaskSubmissionMutation, CreateLevelTaskSubmissionMutationVariables>) {
        return Apollo.useMutation<CreateLevelTaskSubmissionMutation, CreateLevelTaskSubmissionMutationVariables>(CreateLevelTaskSubmissionDocument, baseOptions);
      }
export type CreateLevelTaskSubmissionMutationHookResult = ReturnType<typeof useCreateLevelTaskSubmissionMutation>;
export type CreateLevelTaskSubmissionMutationResult = Apollo.MutationResult<CreateLevelTaskSubmissionMutation>;
export type CreateLevelTaskSubmissionMutationOptions = Apollo.BaseMutationOptions<CreateLevelTaskSubmissionMutation, CreateLevelTaskSubmissionMutationVariables>;
export const EditSubmissionDocument = gql`
    mutation EditSubmission($input: EditSubmissionInput!) {
  editSubmission(input: $input) {
    id
    status
    submission
  }
}
    `;
export type EditSubmissionMutationFn = Apollo.MutationFunction<EditSubmissionMutation, EditSubmissionMutationVariables>;

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
export function useEditSubmissionMutation(baseOptions?: Apollo.MutationHookOptions<EditSubmissionMutation, EditSubmissionMutationVariables>) {
        return Apollo.useMutation<EditSubmissionMutation, EditSubmissionMutationVariables>(EditSubmissionDocument, baseOptions);
      }
export type EditSubmissionMutationHookResult = ReturnType<typeof useEditSubmissionMutation>;
export type EditSubmissionMutationResult = Apollo.MutationResult<EditSubmissionMutation>;
export type EditSubmissionMutationOptions = Apollo.BaseMutationOptions<EditSubmissionMutation, EditSubmissionMutationVariables>;
export const AcceptLevelTaskSubmissionDocument = gql`
    mutation AcceptLevelTaskSubmission($input: AcceptLevelTaskSubmissionInput!) {
  acceptLevelTaskSubmission(input: $input) {
    id
    status
  }
}
    `;
export type AcceptLevelTaskSubmissionMutationFn = Apollo.MutationFunction<AcceptLevelTaskSubmissionMutation, AcceptLevelTaskSubmissionMutationVariables>;

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
export function useAcceptLevelTaskSubmissionMutation(baseOptions?: Apollo.MutationHookOptions<AcceptLevelTaskSubmissionMutation, AcceptLevelTaskSubmissionMutationVariables>) {
        return Apollo.useMutation<AcceptLevelTaskSubmissionMutation, AcceptLevelTaskSubmissionMutationVariables>(AcceptLevelTaskSubmissionDocument, baseOptions);
      }
export type AcceptLevelTaskSubmissionMutationHookResult = ReturnType<typeof useAcceptLevelTaskSubmissionMutation>;
export type AcceptLevelTaskSubmissionMutationResult = Apollo.MutationResult<AcceptLevelTaskSubmissionMutation>;
export type AcceptLevelTaskSubmissionMutationOptions = Apollo.BaseMutationOptions<AcceptLevelTaskSubmissionMutation, AcceptLevelTaskSubmissionMutationVariables>;
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
export function useColonyFromNameQuery(baseOptions?: Apollo.QueryHookOptions<ColonyFromNameQuery, ColonyFromNameQueryVariables>) {
        return Apollo.useQuery<ColonyFromNameQuery, ColonyFromNameQueryVariables>(ColonyFromNameDocument, baseOptions);
      }
export function useColonyFromNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyFromNameQuery, ColonyFromNameQueryVariables>) {
          return Apollo.useLazyQuery<ColonyFromNameQuery, ColonyFromNameQueryVariables>(ColonyFromNameDocument, baseOptions);
        }
export type ColonyFromNameQueryHookResult = ReturnType<typeof useColonyFromNameQuery>;
export type ColonyFromNameLazyQueryHookResult = ReturnType<typeof useColonyFromNameLazyQuery>;
export type ColonyFromNameQueryResult = Apollo.QueryResult<ColonyFromNameQuery, ColonyFromNameQueryVariables>;
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
export function useColonyQuery(baseOptions?: Apollo.QueryHookOptions<ColonyQuery, ColonyQueryVariables>) {
        return Apollo.useQuery<ColonyQuery, ColonyQueryVariables>(ColonyDocument, baseOptions);
      }
export function useColonyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyQuery, ColonyQueryVariables>) {
          return Apollo.useLazyQuery<ColonyQuery, ColonyQueryVariables>(ColonyDocument, baseOptions);
        }
export type ColonyQueryHookResult = ReturnType<typeof useColonyQuery>;
export type ColonyLazyQueryHookResult = ReturnType<typeof useColonyLazyQuery>;
export type ColonyQueryResult = Apollo.QueryResult<ColonyQuery, ColonyQueryVariables>;
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
export function useColonyTokensQuery(baseOptions?: Apollo.QueryHookOptions<ColonyTokensQuery, ColonyTokensQueryVariables>) {
        return Apollo.useQuery<ColonyTokensQuery, ColonyTokensQueryVariables>(ColonyTokensDocument, baseOptions);
      }
export function useColonyTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyTokensQuery, ColonyTokensQueryVariables>) {
          return Apollo.useLazyQuery<ColonyTokensQuery, ColonyTokensQueryVariables>(ColonyTokensDocument, baseOptions);
        }
export type ColonyTokensQueryHookResult = ReturnType<typeof useColonyTokensQuery>;
export type ColonyTokensLazyQueryHookResult = ReturnType<typeof useColonyTokensLazyQuery>;
export type ColonyTokensQueryResult = Apollo.QueryResult<ColonyTokensQuery, ColonyTokensQueryVariables>;
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
export function useColonyNativeTokenQuery(baseOptions?: Apollo.QueryHookOptions<ColonyNativeTokenQuery, ColonyNativeTokenQueryVariables>) {
        return Apollo.useQuery<ColonyNativeTokenQuery, ColonyNativeTokenQueryVariables>(ColonyNativeTokenDocument, baseOptions);
      }
export function useColonyNativeTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyNativeTokenQuery, ColonyNativeTokenQueryVariables>) {
          return Apollo.useLazyQuery<ColonyNativeTokenQuery, ColonyNativeTokenQueryVariables>(ColonyNativeTokenDocument, baseOptions);
        }
export type ColonyNativeTokenQueryHookResult = ReturnType<typeof useColonyNativeTokenQuery>;
export type ColonyNativeTokenLazyQueryHookResult = ReturnType<typeof useColonyNativeTokenLazyQuery>;
export type ColonyNativeTokenQueryResult = Apollo.QueryResult<ColonyNativeTokenQuery, ColonyNativeTokenQueryVariables>;
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
export function useColonyRolesQuery(baseOptions?: Apollo.QueryHookOptions<ColonyRolesQuery, ColonyRolesQueryVariables>) {
        return Apollo.useQuery<ColonyRolesQuery, ColonyRolesQueryVariables>(ColonyRolesDocument, baseOptions);
      }
export function useColonyRolesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyRolesQuery, ColonyRolesQueryVariables>) {
          return Apollo.useLazyQuery<ColonyRolesQuery, ColonyRolesQueryVariables>(ColonyRolesDocument, baseOptions);
        }
export type ColonyRolesQueryHookResult = ReturnType<typeof useColonyRolesQuery>;
export type ColonyRolesLazyQueryHookResult = ReturnType<typeof useColonyRolesLazyQuery>;
export type ColonyRolesQueryResult = Apollo.QueryResult<ColonyRolesQuery, ColonyRolesQueryVariables>;
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
export function useColonyTransfersQuery(baseOptions?: Apollo.QueryHookOptions<ColonyTransfersQuery, ColonyTransfersQueryVariables>) {
        return Apollo.useQuery<ColonyTransfersQuery, ColonyTransfersQueryVariables>(ColonyTransfersDocument, baseOptions);
      }
export function useColonyTransfersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyTransfersQuery, ColonyTransfersQueryVariables>) {
          return Apollo.useLazyQuery<ColonyTransfersQuery, ColonyTransfersQueryVariables>(ColonyTransfersDocument, baseOptions);
        }
export type ColonyTransfersQueryHookResult = ReturnType<typeof useColonyTransfersQuery>;
export type ColonyTransfersLazyQueryHookResult = ReturnType<typeof useColonyTransfersLazyQuery>;
export type ColonyTransfersQueryResult = Apollo.QueryResult<ColonyTransfersQuery, ColonyTransfersQueryVariables>;
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
export function useColonyProfileQuery(baseOptions?: Apollo.QueryHookOptions<ColonyProfileQuery, ColonyProfileQueryVariables>) {
        return Apollo.useQuery<ColonyProfileQuery, ColonyProfileQueryVariables>(ColonyProfileDocument, baseOptions);
      }
export function useColonyProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyProfileQuery, ColonyProfileQueryVariables>) {
          return Apollo.useLazyQuery<ColonyProfileQuery, ColonyProfileQueryVariables>(ColonyProfileDocument, baseOptions);
        }
export type ColonyProfileQueryHookResult = ReturnType<typeof useColonyProfileQuery>;
export type ColonyProfileLazyQueryHookResult = ReturnType<typeof useColonyProfileLazyQuery>;
export type ColonyProfileQueryResult = Apollo.QueryResult<ColonyProfileQuery, ColonyProfileQueryVariables>;
export const UserColoniesDocument = gql`
    query UserColonies($address: String!) {
  user(address: $address) {
    id
    colonies {
      id
      avatarHash
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
export function useColonyTasksQuery(baseOptions?: Apollo.QueryHookOptions<ColonyTasksQuery, ColonyTasksQueryVariables>) {
        return Apollo.useQuery<ColonyTasksQuery, ColonyTasksQueryVariables>(ColonyTasksDocument, baseOptions);
      }
export function useColonyTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyTasksQuery, ColonyTasksQueryVariables>) {
          return Apollo.useLazyQuery<ColonyTasksQuery, ColonyTasksQueryVariables>(ColonyTasksDocument, baseOptions);
        }
export type ColonyTasksQueryHookResult = ReturnType<typeof useColonyTasksQuery>;
export type ColonyTasksLazyQueryHookResult = ReturnType<typeof useColonyTasksLazyQuery>;
export type ColonyTasksQueryResult = Apollo.QueryResult<ColonyTasksQuery, ColonyTasksQueryVariables>;
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
export function useColonyProgramsQuery(baseOptions?: Apollo.QueryHookOptions<ColonyProgramsQuery, ColonyProgramsQueryVariables>) {
        return Apollo.useQuery<ColonyProgramsQuery, ColonyProgramsQueryVariables>(ColonyProgramsDocument, baseOptions);
      }
export function useColonyProgramsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonyProgramsQuery, ColonyProgramsQueryVariables>) {
          return Apollo.useLazyQuery<ColonyProgramsQuery, ColonyProgramsQueryVariables>(ColonyProgramsDocument, baseOptions);
        }
export type ColonyProgramsQueryHookResult = ReturnType<typeof useColonyProgramsQuery>;
export type ColonyProgramsLazyQueryHookResult = ReturnType<typeof useColonyProgramsLazyQuery>;
export type ColonyProgramsQueryResult = Apollo.QueryResult<ColonyProgramsQuery, ColonyProgramsQueryVariables>;
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
export function useProgramQuery(baseOptions?: Apollo.QueryHookOptions<ProgramQuery, ProgramQueryVariables>) {
        return Apollo.useQuery<ProgramQuery, ProgramQueryVariables>(ProgramDocument, baseOptions);
      }
export function useProgramLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProgramQuery, ProgramQueryVariables>) {
          return Apollo.useLazyQuery<ProgramQuery, ProgramQueryVariables>(ProgramDocument, baseOptions);
        }
export type ProgramQueryHookResult = ReturnType<typeof useProgramQuery>;
export type ProgramLazyQueryHookResult = ReturnType<typeof useProgramLazyQuery>;
export type ProgramQueryResult = Apollo.QueryResult<ProgramQuery, ProgramQueryVariables>;
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
export function useProgramLevelsQuery(baseOptions?: Apollo.QueryHookOptions<ProgramLevelsQuery, ProgramLevelsQueryVariables>) {
        return Apollo.useQuery<ProgramLevelsQuery, ProgramLevelsQueryVariables>(ProgramLevelsDocument, baseOptions);
      }
export function useProgramLevelsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProgramLevelsQuery, ProgramLevelsQueryVariables>) {
          return Apollo.useLazyQuery<ProgramLevelsQuery, ProgramLevelsQueryVariables>(ProgramLevelsDocument, baseOptions);
        }
export type ProgramLevelsQueryHookResult = ReturnType<typeof useProgramLevelsQuery>;
export type ProgramLevelsLazyQueryHookResult = ReturnType<typeof useProgramLevelsLazyQuery>;
export type ProgramLevelsQueryResult = Apollo.QueryResult<ProgramLevelsQuery, ProgramLevelsQueryVariables>;
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
export function useLevelQuery(baseOptions?: Apollo.QueryHookOptions<LevelQuery, LevelQueryVariables>) {
        return Apollo.useQuery<LevelQuery, LevelQueryVariables>(LevelDocument, baseOptions);
      }
export function useLevelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LevelQuery, LevelQueryVariables>) {
          return Apollo.useLazyQuery<LevelQuery, LevelQueryVariables>(LevelDocument, baseOptions);
        }
export type LevelQueryHookResult = ReturnType<typeof useLevelQuery>;
export type LevelLazyQueryHookResult = ReturnType<typeof useLevelLazyQuery>;
export type LevelQueryResult = Apollo.QueryResult<LevelQuery, LevelQueryVariables>;
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
export function useProgramLevelsWithUnlockedQuery(baseOptions?: Apollo.QueryHookOptions<ProgramLevelsWithUnlockedQuery, ProgramLevelsWithUnlockedQueryVariables>) {
        return Apollo.useQuery<ProgramLevelsWithUnlockedQuery, ProgramLevelsWithUnlockedQueryVariables>(ProgramLevelsWithUnlockedDocument, baseOptions);
      }
export function useProgramLevelsWithUnlockedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProgramLevelsWithUnlockedQuery, ProgramLevelsWithUnlockedQueryVariables>) {
          return Apollo.useLazyQuery<ProgramLevelsWithUnlockedQuery, ProgramLevelsWithUnlockedQueryVariables>(ProgramLevelsWithUnlockedDocument, baseOptions);
        }
export type ProgramLevelsWithUnlockedQueryHookResult = ReturnType<typeof useProgramLevelsWithUnlockedQuery>;
export type ProgramLevelsWithUnlockedLazyQueryHookResult = ReturnType<typeof useProgramLevelsWithUnlockedLazyQuery>;
export type ProgramLevelsWithUnlockedQueryResult = Apollo.QueryResult<ProgramLevelsWithUnlockedQuery, ProgramLevelsWithUnlockedQueryVariables>;
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
export function useProgramSubmissionsQuery(baseOptions?: Apollo.QueryHookOptions<ProgramSubmissionsQuery, ProgramSubmissionsQueryVariables>) {
        return Apollo.useQuery<ProgramSubmissionsQuery, ProgramSubmissionsQueryVariables>(ProgramSubmissionsDocument, baseOptions);
      }
export function useProgramSubmissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProgramSubmissionsQuery, ProgramSubmissionsQueryVariables>) {
          return Apollo.useLazyQuery<ProgramSubmissionsQuery, ProgramSubmissionsQueryVariables>(ProgramSubmissionsDocument, baseOptions);
        }
export type ProgramSubmissionsQueryHookResult = ReturnType<typeof useProgramSubmissionsQuery>;
export type ProgramSubmissionsLazyQueryHookResult = ReturnType<typeof useProgramSubmissionsLazyQuery>;
export type ProgramSubmissionsQueryResult = Apollo.QueryResult<ProgramSubmissionsQuery, ProgramSubmissionsQueryVariables>;
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
export function useColonySubscribedUsersQuery(baseOptions?: Apollo.QueryHookOptions<ColonySubscribedUsersQuery, ColonySubscribedUsersQueryVariables>) {
        return Apollo.useQuery<ColonySubscribedUsersQuery, ColonySubscribedUsersQueryVariables>(ColonySubscribedUsersDocument, baseOptions);
      }
export function useColonySubscribedUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonySubscribedUsersQuery, ColonySubscribedUsersQueryVariables>) {
          return Apollo.useLazyQuery<ColonySubscribedUsersQuery, ColonySubscribedUsersQueryVariables>(ColonySubscribedUsersDocument, baseOptions);
        }
export type ColonySubscribedUsersQueryHookResult = ReturnType<typeof useColonySubscribedUsersQuery>;
export type ColonySubscribedUsersLazyQueryHookResult = ReturnType<typeof useColonySubscribedUsersLazyQuery>;
export type ColonySubscribedUsersQueryResult = Apollo.QueryResult<ColonySubscribedUsersQuery, ColonySubscribedUsersQueryVariables>;
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
export function useDomainQuery(baseOptions?: Apollo.QueryHookOptions<DomainQuery, DomainQueryVariables>) {
        return Apollo.useQuery<DomainQuery, DomainQueryVariables>(DomainDocument, baseOptions);
      }
export function useDomainLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DomainQuery, DomainQueryVariables>) {
          return Apollo.useLazyQuery<DomainQuery, DomainQueryVariables>(DomainDocument, baseOptions);
        }
export type DomainQueryHookResult = ReturnType<typeof useDomainQuery>;
export type DomainLazyQueryHookResult = ReturnType<typeof useDomainLazyQuery>;
export type DomainQueryResult = Apollo.QueryResult<DomainQuery, DomainQueryVariables>;
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
export const ColonyDomainsDocument = gql`
    query ColonyDomains($colonyAddress: String!) {
  colony(address: $colonyAddress) {
    id
    domains {
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
export function useColonySuggestionsQuery(baseOptions?: Apollo.QueryHookOptions<ColonySuggestionsQuery, ColonySuggestionsQueryVariables>) {
        return Apollo.useQuery<ColonySuggestionsQuery, ColonySuggestionsQueryVariables>(ColonySuggestionsDocument, baseOptions);
      }
export function useColonySuggestionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColonySuggestionsQuery, ColonySuggestionsQueryVariables>) {
          return Apollo.useLazyQuery<ColonySuggestionsQuery, ColonySuggestionsQueryVariables>(ColonySuggestionsDocument, baseOptions);
        }
export type ColonySuggestionsQueryHookResult = ReturnType<typeof useColonySuggestionsQuery>;
export type ColonySuggestionsLazyQueryHookResult = ReturnType<typeof useColonySuggestionsLazyQuery>;
export type ColonySuggestionsQueryResult = Apollo.QueryResult<ColonySuggestionsQuery, ColonySuggestionsQueryVariables>;
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
export function useUserBadgesQuery(baseOptions?: Apollo.QueryHookOptions<UserBadgesQuery, UserBadgesQueryVariables>) {
        return Apollo.useQuery<UserBadgesQuery, UserBadgesQueryVariables>(UserBadgesDocument, baseOptions);
      }
export function useUserBadgesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserBadgesQuery, UserBadgesQueryVariables>) {
          return Apollo.useLazyQuery<UserBadgesQuery, UserBadgesQueryVariables>(UserBadgesDocument, baseOptions);
        }
export type UserBadgesQueryHookResult = ReturnType<typeof useUserBadgesQuery>;
export type UserBadgesLazyQueryHookResult = ReturnType<typeof useUserBadgesLazyQuery>;
export type UserBadgesQueryResult = Apollo.QueryResult<UserBadgesQuery, UserBadgesQueryVariables>;
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
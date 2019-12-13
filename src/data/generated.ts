import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
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


export type AddColonyTokenReferenceInput = {
  tokenAddress: Scalars['String'],
  colonyAddress: Scalars['String'],
  isExternal: Scalars['Boolean'],
  iconHash?: Maybe<Scalars['String']>,
};

export type AddUserTokenReferenceInput = {
  tokenAddress: Scalars['String'],
  iconHash?: Maybe<Scalars['String']>,
};

export type AssignWorkerEvent = TaskEvent & {
  type: Scalars['String'],
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
  type: Scalars['String'],
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
  subscribedUsers: Array<User>,
  tokens: Array<ColonyToken>,
  tokenRefs: Array<ColonyTokenRef>,
};

export type ColonyEvent = {
  type: Scalars['String'],
  colonyAddress: Scalars['String'],
};

export type ColonyToken = IToken & {
  id: Scalars['String'],
  createdAt: Scalars['DateTime'],
  address: Scalars['String'],
  name: Scalars['String'],
  symbol: Scalars['String'],
  iconHash?: Maybe<Scalars['String']>,
  isExternal: Scalars['Boolean'],
  isNative: Scalars['Boolean'],
};

export type ColonyTokenRef = {
  address: Scalars['String'],
  isExternal?: Maybe<Scalars['Boolean']>,
  isNative?: Maybe<Scalars['Boolean']>,
  iconHash?: Maybe<Scalars['String']>,
};

export type CreateColonyInput = {
  colonyAddress: Scalars['String'],
  colonyName: Scalars['String'],
  displayName: Scalars['String'],
  tokenAddress: Scalars['String'],
  tokenName: Scalars['String'],
  tokenSymbol: Scalars['String'],
  tokenDecimals: Scalars['Int'],
  tokenIconHash?: Maybe<Scalars['String']>,
};

export type CreateDomainEvent = ColonyEvent & {
  type: Scalars['String'],
  ethDomainId: Scalars['String'],
  colonyAddress: Scalars['String'],
};

export type CreateDomainInput = {
  colonyAddress: Scalars['String'],
  ethDomainId: Scalars['Int'],
  ethParentDomainId?: Maybe<Scalars['Int']>,
  name: Scalars['String'],
};

export type CreateTaskEvent = TaskEvent & {
  type: Scalars['String'],
  taskId: Scalars['String'],
  ethDomainId: Scalars['String'],
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
  type: Scalars['String'],
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
  type: Scalars['String'],
  createdAt: Scalars['DateTime'],
  initiator?: Maybe<User>,
  initiatorAddress: Scalars['String'],
  sourceId: Scalars['String'],
  sourceType: Scalars['String'],
  context: EventContext,
};

export type EventContext = AssignWorkerEvent | CancelTaskEvent | CreateDomainEvent | CreateTaskEvent | CreateWorkRequestEvent | FinalizeTaskEvent | RemoveTaskPayoutEvent | SendWorkInviteEvent | SetTaskDescriptionEvent | SetTaskDomainEvent | SetTaskDueDateEvent | SetTaskPayoutEvent | SetTaskSkillEvent | SetTaskTitleEvent | TaskMessageEvent | UnassignWorkerEvent;

export type FinalizeTaskEvent = TaskEvent & {
  type: Scalars['String'],
  taskId: Scalars['String'],
};

export type IToken = {
  id: Scalars['String'],
  createdAt: Scalars['DateTime'],
  address: Scalars['String'],
  name: Scalars['String'],
  symbol: Scalars['String'],
  iconHash?: Maybe<Scalars['String']>,
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
  addColonyTokenReference?: Maybe<Token>,
  addUserTokenReference?: Maybe<Token>,
  setColonyTokenAvatar?: Maybe<Token>,
  setUserTokenAvatar?: Maybe<Token>,
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


export type MutationAddColonyTokenReferenceArgs = {
  input: AddColonyTokenReferenceInput
};


export type MutationAddUserTokenReferenceArgs = {
  input: AddUserTokenReferenceInput
};


export type MutationSetColonyTokenAvatarArgs = {
  input: SetColonyTokenAvatarInput
};


export type MutationSetUserTokenAvatarArgs = {
  input: SetUserTokenAvatarInput
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

export type Notification = {
  event: Event,
  read: Scalars['Boolean'],
};

export type Query = {
  user: User,
  colony: Colony,
  domain: Domain,
  task: Task,
  token: Token,
  loggedInUser: LoggedInUser,
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

export type RemoveTaskPayoutEvent = TaskEvent & {
  type: Scalars['String'],
  taskId: Scalars['String'],
  tokenAddress: Scalars['String'],
  amount: Scalars['String'],
};

export type RemoveTaskPayoutInput = {
  id: Scalars['String'],
  amount: Scalars['String'],
  token: Scalars['String'],
  tokenAddress: Scalars['String'],
  ethDomainId: Scalars['Int'],
};

export type SendTaskMessageInput = {
  id: Scalars['String'],
  message: Scalars['String'],
};

export type SendWorkInviteEvent = TaskEvent & {
  type: Scalars['String'],
  taskId: Scalars['String'],
  tokenAddress: Scalars['String'],
  amount: Scalars['String'],
};

export type SendWorkInviteInput = {
  id: Scalars['String'],
  workerAddress: Scalars['String'],
};

export type SetColonyTokenAvatarInput = {
  tokenAddress: Scalars['String'],
  colonyAddress: Scalars['String'],
  iconHash?: Maybe<Scalars['String']>,
};

export type SetTaskDescriptionEvent = TaskEvent & {
  type: Scalars['String'],
  taskId: Scalars['String'],
  description: Scalars['String'],
};

export type SetTaskDescriptionInput = {
  id: Scalars['String'],
  description: Scalars['String'],
};

export type SetTaskDomainEvent = TaskEvent & {
  type: Scalars['String'],
  taskId: Scalars['String'],
  ethDomainId: Scalars['String'],
};

export type SetTaskDomainInput = {
  id: Scalars['String'],
  ethDomainId: Scalars['Int'],
};

export type SetTaskDueDateEvent = TaskEvent & {
  type: Scalars['String'],
  taskId: Scalars['String'],
  dueDate: Scalars['Int'],
};

export type SetTaskDueDateInput = {
  id: Scalars['String'],
  dueDate: Scalars['Int'],
};

export type SetTaskPayoutEvent = TaskEvent & {
  type: Scalars['String'],
  taskId: Scalars['String'],
};

export type SetTaskPayoutInput = {
  id: Scalars['String'],
  amount: Scalars['String'],
  tokenAddress: Scalars['String'],
  ethDomainId: Scalars['Int'],
};

export type SetTaskSkillEvent = TaskEvent & {
  type: Scalars['String'],
  taskId: Scalars['String'],
  ethSkillId: Scalars['Int'],
};

export type SetTaskSkillInput = {
  id: Scalars['String'],
  ethSkillId: Scalars['Int'],
};

export type SetTaskTitleEvent = TaskEvent & {
  type: Scalars['String'],
  taskId: Scalars['String'],
  title: Scalars['String'],
};

export type SetTaskTitleInput = {
  id: Scalars['String'],
  title: Scalars['String'],
};

export type SetUserTokenAvatarInput = {
  tokenAddress: Scalars['String'],
  iconHash?: Maybe<Scalars['String']>,
};

export type SetUserTokensInput = {
  tokens: Array<Scalars['String']>,
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
  cancelledAt?: Maybe<Scalars['Int']>,
  description?: Maybe<Scalars['String']>,
  dueDate?: Maybe<Scalars['Int']>,
  finalizedAt?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  colony?: Maybe<Colony>,
  colonyAddress: Scalars['String'],
  creator?: Maybe<User>,
  creatorAddress: Scalars['String'],
  assignedWorker?: Maybe<User>,
  assignedWorkerAddress?: Maybe<Scalars['String']>,
  workInvites: Array<User>,
  workInviteAddresses: Array<Scalars['String']>,
  workRequests: Array<User>,
  workRequestAddresses: Array<Scalars['String']>,
  events: Array<Event>,
};

export type TaskEvent = {
  type: Scalars['String'],
  taskId: Scalars['String'],
};

export type TaskIdInput = {
  id: Scalars['String'],
};

export type TaskMessageEvent = TaskEvent & {
  type: Scalars['String'],
  taskId: Scalars['String'],
  message: Scalars['String'],
};

export type Token = IToken & {
  id: Scalars['String'],
  createdAt: Scalars['DateTime'],
  address: Scalars['String'],
  name: Scalars['String'],
  symbol: Scalars['String'],
  iconHash?: Maybe<Scalars['String']>,
};

export type UnassignWorkerEvent = TaskEvent & {
  type: Scalars['String'],
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
  tokens: Array<Scalars['String']>,
  tokenRefs: Array<Maybe<UserTokenRef>>,
  notifications?: Maybe<Array<Notification>>,
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

export type UserToken = IToken & {
  id: Scalars['String'],
  createdAt: Scalars['DateTime'],
  address: Scalars['String'],
  name: Scalars['String'],
  symbol: Scalars['String'],
  iconHash?: Maybe<Scalars['String']>,
};

export type UserTokenRef = {
  address: Scalars['String'],
  iconHash?: Maybe<Scalars['String']>,
};

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


export type SetUserTokensMutation = { setUserTokens: Maybe<Pick<User, 'id' | 'tokens'>> };

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

export type LoggedInUserQueryVariables = {};


export type LoggedInUserQuery = { loggedInUser: Pick<LoggedInUser, 'walletAddress' | 'balance' | 'username'> };

export type UserQueryVariables = {
  address: Scalars['String']
};


export type UserQuery = { user: (
    Pick<User, 'id'>
    & { profile: Pick<UserProfile, 'username' | 'walletAddress' | 'displayName' | 'bio' | 'location' | 'website' | 'avatarHash'> }
  ) };

export type UserTokensQueryVariables = {
  address: Scalars['String']
};


export type UserTokensQuery = { user: Pick<User, 'id' | 'tokens'> };

export type ColonyQueryVariables = {
  address: Scalars['String']
};


export type ColonyQuery = { colony: (
    Pick<Colony, 'id' | 'colonyAddress' | 'colonyName' | 'avatarHash' | 'description' | 'displayName' | 'guideline' | 'website'>
    & { tokens: Array<Pick<ColonyToken, 'address' | 'name' | 'symbol' | 'iconHash'>> }
  ) };

export type UserTaskIdsQueryVariables = {
  address: Scalars['String']
};


export type UserTaskIdsQuery = { user: (
    Pick<User, 'id'>
    & { tasks: Array<Pick<Task, 'id'>> }
  ) };

export type UserColonyIdsQueryVariables = {
  address: Scalars['String']
};


export type UserColonyIdsQuery = { user: (
    Pick<User, 'id'>
    & { colonies: Array<Pick<Colony, 'id'>> }
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
    tokens
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
export const UserTokensDocument = gql`
    query UserTokens($address: String!) {
  user(address: $address) {
    id
    tokens
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
export const ColonyDocument = gql`
    query Colony($address: String!) {
  colony(address: $address) {
    id
    colonyAddress
    colonyName
    avatarHash
    description
    displayName
    guideline
    website
    tokens {
      address
      name
      symbol
      iconHash
    }
  }
}
    `;

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
export const UserTaskIdsDocument = gql`
    query UserTaskIds($address: String!) {
  user(address: $address) {
    id
    tasks {
      id
    }
  }
}
    `;

/**
 * __useUserTaskIdsQuery__
 *
 * To run a query within a React component, call `useUserTaskIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserTaskIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserTaskIdsQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useUserTaskIdsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UserTaskIdsQuery, UserTaskIdsQueryVariables>) {
        return ApolloReactHooks.useQuery<UserTaskIdsQuery, UserTaskIdsQueryVariables>(UserTaskIdsDocument, baseOptions);
      }
export function useUserTaskIdsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserTaskIdsQuery, UserTaskIdsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<UserTaskIdsQuery, UserTaskIdsQueryVariables>(UserTaskIdsDocument, baseOptions);
        }
export type UserTaskIdsQueryHookResult = ReturnType<typeof useUserTaskIdsQuery>;
export type UserTaskIdsLazyQueryHookResult = ReturnType<typeof useUserTaskIdsLazyQuery>;
export type UserTaskIdsQueryResult = ApolloReactCommon.QueryResult<UserTaskIdsQuery, UserTaskIdsQueryVariables>;
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
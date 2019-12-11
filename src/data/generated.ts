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
   __typename?: 'AssignWorkerEvent',
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
   __typename?: 'CancelTaskEvent',
  taskId: Scalars['String'],
};

export type Colony = {
   __typename?: 'Colony',
  id: Scalars['String'],
  colonyAddress: Scalars['String'],
  colonyName: Scalars['String'],
  avatarHash?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  displayName?: Maybe<Scalars['String']>,
  guideline?: Maybe<Scalars['String']>,
  website?: Maybe<Scalars['String']>,
  tasks: Array<Task>,
  domains: Array<Domain>,
  founder?: Maybe<User>,
  subscribedUsers: Array<User>,
  tokens: Array<ColonyToken>,
};

export type ColonyEvent = {
  colonyAddress: Scalars['String'],
};

export type ColonyToken = IToken & {
   __typename?: 'ColonyToken',
  id: Scalars['String'],
  address: Scalars['String'],
  name: Scalars['String'],
  symbol: Scalars['String'],
  iconHash?: Maybe<Scalars['String']>,
  isExternal: Scalars['Boolean'],
  isNative: Scalars['Boolean'],
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
   __typename?: 'CreateDomainEvent',
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
   __typename?: 'CreateTaskEvent',
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
   __typename?: 'CreateWorkRequestEvent',
  taskId: Scalars['String'],
};

export type CreateWorkRequestInput = {
  id: Scalars['String'],
};

export type Domain = {
   __typename?: 'Domain',
  id: Scalars['String'],
  colonyAddress: Scalars['String'],
  ethDomainId: Scalars['Int'],
  ethParentDomainId?: Maybe<Scalars['Int']>,
  name: Scalars['String'],
  colony: Colony,
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
   __typename?: 'Event',
  type: Scalars['String'],
  initiator: User,
  sourceId: Scalars['String'],
  sourceType: Scalars['String'],
  context: EventContext,
};

export type EventContext = AssignWorkerEvent | CancelTaskEvent | CreateDomainEvent | CreateTaskEvent | CreateWorkRequestEvent | FinalizeTaskEvent | RemoveTaskPayoutEvent | SendWorkInviteEvent | SetTaskDescriptionEvent | SetTaskDomainEvent | SetTaskDueDateEvent | SetTaskPayoutEvent | SetTaskSkillEvent | SetTaskTitleEvent | TaskMessageEvent | UnassignWorkerEvent;

export type FinalizeTaskEvent = TaskEvent & {
   __typename?: 'FinalizeTaskEvent',
  taskId: Scalars['String'],
};

export type IToken = {
  id: Scalars['String'],
  address: Scalars['String'],
  name: Scalars['String'],
  symbol: Scalars['String'],
  iconHash?: Maybe<Scalars['String']>,
};

export type LoggedInUser = {
   __typename?: 'LoggedInUser',
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
   __typename?: 'Mutation',
  createUser?: Maybe<User>,
  editUser?: Maybe<User>,
  subscribeToColony?: Maybe<User>,
  unsubscribeFromColony?: Maybe<User>,
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
   __typename?: 'Notification',
  event: Event,
  read: Scalars['Boolean'],
};

export type Query = {
   __typename?: 'Query',
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
   __typename?: 'RemoveTaskPayoutEvent',
  taskId: Scalars['String'],
  tokenAddress: Scalars['String'],
  amount: Scalars['String'],
};

export type RemoveTaskPayoutInput = {
  id: Scalars['String'],
  amount: Scalars['String'],
  token: Scalars['String'],
  ethDomainId: Scalars['Int'],
};

export type SendTaskMessageInput = {
  id: Scalars['String'],
  message: Scalars['String'],
};

export type SendWorkInviteEvent = TaskEvent & {
   __typename?: 'SendWorkInviteEvent',
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
   __typename?: 'SetTaskDescriptionEvent',
  taskId: Scalars['String'],
  description: Scalars['String'],
};

export type SetTaskDescriptionInput = {
  id: Scalars['String'],
  description: Scalars['String'],
};

export type SetTaskDomainEvent = TaskEvent & {
   __typename?: 'SetTaskDomainEvent',
  taskId: Scalars['String'],
  ethDomainId: Scalars['String'],
};

export type SetTaskDomainInput = {
  id: Scalars['String'],
  ethDomainId: Scalars['Int'],
};

export type SetTaskDueDateEvent = TaskEvent & {
   __typename?: 'SetTaskDueDateEvent',
  taskId: Scalars['String'],
  dueDate: Scalars['Int'],
};

export type SetTaskDueDateInput = {
  id: Scalars['String'],
  dueDate: Scalars['Int'],
};

export type SetTaskPayoutEvent = TaskEvent & {
   __typename?: 'SetTaskPayoutEvent',
  taskId: Scalars['String'],
};

export type SetTaskPayoutInput = {
  id: Scalars['String'],
  amount: Scalars['String'],
  tokenAddress: Scalars['String'],
  ethDomainId: Scalars['Int'],
};

export type SetTaskSkillEvent = TaskEvent & {
   __typename?: 'SetTaskSkillEvent',
  taskId: Scalars['String'],
  ethSkillId: Scalars['Int'],
};

export type SetTaskSkillInput = {
  id: Scalars['String'],
  ethSkillId: Scalars['Int'],
};

export type SetTaskTitleEvent = TaskEvent & {
   __typename?: 'SetTaskTitleEvent',
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

export type SubscribeToColonyInput = {
  colonyAddress: Scalars['String'],
};

export type Task = {
   __typename?: 'Task',
  id: Scalars['String'],
  ethTaskId?: Maybe<Scalars['Int']>,
  ethDomainId: Scalars['Int'],
  ethSkillId?: Maybe<Scalars['Int']>,
  cancelledAt?: Maybe<Scalars['Int']>,
  description?: Maybe<Scalars['String']>,
  dueDate?: Maybe<Scalars['Int']>,
  finalizedAt?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  colony?: Maybe<Colony>,
  creator?: Maybe<User>,
  assignedWorker?: Maybe<User>,
  workInvites: Array<User>,
  workRequests: Array<User>,
  events: Array<Event>,
};

export type TaskEvent = {
  taskId: Scalars['String'],
};

export type TaskIdInput = {
  id: Scalars['String'],
};

export type TaskMessageEvent = TaskEvent & {
   __typename?: 'TaskMessageEvent',
  taskId: Scalars['String'],
  message: Scalars['String'],
};

export type Token = IToken & {
   __typename?: 'Token',
  id: Scalars['String'],
  address: Scalars['String'],
  name: Scalars['String'],
  symbol: Scalars['String'],
  iconHash?: Maybe<Scalars['String']>,
};

export type UnassignWorkerEvent = TaskEvent & {
   __typename?: 'UnassignWorkerEvent',
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
   __typename?: 'User',
  id: Scalars['String'],
  profile: UserProfile,
  colonies: Array<Colony>,
  tasks: Array<Task>,
  tokens: Array<UserToken>,
  notifications?: Maybe<Array<Notification>>,
};


export type UserNotificationsArgs = {
  read?: Maybe<Scalars['Boolean']>
};

export type UserProfile = {
   __typename?: 'UserProfile',
  username?: Maybe<Scalars['String']>,
  avatarHash?: Maybe<Scalars['String']>,
  bio?: Maybe<Scalars['String']>,
  displayName?: Maybe<Scalars['String']>,
  location?: Maybe<Scalars['String']>,
  walletAddress: Scalars['String'],
  website?: Maybe<Scalars['String']>,
};

export type UserToken = IToken & {
   __typename?: 'UserToken',
  id: Scalars['String'],
  address: Scalars['String'],
  name: Scalars['String'],
  symbol: Scalars['String'],
  iconHash?: Maybe<Scalars['String']>,
};

export type SetLoggedInUserMutationVariables = {
  input: LoggedInUserInput
};


export type SetLoggedInUserMutation = (
  { __typename?: 'Mutation' }
  & { setLoggedInUser: (
    { __typename?: 'LoggedInUser' }
    & Pick<LoggedInUser, 'id'>
  ) }
);

export type CreateUserMutationVariables = {
  createUserInput: CreateUserInput,
  loggedInUserInput: LoggedInUserInput
};


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )>, setLoggedInUser: (
    { __typename?: 'LoggedInUser' }
    & Pick<LoggedInUser, 'id'>
  ) }
);

export type EditUserMutationVariables = {
  input: EditUserInput
};


export type EditUserMutation = (
  { __typename?: 'Mutation' }
  & { editUser: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
  )> }
);

export type CreateColonyMutationVariables = {
  input: CreateColonyInput
};


export type CreateColonyMutation = (
  { __typename?: 'Mutation' }
  & { createColony: Maybe<(
    { __typename?: 'Colony' }
    & Pick<Colony, 'id' | 'colonyAddress' | 'colonyName' | 'avatarHash' | 'description' | 'displayName' | 'guideline' | 'website'>
  )> }
);

export type EditColonyProfileMutationVariables = {
  input: EditColonyProfileInput
};


export type EditColonyProfileMutation = (
  { __typename?: 'Mutation' }
  & { editColonyProfile: Maybe<(
    { __typename?: 'Colony' }
    & Pick<Colony, 'id' | 'colonyName' | 'avatarHash' | 'description' | 'displayName' | 'guideline' | 'website'>
  )> }
);

export type LoggedInUserQueryVariables = {};


export type LoggedInUserQuery = (
  { __typename?: 'Query' }
  & { loggedInUser: (
    { __typename?: 'LoggedInUser' }
    & Pick<LoggedInUser, 'walletAddress' | 'balance' | 'username'>
  ) }
);

export type UserQueryVariables = {
  address: Scalars['String']
};


export type UserQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'User' }
    & Pick<User, 'id'>
    & { profile: (
      { __typename?: 'UserProfile' }
      & Pick<UserProfile, 'username' | 'walletAddress' | 'displayName' | 'bio' | 'location' | 'website' | 'avatarHash'>
    ) }
  ) }
);

export type ColonyQueryVariables = {
  address: Scalars['String']
};


export type ColonyQuery = (
  { __typename?: 'Query' }
  & { colony: (
    { __typename?: 'Colony' }
    & Pick<Colony, 'id' | 'colonyAddress' | 'colonyName' | 'avatarHash' | 'description' | 'displayName' | 'guideline' | 'website'>
  ) }
);

export type ColonySubscribedUsersQueryVariables = {
  colonyAddress: Scalars['String']
};


export type ColonySubscribedUsersQuery = (
  { __typename?: 'Query' }
  & { colony: (
    { __typename?: 'Colony' }
    & Pick<Colony, 'id'>
    & { subscribedUsers: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id'>
      & { profile: (
        { __typename?: 'UserProfile' }
        & Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'>
      ) }
    )> }
  ) }
);


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
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


export type AssignWorkerEvent = {
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

export type CancelTaskEvent = {
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
  tasks: Array<Maybe<Task>>,
  domains: Array<Maybe<Domain>>,
  founder?: Maybe<User>,
  subscribedUsers: Array<Maybe<User>>,
};

export type CreateColonyInput = {
  colonyAddress: Scalars['String'],
  colonyName: Scalars['String'],
  displayName: Scalars['String'],
};

export type CreateDomainEvent = {
   __typename?: 'CreateDomainEvent',
  ethDomainId: Scalars['String'],
  colonyAddress: Scalars['String'],
};

export type CreateDomainInput = {
  colonyAddress: Scalars['String'],
  ethDomainId: Scalars['Int'],
  name: Scalars['Int'],
  parentEthDomainId?: Maybe<Scalars['Int']>,
};

export type CreateTaskEvent = {
   __typename?: 'CreateTaskEvent',
  taskId: Scalars['String'],
  ethDomainId: Scalars['String'],
  colonyAddress: Scalars['String'],
};

export type CreateTaskInput = {
  colonyAddress: Scalars['String'],
  ethDomainId: Scalars['Int'],
};

export type CreateUserInput = {
  username: Scalars['String'],
};

export type CreateWorkRequestEvent = {
   __typename?: 'CreateWorkRequestEvent',
  taskId: Scalars['String'],
};

export type CreateWorkRequestInput = {
  id: Scalars['String'],
};

export type CurrentUser = IUser & {
   __typename?: 'CurrentUser',
  id: Scalars['String'],
  profile: UserProfile,
  colonies: Array<Maybe<Colony>>,
  tasks: Array<Maybe<Task>>,
  notifications: Array<Maybe<Notification>>,
};


export type CurrentUserNotificationsArgs = {
  read?: Maybe<Scalars['Boolean']>
};

export type Domain = {
   __typename?: 'Domain',
  id: Scalars['String'],
  colonyAddress: Scalars['String'],
  ethDomainId: Scalars['Int'],
  ethParentDomainId: Scalars['Int'],
  name: Scalars['String'],
  colony: Colony,
  parent?: Maybe<Domain>,
  tasks: Array<Maybe<Task>>,
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
  name: Scalars['Int'],
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
  initiator: Scalars['String'],
  sourceId: Scalars['String'],
  sourceType: Scalars['String'],
  context: EventContext,
};

export type EventContext = AssignWorkerEvent | CancelTaskEvent | CreateDomainEvent | CreateTaskEvent | CreateWorkRequestEvent | FinalizeTaskEvent | RemoveTaskPayoutEvent | SendWorkInviteEvent | SetTaskDescriptionEvent | SetTaskDomainEvent | SetTaskDueDateEvent | SetTaskPayoutEvent | SetTaskSkillEvent | SetTaskTitleEvent | UnassignWorkerEvent;

export type FinalizeTaskEvent = {
   __typename?: 'FinalizeTaskEvent',
  taskId: Scalars['String'],
};

export type IUser = {
  id: Scalars['String'],
  profile: UserProfile,
  colonies: Array<Maybe<Colony>>,
  tasks: Array<Maybe<Task>>,
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
  subscribeToTask?: Maybe<User>,
  unsubscribeFromColony?: Maybe<User>,
  unsubscribeFromTask?: Maybe<User>,
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


export type MutationSubscribeToTaskArgs = {
  input: SubscribeToTaskInput
};


export type MutationUnsubscribeFromColonyArgs = {
  input: UnsubscribeFromColonyInput
};


export type MutationUnsubscribeFromTaskArgs = {
  input: UnsubscribeFromTaskInput
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
  domain: Colony,
  task: Task,
  currentUser: CurrentUser,
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

export type RemoveTaskPayoutEvent = {
   __typename?: 'RemoveTaskPayoutEvent',
  taskId: Scalars['String'],
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

export type SendWorkInviteEvent = {
   __typename?: 'SendWorkInviteEvent',
  taskId: Scalars['String'],
};

export type SendWorkInviteInput = {
  id: Scalars['String'],
  workerAddress: Scalars['String'],
};

export type SetTaskDescriptionEvent = {
   __typename?: 'SetTaskDescriptionEvent',
  taskId: Scalars['String'],
  description: Scalars['String'],
};

export type SetTaskDescriptionInput = {
  id: Scalars['String'],
  description: Scalars['String'],
};

export type SetTaskDomainEvent = {
   __typename?: 'SetTaskDomainEvent',
  taskId: Scalars['String'],
  ethDomainId: Scalars['String'],
};

export type SetTaskDomainInput = {
  id: Scalars['String'],
  ethDomainId: Scalars['Int'],
};

export type SetTaskDueDateEvent = {
   __typename?: 'SetTaskDueDateEvent',
  taskId: Scalars['String'],
  dueDate: Scalars['Int'],
};

export type SetTaskDueDateInput = {
  id: Scalars['String'],
  dueDate: Scalars['Int'],
};

export type SetTaskPayoutEvent = {
   __typename?: 'SetTaskPayoutEvent',
  taskId: Scalars['String'],
};

export type SetTaskPayoutInput = {
  id: Scalars['String'],
  amount: Scalars['String'],
  token: Scalars['String'],
  ethDomainId: Scalars['Int'],
};

export type SetTaskSkillEvent = {
   __typename?: 'SetTaskSkillEvent',
  taskId: Scalars['String'],
  ethSkillId: Scalars['Int'],
};

export type SetTaskSkillInput = {
  id: Scalars['String'],
  ethSkillId: Scalars['Int'],
};

export type SetTaskTitleEvent = {
   __typename?: 'SetTaskTitleEvent',
  taskId: Scalars['String'],
  title: Scalars['String'],
};

export type SetTaskTitleInput = {
  id: Scalars['String'],
  title: Scalars['String'],
};

export type SubscribeToColonyInput = {
  colonyAddress: Scalars['String'],
};

export type SubscribeToTaskInput = {
  id: Scalars['String'],
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
  workInvites: Array<Maybe<User>>,
  workRequests: Array<Maybe<User>>,
};

export type TaskIdInput = {
  id: Scalars['String'],
};

export type Token = {
   __typename?: 'Token',
  address: Scalars['String'],
  name?: Maybe<Scalars['String']>,
  symbol?: Maybe<Scalars['String']>,
  iconHash?: Maybe<Scalars['String']>,
  isExternal?: Maybe<Scalars['Boolean']>,
  isNative?: Maybe<Scalars['Boolean']>,
};

export type UnassignWorkerEvent = {
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

export type UnsubscribeFromTaskInput = {
  id: Scalars['String'],
};


export type User = IUser & {
   __typename?: 'User',
  id: Scalars['String'],
  profile: UserProfile,
  colonies: Array<Maybe<Colony>>,
  tasks: Array<Maybe<Task>>,
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

export type ColonySubscribedUsersQueryVariables = {
  colonyAddress: Scalars['String']
};


export type ColonySubscribedUsersQuery = (
  { __typename?: 'Query' }
  & { colony: (
    { __typename?: 'Colony' }
    & Pick<Colony, 'id'>
    & { subscribedUsers: Array<Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id'>
      & { profile: (
        { __typename?: 'UserProfile' }
        & Pick<UserProfile, 'avatarHash' | 'displayName' | 'username' | 'walletAddress'>
      ) }
    )>> }
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
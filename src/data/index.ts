import { Resolvers } from 'apollo-client';

import apolloCache from './cache';

import {
  ColonyProfileFragment,
  ColonyQuery,
  ColonyTasksQuery,
  ColonyTransfersQuery,
  DomainFieldsFragment,
  FullColonyFragment,
  PayoutsFragment,
  PersistentTaskPayoutsFragment,
  TaskQuery,
  TokenBalancesForDomainsQuery,
  TokenQuery,
  UserNotificationsQuery,
  UserQuery,
  UserTasksQuery,
  UserTokensQuery,
  ColonySuggestionsQuery,
  ColonyProgramsQuery,
  LevelQuery,
  ProgramLevelsQuery,
  ProgramLevelsWithUnlockedQuery,
  ProgramSubmissionsQuery,
  ProgramQuery,
  UserWithReputationQuery,
} from './generated';
import {
  loggedInUserResolvers,
  initialCache as loggedInUser,
} from './resolvers/loggedInUser';
import { colonyResolvers } from './resolvers/colony';
import { userResolvers } from './resolvers/user';
import { tokenResolvers } from './resolvers/token';
import { taskResolvers } from './resolvers/task';

type ResolverFactory = (context?: any) => Resolvers;

// Initialize cache
apolloCache.writeData({
  data: {
    ...loggedInUser,
  },
});

export { default as cache } from './cache';
export { default as cacheUpdates } from './cacheUpdates';
export { default as typeDefs } from './graphql/typeDefs';
export const resolvers: ResolverFactory[] = [
  colonyResolvers,
  loggedInUserResolvers,
  userResolvers,
  taskResolvers,
  tokenResolvers,
];

// export all the generated types and helpers
export * from './generated';
export * from './helpers';

export type AnyUser = UserQuery['user'] | UserWithReputationQuery['user'];

export type AnyTask =
  | TaskQuery['task']
  | ColonyTasksQuery['colony']['tasks'][number]
  | UserTasksQuery['user']['tasks'][number];

export type Payouts =
  | PayoutsFragment['payouts']
  | PersistentTaskPayoutsFragment['payouts'];

export type Notifications = UserNotificationsQuery['user']['notifications'];
export type OneNotification = Notifications[number];

export type AnyColonyProfile = FullColonyFragment | ColonyProfileFragment;
export type Colony = FullColonyFragment;

export type OneDomain = DomainFieldsFragment;

export type ColonyTransaction = ColonyTransfersQuery['colony']['transfers'][number];

export type OneSuggestion = ColonySuggestionsQuery['colony']['suggestions'][number];

export type ColonyPrograms = ColonyProgramsQuery['colony']['programs'];
export type OneProgram =
  | ColonyProgramsQuery['colony']['programs'][number]
  | ProgramQuery['program'];

export type ProgramLevels =
  | OneProgram['levels']
  | ProgramLevelsQuery['program']['levels'];
export type OneLevel = ProgramLevels[number] | LevelQuery['level'];

export type LevelsWithUnlocked = ProgramLevelsWithUnlockedQuery['program']['levels'];
export type OneLevelWithUnlocked =
  | LevelsWithUnlocked[number]
  | LevelQuery['level'];

export type PersistentTasks = LevelQuery['level']['steps'];
export type OnePersistentTask = PersistentTasks[number];

export type Submissions = ProgramSubmissionsQuery['program']['submissions'];
export type OneSubmission = Submissions[0];

export type ProgramSubmissions = ProgramSubmissionsQuery['program']['submissions'];
export type OneProgramSubmission = ProgramSubmissions[0];

export type OneToken = TokenQuery['token'];
export type ColonyTokens = ColonyQuery['colony']['tokens'];
export type UserTokens = UserTokensQuery['user']['tokens'];
// All tokens with either 'balance' or 'balances'
export type TokenWithBalances =
  | ColonyTokens[0]
  | UserTokens[0]
  | TokenBalancesForDomainsQuery['tokens'][0];

// See: https://github.com/microsoft/TypeScript/issues/10620
export type AnyTokens = (
  | ColonyTokens[number]
  | UserTokens[number]
  | OneToken
)[];

// Almost all tokens with 'address' and 'iconHash'
export type AnyToken = ColonyTokens[0] | UserTokens[0] | OneToken;

import { Resolvers } from 'apollo-client';

import apolloCache from './cache';

import {
  ColonyProfileFragment,
  ColonyQuery,
  ColonyTasksQuery,
  FullColonyFragment,
  PayoutsFragment,
  TaskQuery,
  TokenBalancesForDomainsQuery,
  TokenQuery,
  UserNotificationsQuery,
  UserQuery,
  UserTasksQuery,
  UserTokensQuery,
  ColonySuggestionsQuery,
  ColonyProgramsQuery,
  ProgramQuery,
} from './generated';
import {
  loggedInUserResolvers,
  initialCache as loggedInUser,
} from './loggedInUser';
import { colonyResolvers } from './colony';
import { userResolvers } from './user';
import { tokenResolvers } from './token';
import { taskResolvers } from './task';

type ResolverFactory = (context?: any) => Resolvers;

// Initialize cache
apolloCache.writeData({
  data: {
    ...loggedInUser,
  },
});

export { default as cache } from './cache';
export { default as cacheUpdates } from './cacheUpdates';
export { default as typeDefs } from './typeDefs';
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

export type AnyUser = UserQuery['user'];

export type AnyTask =
  | TaskQuery['task']
  | ColonyTasksQuery['colony']['tasks'][number]
  | UserTasksQuery['user']['tasks'][number];

export type Payouts = PayoutsFragment['payouts'];

export type Notifications = UserNotificationsQuery['user']['notifications'];
export type OneNotification = Notifications[number];

export type AnyColonyProfile = FullColonyFragment | ColonyProfileFragment;

export type OneSuggestion = ColonySuggestionsQuery['colony']['suggestions'][number];

export type ColonyPrograms = ColonyProgramsQuery['colony']['programs'];
export type OneProgram =
  | ColonyProgramsQuery['colony']['programs'][number]
  | ProgramQuery['program'];

export type OneToken = TokenQuery['token'];
export type ColonyTokens = ColonyQuery['colony']['tokens'];
export type UserTokens = UserTokensQuery['user']['tokens'];
// All tokens with either 'balance' or 'balances'
export type TokenWithBalances =
  | ColonyTokens[0]
  | UserTokens[0]
  | TokenBalancesForDomainsQuery['tokens'][0];
// Almost all tokens with 'address' and 'iconHash'
export type AnyToken = ColonyTokens[0] | UserTokens[0] | OneToken;

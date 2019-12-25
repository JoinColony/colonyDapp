/* This file is already part of apollo data. Don't delete */
import { Resolvers } from 'apollo-client';

import apolloCache from './cache';

import {
  AllTokensQuery,
  ColonyProfileFragment,
  ColonyQuery,
  ColonyTasksQuery,
  FullColonyFragment,
  PayoutsFragment,
  UserQuery,
  UserTasksQuery,
  UserTokensQuery,
  TaskQuery,
  TokenBalancesForDomainsQuery,
  TokenQuery,
} from './generated';
import {
  loggedInUserResolvers,
  initialCache as loggedInUser,
} from './loggedInUser';
import { colonyResolvers } from './colony';
import { tokenResolvers } from './token';

type ResolverFactory = (context?: any) => Resolvers;

// Initialize cache
apolloCache.writeData({
  data: {
    ...loggedInUser,
  },
});

export { default as cache } from './cache';
export { default as typeDefs } from './typeDefs';
export const resolvers: ResolverFactory[] = [
  colonyResolvers,
  loggedInUserResolvers,
  tokenResolvers,
];

// export all the generated types and helpers
export * from './generated';
export * from './helpers';

// FIXME create fragments for typical tokens/payouts, use in queries and type with those

// @TODO find a solution for query return types used throughout the dapp
// @body when passing down properties to other components we should expect the return type of the query in the upper component. How can we make that work in a simple way?
export type AnyUser = UserQuery['user'];

export type AnyTask =
  | TaskQuery['task']
  | ColonyTasksQuery['colony']['tasks'][number]
  | UserTasksQuery['user']['tasks'][number];

export type Payouts = PayoutsFragment['payouts'];

export type AnyColonyProfile = FullColonyFragment | ColonyProfileFragment;

export type OneToken = TokenQuery['token'];
export type TokenList = AllTokensQuery['allTokens'];
export type ColonyTokens = ColonyQuery['colony']['tokens'];
export type UserTokens = UserTokensQuery['user']['tokens'];
// All tokens with either 'balance' or 'balances'
export type TokenWithBalances =
  | ColonyTokens[0]
  | UserTokens[0]
  | TokenBalancesForDomainsQuery['colony']['tokens'][0];
// Almost all tokens with 'address' and 'iconHash'
export type AnyToken =
  | ColonyTokens[0]
  | UserTokens[0]
  | OneToken
  | TokenList[0];

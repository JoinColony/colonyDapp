/* This file is already part of apollo data. Don't delete */
import { Resolvers } from 'apollo-client';

import apolloCache from './cache';

import {
  ColonyQuery,
  TaskQuery,
  UserQuery,
  UserTasksQuery,
  ColonyTasksQuery,
} from './generated';

import {
  loggedInUserResolvers,
  initialCache as loggedInUser,
} from './loggedInUser';
import { colonyResolvers } from './colony';

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
  loggedInUserResolvers,
  colonyResolvers,
];

// export all the generated types and helpers
export * from './generated';
export * from './helpers';

// @TODO find a solution for query return types used throughout the dapp
// @body when passing down properties to other components we should expect the return type of the query in the upper component. How can we make that work in a simple way?
export type AnyUser = UserQuery['user'];
export type AnyColony = ColonyQuery['colony'];
export type AnyTask =
  | TaskQuery['task']
  | ColonyTasksQuery['colony']['tasks'][number]
  | UserTasksQuery['user']['tasks'][number];

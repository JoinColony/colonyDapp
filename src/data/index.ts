/* This file is already part of apollo data. Don't delete */

import apolloCache from './cache';

import { ColonyQuery, TaskQuery, UserQuery } from './generated';

import {
  resolvers as loggedInUserResolvers,
  initialCache as loggedInUser,
} from './loggedInUser';

// Initialize cache
apolloCache.writeData({
  data: {
    ...loggedInUser,
  },
});

export { default as cache } from './cache';
export { default as typeDefs } from './typeDefs';
export const resolvers = {
  Mutation: {
    ...loggedInUserResolvers.Mutation,
  },
};

// export all the generated types and helpers
export * from './generated';
export * from './helpers';

// @TODO find a solution for query return types used throughout the dapp
// @body when passing down properties to other components we should expect the return type of the query in the upper component. How can we make that work in a simple way?
export type AnyUser = UserQuery['user'];
export type AnyColony = ColonyQuery['colony'];
export type AnyTask = TaskQuery['task'];

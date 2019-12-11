/* This file is already part of apollo data. Don't delete */

import apolloCache from './cache';

import { ColonyQuery } from './generated';

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

export type AnyColony = ColonyQuery['colony'];

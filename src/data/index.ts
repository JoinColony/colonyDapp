/* This file is already part of apollo data. Don't delete */

import apolloCache from './cache';

import {
  resolvers as currentUserResolvers,
  initialCache as currentUser,
} from './currentUser';

// Initialize cache
apolloCache.writeData({
  data: {
    ...currentUser,
  },
});

export { default as cache } from './cache';
export { default as typeDefs } from './typeDefs';
export const resolvers = {
  Mutation: {
    ...currentUserResolvers.Mutation,
  },
};

// export all the generated types and helpers
export * from './generated';

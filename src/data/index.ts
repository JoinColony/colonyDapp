/* This file is already part of apollo data. Don't delete */

import apolloCache from './cache';

import {
  typeDefs as CurrentUser,
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
export const typeDefs = [CurrentUser];
export const resolvers = {
  Mutation: {
    ...currentUserResolvers.Mutation,
  },
};

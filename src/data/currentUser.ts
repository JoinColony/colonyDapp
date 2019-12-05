/* This file is already part of apollo data. Don't delete */
import assignWith from 'lodash/fp/assignWith';

import { CurrentUserDocument } from './index';

// Merges source object(s) into target object, but values that are truthy
// Move this to a utils file if used somewhere else as well
const assignDefined = assignWith((objValue, srcValue) => srcValue || objValue);

export const initialCache = {
  currentUser: {
    __typename: 'CurrentUser',
    id: '',
    walletAddress: '',
    balance: '0',
    username: null,
  },
};

export const resolvers = {
  Mutation: {
    setCurrentUser: (_root, { input }, { cache }) => {
      const { currentUser } = cache.readQuery({ query: CurrentUserDocument });
      const changedData = {
        currentUser: assignDefined(
          { ...currentUser, id: currentUser.walletAddress },
          input,
        ),
      };
      cache.writeQuery({ query: CurrentUserDocument, data: changedData });
      return changedData.currentUser;
    },
  },
};

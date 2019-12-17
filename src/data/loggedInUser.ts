/* This file is already part of apollo data. Don't delete */
import assignWith from 'lodash/fp/assignWith';

import { LoggedInUserDocument } from './index';

// Merges source object(s) into target object, but values that are truthy
// Move this to a utils file if used somewhere else as well
const assignDefined = assignWith((objValue, srcValue) => srcValue || objValue);

export const initialCache = {
  loggedInUser: {
    __typename: 'LoggedInUser',
    id: '',
    walletAddress: '',
    balance: '0',
    username: null,
  },
};

export const loggedInUserResolvers = () => ({
  Mutation: {
    setLoggedInUser: (_root, { input }, { cache }) => {
      const { loggedInUser } = cache.readQuery({ query: LoggedInUserDocument });
      const changedData = {
        loggedInUser: assignDefined(
          { ...loggedInUser, id: loggedInUser.walletAddress },
          input,
        ),
      };
      cache.writeQuery({ query: LoggedInUserDocument, data: changedData });
      return changedData.loggedInUser;
    },
  },
});

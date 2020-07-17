import { Resolvers } from 'apollo-client';
import assignWith from 'lodash/fp/assignWith';

import { LoggedInUserDocument } from '../generated';

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
    ethereal: true,
  },
};

export const loggedInUserResolvers = (): Resolvers => ({
  Mutation: {
    setLoggedInUser: (_root, { input }, { cache }) => {
      const { loggedInUser } = cache.readQuery({ query: LoggedInUserDocument });
      const changedData = {
        loggedInUser: assignDefined(
          {
            ...loggedInUser,
            id: loggedInUser.walletAddress,
            /**
             * @NOTE Only set the ethereal value if one is provided
             * This is so that we can call the mutation without the ethereal value set,
             * otherwise `assignDefined` kicks in and removes all the falsey values,
             * even if `false` in our case is a correct outcome
             */
            ...(typeof input.ethereal !== 'undefined'
              ? {
                  ethereal: input.ethereal,
                }
              : {}),
          },
          { ...input, id: input.walletAddress },
        ),
      };
      cache.writeQuery({ query: LoggedInUserDocument, data: changedData });
      return changedData.loggedInUser;
    },
    clearLoggedInUser: (_root, _args, { cache }) => {
      cache.writeQuery({ query: LoggedInUserDocument, data: initialCache });
      return initialCache.loggedInUser;
    },
  },
});

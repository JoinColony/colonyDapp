/* This file is already part of apollo data. Don't delete */
import { useEffect } from 'react';
import ApolloClient from 'apollo-client';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { graphql, DataValue } from '@apollo/react-hoc';
import { getContext } from 'redux-saga/effects';

import { Context } from '~context/index';
import { Address } from '~types/index';
import { LoggedInUser, User } from '~data/index';

import { LoggedInUserDocument, UserDocument } from './index';

const getMinimalUser = address => ({
  id: address,
  profile: { walletAddress: address },
  colonies: [],
  tasks: [],
});

// FIXME put these into the modules where they belong alongside with the queries and types
export const useUser = (address: Address): User => {
  const { data } = useQuery(UserDocument, { variables: { address } }) as {
    data?: { user: User };
  };
  return data ? data.user : getMinimalUser(address);
};

// FIXME error handling
export const useUserLazy = (address?: Address): User | undefined => {
  const [loadUser, { data }] = useLazyQuery(UserDocument, {
    variables: { address },
  });
  useEffect(() => {
    if (address) loadUser();
  }, [address, loadUser]);
  if (!address) return undefined;
  return data ? data.user : getMinimalUser(address);
};

/* All of these helper assume that the logged in user exists in the apollo cache at the time of calling them */

// Meant to be used as a hook in react components
export const useLoggedInUser = () => {
  const {
    data: { loggedInUser },
  } = useQuery(LoggedInUserDocument) as {
    data: {
      loggedInUser: LoggedInUser;
    };
  };
  return loggedInUser;
};

// Meant to be used as a saga in a proper context
export function* getLoggedInUser() {
  const apolloClient: ApolloClient<any> = yield getContext(
    Context.APOLLO_CLIENT,
  );
  const result = yield apolloClient.query({ query: LoggedInUserDocument });
  const {
    data: { loggedInUser },
  } = result as {
    data: {
      loggedInUser: LoggedInUser;
    };
  };
  return loggedInUser;
}

// Meant to be used as a hoc in compose calls
// @todo use hooks for wizard
// @body Because of the legacy code of the wizard that still doesn't use hooks
// we are obligated to use a hoc here, which is unfortunate. We should change that
export const withLoggedInUser = graphql(LoggedInUserDocument, {
  props: ({ data }) => {
    const mappedData = data as DataValue<{ loggedInUser: LoggedInUser }>;
    return {
      loggedInUser: mappedData.loggedInUser as LoggedInUser,
    };
  },
});

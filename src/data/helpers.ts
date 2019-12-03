/* This file is already part of apollo data. Don't delete */
import { useEffect } from 'react';
import ApolloClient from 'apollo-client';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { graphql, DataValue } from '@apollo/react-hoc';
import { getContext } from 'redux-saga/effects';

import { Context } from '~context/index';
import { Address } from '~types/index';
// FIXME move that to this module
import { User } from '~data/types/index';

import { USER } from '../modules/users/queries';
import { CurrentUser, CURRENT_USER } from './currentUser';

const getMinimalUser = address => ({
  id: address,
  profile: { walletAddress: address },
});

// FIXME put these into the modules where they belong alongside with the queries and types
export const useUser = (address: Address): User => {
  const { data } = useQuery(USER, { variables: { address } }) as {
    data?: { user: User };
  };
  return data ? data.user : getMinimalUser(address);
};

// FIXME error handling
export const useUserLazy = (address?: Address): User | undefined => {
  const [loadUser, { data }] = useLazyQuery(USER, { variables: { address } });
  useEffect(() => {
    if (address) loadUser();
  }, [address, loadUser]);
  if (!address) return undefined;
  return data ? data.user : getMinimalUser(address);
};

/* All of these helper assume that the current user exists in the apollo cache at the time of calling them */

// Meant to be used as a hook in react components
export const useCurrentUser = () => {
  const {
    data: { currentUser },
  } = useQuery(CURRENT_USER) as {
    data: {
      currentUser: CurrentUser;
    };
  };
  return currentUser;
};

// Meant to be used as a saga in a proper context
export function* getCurrentUser() {
  const apolloClient: ApolloClient<any> = yield getContext(
    Context.APOLLO_CLIENT,
  );
  const result = yield apolloClient.query({ query: CURRENT_USER });
  const {
    data: { currentUser },
  } = result as {
    data: {
      currentUser: CurrentUser;
    };
  };
  return currentUser;
}

// Meant to be used as a hoc in compose calls
// @todo use hooks for wizard
// @body Because of the legacy code of the wizard that still doesn't use hooks
// we are obligated to use a hoc here, which is unfortunate. We should change that
export const withCurrentUser = graphql(CURRENT_USER, {
  props: ({ data }) => {
    const mappedData = data as DataValue<{ currentUser: CurrentUser }>;
    return {
      currentUser: mappedData.currentUser as CurrentUser,
    };
  },
});

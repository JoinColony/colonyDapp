import { useEffect } from 'react';
import ApolloClient from 'apollo-client';
import { graphql, DataValue } from '@apollo/react-hoc';
import { getContext } from 'redux-saga/effects';

import { Context } from '~context/index';
import { Address } from '~types/index';

import {
  LoggedInUserDocument,
  LoggedInUserQuery,
  useLoggedInUserQuery,
  useUserLazyQuery,
  useUserQuery,
  UserQuery,
  UserNotificationsDocument,
  UserNotificationsQuery,
  UserNotificationsQueryVariables,
  OneProgram,
} from './index';
import { useColonyProgramsQuery } from './generated';

const getMinimalUser = (address: string): UserQuery['user'] => ({
  id: address,
  profile: { walletAddress: address },
});

export const useProgram = (
  colonyAddress: Address,
  programId: string,
): { data?: OneProgram; error?: string; loading: boolean } => {
  const { data, loading } = useColonyProgramsQuery({
    variables: { address: colonyAddress },
  });

  const program =
    data && data.colony.programs.find(({ id }) => id === programId);

  return {
    data: program,
    error: !program && !loading ? 'Program not found' : undefined,
    loading,
  };
};

export const useUser = (address: Address) => {
  const { data } = useUserQuery({ variables: { address } });
  return data ? data.user : getMinimalUser(address);
};

export const useUserLazy = (address?: Address) => {
  const [loadUser, { data }] = useUserLazyQuery();
  useEffect(() => {
    if (address) {
      loadUser({
        variables: { address },
      });
    }
  }, [address, loadUser]);
  if (!address) return undefined;
  return data ? data.user : getMinimalUser(address);
};

/* All of these helper assume that the logged in user exists in the apollo cache at the time of calling them */

// Meant to be used as a hook in react components
export const useLoggedInUser = () => {
  const {
    data: { loggedInUser },
  } = useLoggedInUserQuery() as {
    data: {
      loggedInUser: LoggedInUserQuery['loggedInUser'];
    };
  };
  return loggedInUser;
};

// Meant to be used as a saga in a proper context
export function* getLoggedInUser() {
  const apolloClient: ApolloClient<object> = yield getContext(
    Context.APOLLO_CLIENT,
  );
  const result = yield apolloClient.query({ query: LoggedInUserDocument });
  const {
    data: { loggedInUser },
  } = result as {
    data: {
      loggedInUser: LoggedInUserQuery['loggedInUser'];
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
    const mappedData = data as DataValue<{
      loggedInUser: LoggedInUserQuery['loggedInUser'];
    }>;
    return {
      loggedInUser: mappedData.loggedInUser,
    };
  },
});

// Re-fetch user notifications and write to cache
export function* refetchUserNotifications(walletAddress: string) {
  const apolloClient: ApolloClient<object> = yield getContext(
    Context.APOLLO_CLIENT,
  );
  yield apolloClient.query<
    UserNotificationsQuery,
    UserNotificationsQueryVariables
  >({
    query: UserNotificationsDocument,
    variables: { address: walletAddress },
    fetchPolicy: 'network-only',
  });
}

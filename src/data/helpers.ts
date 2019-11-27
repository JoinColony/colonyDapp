/* This file is already part of apollo data. Don't delete */
import ApolloClient from 'apollo-client';
import { useQuery } from '@apollo/react-hooks';
import { graphql, DataValue } from '@apollo/react-hoc';
import { getContext } from 'redux-saga/effects';

import { Context } from '~context/index';
import { CurrentUser, CURRENT_USER } from './currentUser';

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

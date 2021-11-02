import { useEffect } from 'react';
import { DataValue, graphql } from '@apollo/client/react/hoc';

import { ContextModule, TEMP_getContext } from '~context/index';
import { SlotKey } from '~context/userSettings';
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
  useNetworkContractsQuery,
  NetworkContractsQuery,
  NetworkContractsQueryVariables,
  NetworkContractsDocument,
  UpdateNetworkContractsMutation,
  UpdateNetworkContractsMutationVariables,
  UpdateNetworkContractsDocument,
} from './index';

import { canUseMetatransactions } from '../modules/users/checks';

export const getMinimalUser = (
  address: string,
): UserQuery['user'] & {
  __typename: string;
  profile: { __typename: string };
} => ({
  __typename: 'User',
  id: address,
  profile: {
    __typename: 'UserProfile',
    walletAddress: address,
  },
});

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
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
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
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
  yield apolloClient.query<
    UserNotificationsQuery,
    UserNotificationsQueryVariables
  >({
    query: UserNotificationsDocument,
    variables: { address: walletAddress },
    fetchPolicy: 'network-only',
  });
}

/*
 * Hooks to access the Network Contracts resolver in React components
 */
export const useNetworkContracts = () => {
  const {
    data: { networkContracts },
  } = useNetworkContractsQuery() as {
    data: {
      networkContracts: NetworkContractsQuery['networkContracts'];
    };
  };
  return networkContracts;
};

/*
 * Network Contracts saga helpers, to be used when initializing the app
 */
export function* getNetworkContracts() {
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
  const result = yield apolloClient.query<
    NetworkContractsQuery,
    NetworkContractsQueryVariables
  >({ query: NetworkContractsDocument });
  const {
    data: { networkContracts },
  } = result as {
    data: {
      networkContracts: NetworkContractsQuery['networkContracts'];
    };
  };
  return networkContracts;
}

export function* updateNetworkContracts() {
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
  const result = yield apolloClient.mutate<
    UpdateNetworkContractsMutation,
    UpdateNetworkContractsMutationVariables
  >({
    mutation: UpdateNetworkContractsDocument,
  });
  const {
    data: { networkContracts },
  } = result as {
    data: {
      networkContracts: NetworkContractsQuery['networkContracts'];
    };
  };
  return networkContracts;
}

// Meant to be used as a saga in a proper context
export function* getCanUserSendMetatransactions() {
  const { networkId: userWalletNetworkId } = yield getLoggedInUser();

  if (!userWalletNetworkId) {
    throw new Error(
      `Could not get user's metatransactions prefference. Cannot access the user's network from the wallet`,
    );
  }

  const userSettings = yield TEMP_getContext(ContextModule.UserSettings);
  const metatransactionEnabled = userSettings.getSlotStorageAtKey(
    SlotKey.Metatransactions,
  );

  const metatransactionsAvailable = canUseMetatransactions(userWalletNetworkId);

  return metatransactionsAvailable && metatransactionEnabled;
}

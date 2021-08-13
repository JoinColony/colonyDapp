import { Extension } from '@colony/colony-js';

import {
  ColonyExtensionQuery,
  ColonyExtensionQueryVariables,
  ColonyExtensionDocument,
  ColonyExtensionsQuery,
  ColonyExtensionsQueryVariables,
  ColonyExtensionsDocument,
  ProcessedColonyQuery,
  ProcessedColonyQueryVariables,
  ProcessedColonyDocument,
  WhitelistedUsersDocument,
  WhitelistedUsersQuery,
  WhitelistedUsersQueryVariables,
  SubgraphExtensionEventsQuery,
  SubgraphExtensionEventsQueryVariables,
  SubgraphExtensionEventsDocument,
  WhitelistPolicyQuery,
  WhitelistPolicyQueryVariables,
  WhitelistPolicyDocument,
  getLoggedInUser,
  UserWhitelistStatusQuery, 
  UserWhitelistStatusQueryVariables,
  UserWhitelistStatusDocument,
} from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';

export function* refreshExtension(
  colonyAddress: string,
  extensionId: string,
  extensionAddress?: string,
) {
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

  if (extensionId === Extension.Whitelist) {
    const { walletAddress } = yield getLoggedInUser();

    yield apolloClient.query<
      WhitelistedUsersQuery,
      WhitelistedUsersQueryVariables
    >({
      query: WhitelistedUsersDocument,
      variables: {
        colonyAddress,
      },
      fetchPolicy: 'network-only',
    });
    yield apolloClient.query<
      WhitelistPolicyQuery,
      WhitelistPolicyQueryVariables
    >({
      query: WhitelistPolicyDocument,
      variables: {
        colonyAddress,
      },
      fetchPolicy: 'network-only',
    });
    yield apolloClient.query<
      UserWhitelistStatusQuery,
      UserWhitelistStatusQueryVariables
    >({
      query: UserWhitelistStatusDocument,
      variables: {
        colonyAddress,
        userAddress: walletAddress,
      },
      fetchPolicy: 'network-only',
    });
  }

  yield apolloClient.query<ColonyExtensionQuery, ColonyExtensionQueryVariables>(
    {
      query: ColonyExtensionDocument,
      variables: {
        colonyAddress,
        extensionId,
      },
      fetchPolicy: 'network-only',
    },
  );
  yield apolloClient.query<
    ColonyExtensionsQuery,
    ColonyExtensionsQueryVariables
  >({
    query: ColonyExtensionsDocument,
    variables: {
      address: colonyAddress,
    },
    fetchPolicy: 'network-only',
  });
  yield apolloClient.query<ProcessedColonyQuery, ProcessedColonyQueryVariables>(
    {
      query: ProcessedColonyDocument,
      variables: {
        address: colonyAddress,
      },
      fetchPolicy: 'network-only',
    },
  );

  yield apolloClient.query<
    SubgraphExtensionEventsQuery,
    SubgraphExtensionEventsQueryVariables
  >({
    query: SubgraphExtensionEventsDocument,
    variables: {
      colonyAddress: colonyAddress.toLowerCase(),
      extensionAddress: extensionAddress?.toLowerCase() || '',
    },
    fetchPolicy: 'network-only',
  });
}

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
} from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';

export function* refreshExtension(colonyAddress: string, extensionId: string) {
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

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
}

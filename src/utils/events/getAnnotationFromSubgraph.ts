import {
  SubgraphAnnotationEventsQuery,
  SubgraphAnnotationEventsQueryVariables,
  SubgraphAnnotationEventsDocument,
} from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';
import { Address, SortDirection } from '~types/index';

import { parseSubgraphEvent, sortSubgraphEventByIndex } from './subgraphEvents';

export const getAnnotationFromSubgraph = async (
  userAddress: Address,
  transactionHash: string,
) => {
  const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

  const { data: subgraphEvents } = await apolloClient.query<
    SubgraphAnnotationEventsQuery,
    SubgraphAnnotationEventsQueryVariables
  >({
    query: SubgraphAnnotationEventsDocument,
    variables: {
      transactionHash,
    },
  });

  const [mostRecentAnnotation] =
    subgraphEvents?.annotationEvents
      .map(parseSubgraphEvent)
      .filter(({ values: { agent } }) => agent === userAddress)
      .sort((firstEvent, secondEvent) =>
        sortSubgraphEventByIndex(firstEvent, secondEvent, SortDirection.DESC),
      ) || [];

  return mostRecentAnnotation;
};

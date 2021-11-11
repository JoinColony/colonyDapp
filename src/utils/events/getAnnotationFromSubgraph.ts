import { ApolloClient } from '@apollo/client';

import {
  SubgraphAnnotationEventsQuery,
  SubgraphAnnotationEventsQueryVariables,
  SubgraphAnnotationEventsDocument,
} from '~data/index';
import { Address, SortDirection } from '~types/index';

import { parseSubgraphEvent, sortSubgraphEventByIndex } from './subgraphEvents';

export const getAnnotationFromSubgraph = async (
  userAddress: Address,
  transactionHash: string,
  apolloClient: ApolloClient<object>,
) => {
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

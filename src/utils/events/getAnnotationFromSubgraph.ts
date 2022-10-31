import { ApolloClient } from '@apollo/client';

import {
  SubgraphAnnotationEventsQuery,
  SubgraphAnnotationEventsQueryVariables,
  SubgraphAnnotationEventsDocument,
} from '~data/index';
import { Address } from '~types/index';

import { parseSubgraphEvent } from './subgraphEvents';

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
      sortDirection: 'desc',
    },
  });

  const [mostRecentAnnotation] =
    subgraphEvents?.annotationEvents
      .map(parseSubgraphEvent)
      /*
       * @NOTE Only show annotations from users that created the transaction
       * This a poor man's spam protenction, but in all fairness we should not
       * be filtering these out, and show the most recent annotation, no matter
       * who sent it
       */
      .filter(
        ({ values: { agent, address } }) =>
          agent.toLowerCase() === userAddress.toLowerCase() ||
          address.toLowerCase() === userAddress.toLowerCase(),
      ) || [];

  return mostRecentAnnotation;
};

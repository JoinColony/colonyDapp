import { Resolvers } from '@apollo/client';

import { Context } from '~context/index';
import {
  SubgraphColonyQuery,
  SubgraphColonyQueryVariables,
  SubgraphColonyDocument,
} from '~data/index';

import { getProcessedColony } from './colony';

export const metaColonyResolvers = ({
  colonyManager: { networkClient },
  apolloClient,
  ipfsWithFallback,
}: Required<Context>): Resolvers => ({
  Query: {
    async processedMetaColony() {
      try {
        const metaColonyAddress = await networkClient.getMetaColony();
        const metaColonyENSName = await networkClient.lookupRegisteredENSDomain(
          metaColonyAddress,
        );
        if (metaColonyENSName) {
          const { data } = await apolloClient.query<
            SubgraphColonyQuery,
            SubgraphColonyQueryVariables
          >({
            query: SubgraphColonyDocument,
            variables: {
              /*
               * First convert it a string since in cases where the network name
               * cannot be found via ENS it will throw an error
               *
               * Converting this to string basically converts the error object into
               * a string form
               */
              address: metaColonyAddress.toLowerCase(),
            },
            fetchPolicy: 'network-only',
          });
          if (data?.colony) {
            const processedColony = await getProcessedColony(
              data.colony,
              metaColonyAddress,
              ipfsWithFallback,
            );
            return {
              ...processedColony,
              __typename: 'ProcessedMetaColony',
            };
          }
          return null;
        }
        return null;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});

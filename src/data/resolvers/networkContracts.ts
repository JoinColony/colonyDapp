import { Resolvers } from '@apollo/client';

import { NetworkContractsDocument } from '../generated';

export const networkContractsResolvers = (): Resolvers => ({
  Mutation: {
    setNetworkContracts: (_root, { input }, { cache }) => {
      const { networkContracts } = cache.readQuery({
        query: NetworkContractsDocument,
      });
      const changedData = {
        networkContracts: { ...networkContracts, ...input },
      };
      cache.writeQuery({ query: NetworkContractsDocument, data: changedData });
      return changedData.networkContracts;
    },
  },
});

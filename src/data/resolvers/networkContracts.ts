import { Resolvers } from '@apollo/client';

import { Context } from '~context/index';
import { NetworkContractsDocument } from '../generated';

export const initialCache = {
  networkContracts: {
    __typename: 'NetworkContracts',
    version: null,
    feeInverse: null,
  },
};

export const networkContractsResolvers = ({
  colonyManager: { networkClient },
}: Required<Context>): Resolvers => ({
  Mutation: {
    async updateNetworkContracts(_root, _, { cache }) {
      const { networkContracts } = cache.readQuery({
        query: NetworkContractsDocument,
      });
      const version = await networkClient.getCurrentColonyVersion();
      const feeInverse = await networkClient.getFeeInverse();
      const changedData = {
        networkContracts: {
          ...networkContracts,
          version: version.toString(),
          /*
           * Network fee inverse as defined by the ColonyNetwork contract.
           * If the current fee is 1%, this will be `100`.
           */
          feeInverse: feeInverse.toString(),
        },
      };
      cache.writeQuery({ query: NetworkContractsDocument, data: changedData });
      return changedData.networkContracts;
    },
  },
});

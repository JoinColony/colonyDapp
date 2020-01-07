import { Resolvers } from 'apollo-client';

import ENS from '~lib/ENS';
import { ContextType } from '~context/index';

export const colonyResolvers = ({
  colonyManager: { networkClient },
  ens,
}: ContextType): Resolvers => ({
  Query: {
    async userAddress(_, { name }) {
      const address = await ens.getAddress(
        ENS.getFullDomain('user', name),
        networkClient,
      );
      return address;
    },
    async username(_, { address }) {
      const domain = await ens.getDomain(address, networkClient);
      return ENS.stripDomainParts('user', domain);
    },
  },
});

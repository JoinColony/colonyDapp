import { Resolvers } from 'apollo-client';

import ENS from '~lib/ENS';
import { Address } from '~types/index';
import { ContextType } from '~context/index';

import { getToken } from './token';

export const userResolvers = ({
  colonyManager: { networkClient },
  colonyManager,
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
  User: {
    async tokens(
      { tokenAddresses }: { tokenAddresses: Address[] },
      _,
      { client },
    ) {
      return Promise.all(
        tokenAddresses.map(tokenAddress =>
          getToken({ colonyManager, client }, tokenAddress),
        ),
      );
    },
  },
});

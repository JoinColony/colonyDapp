import { Resolvers } from 'apollo-client';

import { ContextType } from '~context/index';
import ENS from '~lib/ENS';
import { Address } from '~types/index';

import { getToken } from './token';

const getUserReputation = async (
  { networkClient }: ContextType['colonyManager'],
  address: Address,
  colonyAddress: Address,
  skillId: number,
): Promise<string> => {
  const { reputationAmount } = await networkClient.getReputation({
    address,
    colonyAddress,
    skillId,
  });
  return reputationAmount || '0';
};

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
    async userReputation(
      _,
      {
        address,
        colonyAddress,
        skillId = 0,
      }: { address: Address; colonyAddress: Address; skillId?: number },
    ) {
      const reputation = await getUserReputation(
        colonyManager,
        address,
        colonyAddress,
        skillId,
      );
      return reputation;
    },
    async username(_, { address }) {
      const domain = await ens.getDomain(address, networkClient);
      return ENS.stripDomainParts('user', domain);
    },
  },
  User: {
    async reputation(
      user,
      {
        colonyAddress,
        skillId = 0,
      }: { colonyAddress: Address; skillId: number },
    ) {
      const {
        profile: { walletAddress },
      } = user;
      const reputation = await getUserReputation(
        colonyManager,
        walletAddress,
        colonyAddress,
        skillId,
      );
      return {
        ...user,
        reputation,
      };
    },
    async tokens(
      { tokenAddresses }: { tokenAddresses: Address[] },
      _,
      { client },
    ) {
      return Promise.all(
        ['0x0', ...tokenAddresses].map(tokenAddress =>
          getToken({ colonyManager, client }, tokenAddress),
        ),
      );
    },
  },
});

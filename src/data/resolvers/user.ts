import { Resolvers } from 'apollo-client';
import {
  ClientType,
  ROOT_DOMAIN_ID,
  getBlockTime,
  getLogs,
} from '@colony/colony-js';
import { BigNumber } from 'ethers/utils';
import { HashZero } from 'ethers/constants';

import { Context } from '~context/index';
import ENS from '~lib/ENS';
import ColonyManager from '~lib/ColonyManager';
import { Address } from '~types/index';
import { createAddress } from '~utils/web3';
import { Transaction } from '~data/index';

import { getToken } from './token';

const getUserReputation = async (
  colonyManager: ColonyManager,
  address: Address,
  colonyAddress: Address,
  domainId: number,
): Promise<BigNumber> => {
  const colonyClient = await colonyManager.getClient(
    ClientType.ColonyClient,
    colonyAddress,
  );
  const { skillId } = await colonyClient.getDomain(domainId);
  const { reputationAmount } = await colonyClient.getReputation(
    skillId,
    address,
  );
  return reputationAmount;
};

export const userResolvers = ({
  colonyManager: { networkClient },
  colonyManager,
  ens,
}: Required<Context>): Resolvers => ({
  Query: {
    async userAddress(_, { name }): Promise<Address> {
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
        domainId = ROOT_DOMAIN_ID,
      }: { address: Address; colonyAddress: Address; domainId?: number },
    ): Promise<string> {
      const reputation = await getUserReputation(
        colonyManager,
        address,
        colonyAddress,
        domainId,
      );
      return reputation.toString();
    },
    async username(_, { address }): Promise<string> {
      const domain = await ens.getDomain(address, networkClient);
      return ENS.stripDomainParts('user', domain);
    },
  },
  User: {
    async reputation(
      user,
      {
        colonyAddress,
        domainId = ROOT_DOMAIN_ID,
      }: { colonyAddress: Address; domainId: number },
    ): Promise<string> {
      const {
        profile: { walletAddress },
      } = user;
      const reputation = await getUserReputation(
        colonyManager,
        walletAddress,
        colonyAddress,
        domainId,
      );
      return reputation.toString();
    },
    async tokens(
      { tokenAddresses }: { tokenAddresses: Address[] },
      _,
      { client },
    ): Promise<Address[]> {
      return Promise.all(
        ['0x0', ...tokenAddresses].map((tokenAddress) =>
          getToken({ colonyManager, client }, tokenAddress),
        ),
      );
    },
    async tokenTransfers({
      walletAddress,
      colonyAddresses,
    }): Promise<Transaction[]> {
      const metaColonyClient = await colonyManager.getMetaColonyClient();
      const { tokenClient } = metaColonyClient;

      const transferFromFilter = tokenClient.filters.Transfer(
        walletAddress,
        null,
        null,
      );
      const transferToFilter = tokenClient.filters.Transfer(
        null,
        walletAddress,
        null,
      );
      const transferFromLogs = await getLogs(tokenClient, transferFromFilter);
      const transferToLogs = await getLogs(tokenClient, transferToFilter);

      const logs = [...transferFromLogs, ...transferToLogs].sort((a, b) => {
        if (a.blockNumber && b.blockNumber) {
          return a.blockNumber - b.blockNumber;
        }
        return 0;
      });

      return Promise.all(
        logs.map(async (log) => {
          const {
            values: { src, dst, wad },
          } = tokenClient.interface.parseLog(log);
          const from = createAddress(src);
          const to = createAddress(dst);
          const date = log.blockHash
            ? await getBlockTime(tokenClient.provider, log.blockHash)
            : 0;
          const colonyAddress = colonyAddresses.find(
            (address) => address === from || address === to,
          );

          return {
            __typename: 'Transaction',
            amount: wad.toString(),
            colonyAddress,
            date,
            from: createAddress(src),
            // I have no idea why this would ever by empty but we rely on this being there
            hash: log.transactionHash || HashZero,
            incoming: to === walletAddress,
            to,
            token: createAddress(log.address),
          };
        }),
      );
    },
  },
});

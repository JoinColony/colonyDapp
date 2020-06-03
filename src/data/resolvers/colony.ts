import { Resolvers } from 'apollo-client';
import { bigNumberify } from 'ethers/utils';
import { ClientType, ColonyVersion, getColonyRoles } from '@colony/colony-js';

import ENS from '~lib/ENS';
import { Address } from '~types/index';
import { Context } from '~context/index';

import { getToken } from './token';

export const colonyResolvers = ({
  colonyManager: { networkClient },
  colonyManager,
  ens,
}: Required<Context>): Resolvers => ({
  Query: {
    async colonyAddress(_, { name }) {
      try {
        const address = await ens.getAddress(
          ENS.getFullDomain('colony', name),
          networkClient,
        );
        return address;
      } catch (error) {
        /*
         * @NOTE This makes the server query fail in case of an unexistent/unregistered colony ENS name
         *
         * Otherwise, the ENS resolution will fail, but not this query.
         * This will then not proceed further to the server query and the data
         * will try to load indefinitely w/o an error
         */
        return error;
      }
    },
    async colonyName(_, { address }) {
      const domain = await ens.getDomain(address, networkClient);
      return ENS.stripDomainParts('colony', domain);
    },
  },
  Colony: {
    async canMintNativeToken({ colonyAddress }) {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      // fetch whether the user is allowed to mint tokens via the colony
      let canMintNativeToken = true;
      try {
        await colonyClient.estimate.mintTokens(bigNumberify(1));
      } catch (error) {
        canMintNativeToken = false;
      }
      return canMintNativeToken;
    },
    async isInRecoveryMode({ colonyAddress }) {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      return colonyClient.isInRecoveryMode();
    },
    async isNativeTokenLocked({ colonyAddress }) {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      let isNativeTokenLocked;
      try {
        const locked = await colonyClient.tokenClient.locked();
        isNativeTokenLocked = locked;
      } catch (error) {
        isNativeTokenLocked = false;
      }
      return isNativeTokenLocked;
    },
    async nativeToken({ nativeTokenAddress }, _, { client }) {
      return getToken({ colonyManager, client }, nativeTokenAddress);
    },
    async tokens(
      { tokenAddresses }: { tokenAddresses: Address[] },
      _,
      { client },
    ) {
      return Promise.all(
        ['0x0', ...tokenAddresses].map((tokenAddress) =>
          getToken({ colonyManager, client }, tokenAddress),
        ),
      );
    },
    async canUnlockNativeToken({ colonyAddress }) {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      let canUnlockNativeToken = true;
      try {
        await colonyClient.tokenClient.unlock();
      } catch (error) {
        canUnlockNativeToken = false;
      }
      return canUnlockNativeToken;
    },
    async roles({ colonyAddress }) {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );

      if (colonyClient.clientVersion === ColonyVersion.GoerliGlider) {
        throw new Error(`Not supported in this version of Colony`);
      }

      const roles = await getColonyRoles(colonyClient);
      return roles.map((userRoles) => ({
        ...userRoles,
        domains: userRoles.domains.map((domainRoles) => ({
          ...domainRoles,
          __typename: 'DomainRoles',
        })),
        __typename: 'UserRoles',
      }));
    },
    async version({ colonyAddress }) {
      const colonyClient = await colonyManager.getClient(
        ClientType.ColonyClient,
        colonyAddress,
      );
      return colonyClient.version();
    },
  },
});

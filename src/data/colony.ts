import BigNumber from 'bn.js';
import { Resolvers } from 'apollo-client';

import ENS from '~lib/ENS';
import { Address } from '~types/index';
import { ContextType } from '~context/index';

import { getToken } from './token';

export const colonyResolvers = ({
  colonyManager: { networkClient },
  colonyManager,
  ens,
}: ContextType): Resolvers => ({
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
         * @NOTE This makes the server query fail in case of an unexistent error
         *
         * Otherwise, the ENS resolution will fail, but not this query.
         * This will then not proceed further to the server query and the data
         * will try to load indefinitely w/o an error
         */
        return undefined;
      }
    },
    async colonyName(_, { address }) {
      const domain = await ens.getDomain(address, networkClient);
      return ENS.stripDomainParts('colony', domain);
    },
  },
  Colony: {
    async canMintNativeToken({ colonyAddress }) {
      const colonyClient = await colonyManager.getColonyClient(colonyAddress);
      // fetch whether the user is allowed to mint tokens via the colony
      let canMintNativeToken = true;
      try {
        await colonyClient.mintTokens.estimate({ amount: new BigNumber(1) });
      } catch (error) {
        canMintNativeToken = false;
      }
      return canMintNativeToken;
    },
    async isInRecoveryMode({ colonyAddress }) {
      const colonyClient = await colonyManager.getColonyClient(colonyAddress);
      const { inRecoveryMode } = await colonyClient.isInRecoveryMode.call();
      return inRecoveryMode;
    },
    async isNativeTokenLocked({ colonyAddress }) {
      const colonyClient = await colonyManager.getColonyClient(colonyAddress);
      let isNativeTokenLocked;
      try {
        const { locked } = await colonyClient.tokenClient.isLocked.call();
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
        ['0x0', ...tokenAddresses].map(tokenAddress =>
          getToken({ colonyManager, client }, tokenAddress),
        ),
      );
    },
    async canUnlockNativeToken({ colonyAddress }) {
      const colonyClient = await colonyManager.getColonyClient(colonyAddress);
      let canUnlockNativeToken = true;
      try {
        await colonyClient.tokenClient.unlock.call({});
      } catch (error) {
        canUnlockNativeToken = false;
      }
      return canUnlockNativeToken;
    },
    async version({ colonyAddress }) {
      const colonyClient = await colonyManager.getColonyClient(colonyAddress);
      const { version } = await colonyClient.getVersion.call();
      return version;
    },
  },
});

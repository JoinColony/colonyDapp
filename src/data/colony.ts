import BigNumber from 'bn.js';
import { Resolvers } from 'apollo-client';

import ENS from '~lib/ENS';
import { ContextType } from '~context/index';

export const colonyResolvers = ({
  colonyManager: { networkClient },
  colonyManager,
  ens,
}: ContextType): Resolvers => ({
  Query: {
    async colonyAddress(_, { name }) {
      const address = await ens.getAddress(
        ENS.getFullDomain('colony', name),
        networkClient,
      );
      return address;
    },
    async colonyName(_, { address }) {
      const domain = await ens.getDomain(address, networkClient);
      return ENS.stripDomainParts('colony', domain);
    },
  },
  Colony: {
    async canMintNativeToken(_, { address }) {
      const colonyClient = await colonyManager.getColonyClient(address);
      // fetch whether the user is allowed to mint tokens via the colony
      let canMintNativeToken = true;
      try {
        await colonyClient.mintTokens.estimate({ amount: new BigNumber(1) });
      } catch (error) {
        canMintNativeToken = false;
      }
      return canMintNativeToken;
    },
    async isInRecoveryMode(_, { address }) {
      const colonyClient = await colonyManager.getColonyClient(address);
      const { inRecoveryMode } = await colonyClient.isInRecoveryMode.call();
      return inRecoveryMode;
    },
    async isNativeTokenLocked(_, { address }) {
      const colonyClient = await colonyManager.getColonyClient(address);
      let isNativeTokenLocked;
      try {
        const { locked } = await colonyClient.tokenClient.isLocked.call();
        isNativeTokenLocked = locked;
      } catch (error) {
        isNativeTokenLocked = false;
      }
      return isNativeTokenLocked;
    },
    async canUnlockNativeToken(_, { address }) {
      const colonyClient = await colonyManager.getColonyClient(address);
      let canUnlockNativeToken = true;
      try {
        await colonyClient.tokenClient.unlock.call({});
      } catch (error) {
        canUnlockNativeToken = false;
      }
      return canUnlockNativeToken;
    },
    async version(_, { address }) {
      const colonyClient = await colonyManager.getColonyClient(address);
      const { version } = await colonyClient.getVersion.call();
      return version;
    },
  },
});

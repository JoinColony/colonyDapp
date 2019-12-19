import BigNumber from 'bn.js';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';

const getBalanceForTokenAndDomain = async (
  colonyClient,
  tokenAddress,
  domainId,
): Promise<BigNumber> => {
  const { potId } = await colonyClient.getDomain.call({ domainId });
  const {
    balance: rewardsPotTotal,
  } = await colonyClient.getFundingPotBalance.call({
    potId,
    token: tokenAddress,
  });
  if (domainId === COLONY_TOTAL_BALANCE_DOMAIN_ID) {
    const {
      total: nonRewardsPotsTotal,
    } = await colonyClient.getNonRewardPotsTotal.call({
      token: tokenAddress,
    });
    return new BigNumber(nonRewardsPotsTotal.add(rewardsPotTotal).toString(10));
  }
  return new BigNumber(rewardsPotTotal.toString(10));
};

export const colonyResolvers = ({
  colonyManager: { networkClient },
  colonyManager,
  ens,
  // FIXME type this
}) => ({
  Query: {
    async colonyAddress(_, { name }) {
      const address = await ens.getAddress(
        ens.constructor.getFullDomain('colony', name),
        networkClient,
      );
      return address;
    },
    async colonyName(_, { address }) {
      const domain = await ens.getDomain(address, networkClient);
      return ens.constructor.stripDomainParts('colony', domain);
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
  ColonyToken: {
    async balances({ address }, { colonyAddress, domainIds }) {
      const colonyClient = await colonyManager.getColonyClient(colonyAddress);
      // FIXME somehow we have to get ETHER into this (on the server?)

      const balances: BigNumber[] = await Promise.all(
        domainIds.map(domainId =>
          getBalanceForTokenAndDomain(colonyClient, address, domainId),
        ),
      );

      return domainIds.map((domainId, idx) => ({
        domainId,
        balance: balances[idx].toString(),
        __typename: 'DomainBalance',
      }));
    },
    async details() {
      // FIXME can be imported from token (make util function)
      throw new Error('Implement me!');
    },
  },
});

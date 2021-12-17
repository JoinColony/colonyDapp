import { Resolvers } from '@apollo/client';
import abis from '@colony/colony-js/lib-esm/abis';
import { Contract } from 'ethers';
import { AddressZero } from 'ethers/constants';
import { bigNumberify } from 'ethers/utils';

import { Context } from '~context/index';
import { createAddress } from '~utils/web3';

export const vestingResolvers = ({
  colonyManager: { signer },
  colonyManager,
}: Required<Context>): Resolvers => ({
  Query: {
    async unwrapTokenForMetacolony(_, { userAddress }) {
      // @ts-ignore
      const wrappedTokenAbi = abis.WrappedToken.default.abi;
      try {
        const userTokenBasics = {
          iconHash: undefined,
          verified: true,
          balance: '0',
        };
        const wrappedToken = new Contract(
          process.env.META_WRAPPED_TOKEN_ADDRESS || '',
          wrappedTokenAbi,
          signer,
        );
        const wrappedTokenInfo = {
          name: await wrappedToken.name(),
          symbol: await wrappedToken.symbol(),
          decimals: await wrappedToken.decimals(),
        };
        let wrappedTokenUserBalance = bigNumberify(0);
        if (userAddress) {
          wrappedTokenUserBalance = await wrappedToken.balanceOf(userAddress);
        }

        const unwrappedTokenAddress = await wrappedToken.token();
        const unwrappedToken = await colonyManager.getTokenClient(
          unwrappedTokenAddress,
        );
        const unwrappedTokenInfo = await unwrappedToken.getTokenInfo();
        let unwrappedTokenUserBalance = bigNumberify(0);
        if (userAddress) {
          unwrappedTokenUserBalance = await unwrappedToken.balanceOf(
            userAddress,
          );
        }

        return {
          wrappedToken: {
            ...userTokenBasics,
            ...wrappedTokenInfo,
            address: process.env.META_WRAPPED_TOKEN_ADDRESS
              ? createAddress(process.env.META_WRAPPED_TOKEN_ADDRESS)
              : AddressZero,
            balance: wrappedTokenUserBalance.toString(),
          },
          unwrappedToken: {
            ...userTokenBasics,
            ...unwrappedTokenInfo,
            address: unwrappedTokenAddress,
            balance: unwrappedTokenUserBalance.toString(),
          },
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    async claimTokensFromMetacolony(_, { userAddress }) {
      // @ts-ignore
      const vestingContractAbi = abis.vestingSimple.default.abi;
      try {
        const userTokenBasics = {
          iconHash: undefined,
          verified: true,
          balance: '0',
        };
        const vestingContract = new Contract(
          process.env.META_VESTING_CONTRACT_ADDRESS || '',
          vestingContractAbi,
          signer,
        );

        const vestingTokenAddress = await vestingContract.token();
        const vestingToken = await colonyManager.getTokenClient(
          vestingTokenAddress,
        );
        const vestingTokenInfo = await vestingToken.getTokenInfo();

        let vestingTokenUserBalance = bigNumberify(0);
        if (userAddress) {
          vestingTokenUserBalance = await vestingToken.balanceOf(userAddress);
        }

        const userGrants = await vestingContract.grants(userAddress);

        const [
          amount = bigNumberify(0),
          claimed = bigNumberify(0),
        ] = userGrants;

        const claimable = await vestingContract.getClaimable(amount);

        return {
          grantsToken: {
            ...userTokenBasics,
            ...vestingTokenInfo,
            address: process.env.META_WRAPPED_TOKEN_ADDRESS
              ? createAddress(process.env.META_WRAPPED_TOKEN_ADDRESS)
              : AddressZero,
            balance: vestingTokenUserBalance.toString(),
          },
          grants: {
            totalAllocation: amount.toString(),
            claimable: claimable.sub(claimed).toString(),
            claimed: claimed.toString(),
          },
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
});

import Web3 from 'web3';
import Web3Adapter from '@gnosis.pm/safe-web3-lib';
import Safe from '@gnosis.pm/safe-core-sdk';
import { Network } from '@colony/colony-js';

import {
  DEFAULT_NETWORK,
  NETWORK_DATA,
  RINKEBY_TEST_NETWORK,
} from '~constants';

export const getSafeCoreSDK = async (
  walletAddress: string,
  safeAddress: string,
) => {
  const onLocalDevEnvironment = process.env.NETWORK === Network.Local;
  // @NOTE: RINKEBY can be replaced by any other network you would like to use for testing so long as they are supported by Gnosis Safe
  const currentNetworkData = onLocalDevEnvironment
    ? RINKEBY_TEST_NETWORK
    : NETWORK_DATA[process.env.NETWORK || DEFAULT_NETWORK];
  const web3 = new Web3(
    new Web3.providers.HttpProvider(currentNetworkData.rpcUrl || ''),
  );
  const ethAdapter = new Web3Adapter({ web3, signerAddress: walletAddress });

  try {
    const safeSdk = await Safe.create({
      ethAdapter,
      safeAddress,
    });
    return safeSdk;
  } catch (error) {
    console.error(error);
    return null;
  }
};

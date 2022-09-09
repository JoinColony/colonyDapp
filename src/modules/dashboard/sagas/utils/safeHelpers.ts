import Web3 from 'web3';
import Web3Adapter from '@gnosis.pm/safe-web3-lib';
import Safe from '@gnosis.pm/safe-core-sdk';
import { Network } from '@colony/colony-js';

import {
  SAFE_NETWORKS,
  DEFAULT_NETWORK,
  NETWORK_DATA,
  RINKEBY_NETWORK,
} from '~constants';
import { Address } from '~types/index';

export interface SelectedSafe {
  id: Address;
  profile: {
    displayName: string;
    walletAddress: Address;
  };
}

export type SelectedNFT = SelectedSafe;

export const getSafeCoreSDK = async (
  walletAddress: string,
  safeAddress: string,
) => {
  const onLocalDevEnvironment = process.env.NETWORK === Network.Local;
  // @NOTE: RINKEBY can be replaced by any other network you would like to use for testing so long as they are supported by Safe
  const currentNetworkData = onLocalDevEnvironment
    ? RINKEBY_NETWORK
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

export const getTxServiceBaseUrl = (selectedChain: string) => {
  const selectedNetwork = SAFE_NETWORKS.find(
    (network) => network.name === selectedChain,
  );

  if (!selectedNetwork || !selectedNetwork.safeTxService) {
    throw new Error(`Selected chain ${selectedChain} not currently supported.`);
  }

  return selectedNetwork.safeTxService;
};

export const getIdFromNFTDisplayName = (displayName: string) => {
  const chunks = displayName.split(' ');
  return chunks[chunks.length - 1].substring(1);
};

export const getChainNameFromSafe = (safe: SelectedSafe) => {
  const splitDisplayName = safe.profile.displayName.split(' ');
  const chainNameInBrackets = splitDisplayName[splitDisplayName.length - 1];
  return chainNameInBrackets.substring(1, chainNameInBrackets.length - 1);
};

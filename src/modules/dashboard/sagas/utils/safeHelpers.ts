import Web3 from 'web3';
import Web3Adapter from '@gnosis.pm/safe-web3-lib';
import Safe from '@gnosis.pm/safe-core-sdk';
import SafeServiceClient from '@gnosis.pm/safe-service-client';

import { Network } from '@colony/colony-js';
import {
  GNOSIS_SAFE_NAMES_MAP,
  GNOSIS_SAFE_NETWORKS,
  RINKEBY_NETWORK,
} from '~constants';
import {
  SafeTransaction,
  Safe as ISafe,
} from '~redux/types/actions/colonyActions';
import { Address } from '~types/index';

export const onLocalDevEnvironment = process.env.NETWORK === Network.Local;

// Assumes you are testing a Safe on Rinkeby.
// In production, it uses Metamask as the provider.

export const getWeb3Provider = () => {
  return new Web3(
    onLocalDevEnvironment ? RINKEBY_NETWORK.rpcUrl : Web3.givenProvider,
  );
};

const web3 = getWeb3Provider();

export const getSignerAddress = async () => {
  let signerAddress;
  if (onLocalDevEnvironment) {
    if (!process.env.SIGNER_PRIVATE_KEY) {
      throw new Error(
        'Signer private key is undefined. Please set in your .env file.',
      );
    }
    const signer = web3.eth.accounts.privateKeyToAccount(
      process.env.SIGNER_PRIVATE_KEY,
    );
    web3.eth.accounts.wallet.add(signer);
    signerAddress = signer.address;
  } else {
    signerAddress = await web3.eth.getAccounts()[0];
  }
  return signerAddress as string;
};

const getEthAdapater = async () => {
  const signerAddress = await getSignerAddress();
  return new Web3Adapter({ web3, signerAddress });
};

const getNetworkId = async () => {
  const id = await web3.eth.net.getId();
  return id;
};

export const getSafeCoreSDK = async (safeAddress: string) => {
  try {
    const safeSdk = await Safe.create({
      ethAdapter: await getEthAdapater(),
      safeAddress,
    });
    return safeSdk;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getSafeTransactionService = async () => {
  const networkID = await getNetworkId();
  const txServiceUrl = GNOSIS_SAFE_NETWORKS.find(
    (network) => network.chainId === networkID,
  )?.gnosisTxService;
  if (!txServiceUrl) {
    throw new Error('Safe transaction service url not found for this network.');
  }
  const safeService = new SafeServiceClient({
    txServiceUrl,
    ethAdapter: await getEthAdapater(),
  });
  return safeService;
};

export const getRawTransactionData = (txs: SafeTransaction[]) =>
  txs.filter((t) => t.transactionType === 'rawTransaction');

export const isSafeOwnedBySigner = async (safeAddress: Address) => {
  const currentChainId = await web3.eth.net.getId();
  const currentNetwork = GNOSIS_SAFE_NETWORKS.find(
    (network) => network.chainId === currentChainId,
  );
  if (!currentNetwork) {
    throw new Error(
      `Network with chain Id ${currentChainId} is not currently supported.`,
    );
  }
  const signerAddress = await getSignerAddress();
  const ownersSafesListApi = `api/v1/owners/${signerAddress}/safes`;
  const safeOwnersUrl = currentNetwork.gnosisTxService + ownersSafesListApi;
  const response = await fetch(safeOwnersUrl);
  if (response.status === 200) {
    const safeOwner = await response.json();
    return safeOwner.safes.some((address) => address === safeAddress);
  }
  throw new Error('Request to Safe Transaction Service failed.');
};

// Update when safe data is wired in, if necessary.

const getChainNameFromSafe = (safe: ISafe) => {
  const splitDisplayName = safe.profile.displayName.split(' ');
  const chainNameInBrackets = splitDisplayName[splitDisplayName.length - 1];
  return chainNameInBrackets.substring(1, chainNameInBrackets.length - 1);
};

export const isSafeOnCurrentNetwork = async (safe: ISafe) => {
  const networkId = await getNetworkId();
  const networkName = GNOSIS_SAFE_NAMES_MAP[networkId];
  return getChainNameFromSafe(safe) === networkName;
};

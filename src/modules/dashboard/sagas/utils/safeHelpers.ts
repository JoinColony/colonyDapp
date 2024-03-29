import Web3 from 'web3';
import { getTokenClient, Network } from '@colony/colony-js';
import { Contract, ethers } from 'ethers';
import abis from '@colony/colony-js/lib-esm/abis';
import moveDecimal from 'move-decimal-point';
import { AddressZero } from 'ethers/constants';

import { ColonySafe, SafeTransaction } from '~data/index';
import { Address, ModuleAddress } from '~types/index';
import { GNOSIS_AMB_BRIDGES, SAFE_NETWORKS } from '~constants';
import { getArrayFromString } from '~utils/safes';

import { erc721, ForeignAMB, HomeAMB } from './abis'; // Temporary

export interface SafeTxData {
  title: string;
  transactions: SafeTransaction[];
  safeData: Omit<ColonySafe, 'safeName' | 'moduleContractAddress'>;
  annotationMessage?: string;
}

export interface SelectedSafe {
  id: ModuleAddress; // Making explicit that this is the module address
  profile: {
    displayName: string;
    walletAddress: Address; // And this is the safe address
  };
}

export interface SelectedNFT extends SelectedSafe {
  id: string; // id is address + id,
}

const { ZodiacBridgeModule } = abis;

/* eslint-disable prefer-destructuring */
const LOCAL_HOME_BRIDGE_ADDRESS = process.env.LOCAL_HOME_BRIDGE_ADDRESS;
const LOCAL_FOREIGN_BRIDGE_ADDRESS = process.env.LOCAL_FOREIGN_BRIDGE_ADDRESS;
const LOCAL_ERC721_ADDRESS = process.env.LOCAL_ERC721_ADDRESS;
const LOCAL_SAFE_ADDRESS = process.env.LOCAL_SAFE_ADDRESS;
const LOCAL_SAFE_TOKEN_ADDRESS = process.env.LOCAL_SAFE_TOKEN_ADDRESS;
/* eslint-enable prefer-destructuring */

const LOCAL_HOME_CHAIN = 'http://127.0.0.1:8545';
const LOCAL_FOREIGN_CHAIN = 'http://127.0.0.1:8546';
const LOCAL_TOKEN_ID = 1; // set in start-bridging-environment.js

export const onLocalDevEnvironment =
  process.env.NETWORK === Network.Local &&
  process.env.NODE_ENV === 'development';

export const getHomeProvider = () => {
  return onLocalDevEnvironment
    ? new ethers.providers.JsonRpcProvider(LOCAL_HOME_CHAIN)
    : new ethers.providers.Web3Provider(Web3.givenProvider); // Metamask
};

export const getForeignProvider = (safeChainId: string) => {
  const network = SAFE_NETWORKS.find((n) => n.chainId === Number(safeChainId));

  if (!network) {
    throw new Error(
      `Network not found. Please ensure safe is deployed to a supported network.`,
    );
  }

  return new ethers.providers.JsonRpcProvider(
    onLocalDevEnvironment ? LOCAL_FOREIGN_CHAIN : network.rpcUrl,
  );
};

export const getForeignBridgeByChain = (safeChainId: string) => {
  const foreignProvider = getForeignProvider(safeChainId);
  const foreignSigner = foreignProvider.getSigner();
  const foreignBridgeAddress: string | undefined = onLocalDevEnvironment
    ? LOCAL_FOREIGN_BRIDGE_ADDRESS
    : GNOSIS_AMB_BRIDGES[safeChainId]?.foreignAMB;

  if (!foreignBridgeAddress) {
    throw new Error(
      `Foreign bridge address for chain with chainID ${safeChainId} not found.`,
    );
  }
  // @ts-ignore abi type is wrong.
  return new ethers.Contract(foreignBridgeAddress, ForeignAMB, foreignSigner);
};

export const getHomeBridgeByChain = (safeChainId: string) => {
  const homeProvider = getHomeProvider();
  const homeSigner = homeProvider.getSigner();
  const homeBridgeAddress: string | undefined = onLocalDevEnvironment
    ? LOCAL_HOME_BRIDGE_ADDRESS
    : GNOSIS_AMB_BRIDGES[safeChainId]?.homeAMB;

  if (!homeBridgeAddress) {
    throw new Error(
      `Home bridge address for chain with chainID ${safeChainId} not found.`,
    );
  }
  // @ts-ignore abi type is wrong.
  return new ethers.Contract(homeBridgeAddress, HomeAMB, homeSigner);
};

const getErc721 = (
  safe: Omit<ColonySafe, 'safeName'>,
  erc721Address: Address,
) => {
  const foreignProvider = getForeignProvider(safe.chainId);

  return new ethers.Contract(
    erc721Address,
    erc721.default.abi,
    foreignProvider,
  );
};

const getTokenInterface = async (
  safe: Omit<ColonySafe, 'safeName'>,
  tokenAddress: Address,
) => {
  const foreignProvider = getForeignProvider(safe.chainId);
  const tokenClient = await getTokenClient(tokenAddress, foreignProvider);
  return tokenClient.interface;
};

export const getZodiacModule = (
  zodiacModuleAddress: Address,
  safe: Omit<ColonySafe, 'safeName'>,
) => {
  const foreignProvider = getForeignProvider(safe.chainId);
  return new ethers.Contract(
    zodiacModuleAddress,
    // @ts-ignore abi type is wrong.
    ZodiacBridgeModule.default.abi,
    foreignProvider,
  );
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

export const getTokenIdFromNFTId = (nftId: SelectedNFT['id']) => {
  const chunks = nftId.split(' ');
  return chunks[chunks.length - 1];
};

export const nftNameContainsTokenId = (tokenName: string): boolean => {
  const chunks = tokenName.trim().split(' ');
  // using 'starts with #' to identify a token id
  if (chunks[chunks.length - 1].startsWith('#')) {
    return true;
  }

  return false;
};

// in the event the token id is also appended to the token name
export const extractTokenName = (tokenName: string) => {
  const chunks = tokenName.trim().split(' ');
  // using 'starts with #' to identify a token id
  if (chunks[chunks.length - 1].startsWith('#')) {
    return chunks.slice(0, chunks.length - 1).join(' ');
  }

  return tokenName;
};

export const getRawTransactionData = (
  zodiacBridgeModule: Contract,
  transaction: SafeTransaction,
) => {
  if (!transaction.recipient) {
    throw new Error('Transaction does not contain a recipient.');
  }

  if (transaction.rawAmount === null) {
    throw new Error('Transaction does not contain an amount');
  }

  return zodiacBridgeModule.interface.functions.executeTransaction.encode([
    transaction.recipient.profile.walletAddress,
    transaction.rawAmount,
    transaction.data,
    0,
  ]);
};

export const getTransferNFTData = (
  zodiacBridgeModule: Contract,
  safe: Omit<ColonySafe, 'safeName'>,
  transaction: SafeTransaction,
) => {
  if (!transaction.nftData) {
    throw new Error('Transaction does not contain NFT data.');
  }

  if (!transaction.recipient) {
    throw new Error('Transaction does not contain a recipient.');
  }

  // If this function is called, nftData will be defined.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const nftData = transaction.nftData!;
  const safeAddress = onLocalDevEnvironment
    ? LOCAL_SAFE_ADDRESS
    : safe.contractAddress;
  const tokenId = onLocalDevEnvironment ? LOCAL_TOKEN_ID : Number(nftData.id);
  const erc721Address = onLocalDevEnvironment
    ? LOCAL_ERC721_ADDRESS
    : nftData.address;

  if (!safeAddress) {
    throw new Error('LOCAL_SAFE_ADDRESS not set in .env.');
  }

  if (!erc721Address) {
    throw new Error('LOCAL_ERC721_ADDRESS not set in .env.');
  }

  const erc721Contract = getErc721(safe, erc721Address);

  // eslint-disable-next-line max-len
  const safeTransferFromFn = erc721Contract.interface.functions.safeTransferFrom.encode(
    [safeAddress, transaction.recipient.profile.walletAddress, tokenId],
  );

  return zodiacBridgeModule.interface.functions.executeTransaction.encode([
    erc721Address,
    0,
    safeTransferFromFn,
    0,
  ]);
};

export const getTransferFundsData = async (
  zodiacBridgeModule: Contract,
  safe: Omit<ColonySafe, 'safeName'>,
  transaction: SafeTransaction,
) => {
  if (!transaction.tokenData) {
    throw new Error('Transaction does not contain token data.');
  }

  if (!transaction.recipient) {
    throw new Error('Transaction does not contain a recipient.');
  }

  const safeAddress = onLocalDevEnvironment
    ? LOCAL_SAFE_ADDRESS
    : safe.contractAddress;
  const tokenAddress = onLocalDevEnvironment
    ? LOCAL_SAFE_TOKEN_ADDRESS
    : transaction.tokenData.address;

  if (!safeAddress) {
    throw new Error('LOCAL_SAFE_ADDRESS not set in .env.');
  }

  if (!tokenAddress) {
    throw new Error('LOCAL_SAFE_TOKEN_ADDRESS not set in .env.');
  }

  const isSafeNativeToken = tokenAddress === AddressZero;
  const tokenDecimals = transaction.tokenData.decimals;
  const { recipient } = transaction;
  const getAmount = (): number | string => {
    if (isSafeNativeToken) {
      return moveDecimal(transaction.amount, tokenDecimals); // moveDecimal returns a string
    }
    return 0;
  };
  const getData = async () => {
    if (isSafeNativeToken) {
      return '0x';
    }
    const TokenInterface = await getTokenInterface(safe, tokenAddress);
    const transferAmount = moveDecimal(transaction.amount, tokenDecimals);
    return TokenInterface.functions.transfer.encode([
      recipient.profile.walletAddress,
      transferAmount,
    ]);
  };
  const getRecipient = (): string => {
    if (isSafeNativeToken) {
      return recipient.profile.walletAddress;
    }
    return tokenAddress;
  };

  return zodiacBridgeModule.interface.functions.executeTransaction.encode([
    getRecipient(),
    getAmount(),
    await getData(),
    0,
  ]);
};

const isArrayParameter = (parameter: string): boolean =>
  parameter[0] + parameter[parameter.length - 1] === '[]';

const extractMethodArgs = (
  functionName: string,
  transaction: Record<string, any>,
) => ({ name = '' }) => {
  const paramName = `${name}-${functionName}`;
  if (isArrayParameter(transaction[paramName])) {
    return getArrayFromString(transaction[paramName]);
  }
  return transaction[paramName];
};

export const getContractInteractionData = async (
  zodiacBridgeModule: Contract,
  safe: Omit<ColonySafe, 'safeName'>,
  transaction: SafeTransaction,
) => {
  if (!transaction.abi) {
    throw new Error('Transaction does not contain an ABI.');
  }

  if (!transaction.contract) {
    throw new Error('Transaction does not contain a contract address.');
  }

  if (!transaction.contractFunction) {
    throw new Error('Transaction does not contain a contract function.');
  }

  const safeAddress = onLocalDevEnvironment
    ? LOCAL_SAFE_ADDRESS
    : safe.contractAddress;
  const contractAddress = onLocalDevEnvironment
    ? LOCAL_SAFE_TOKEN_ADDRESS
    : transaction.contract.profile.walletAddress;
  let abi: string;
  let contractFunction: string;

  if (!safeAddress) {
    throw new Error('LOCAL_SAFE_ADDRESS not set in .env.');
  }

  if (!contractAddress) {
    throw new Error('LOCAL_SAFE_TOKEN_ADDRESS not set in .env.');
  }

  if (onLocalDevEnvironment) {
    const TokenInterface = await getTokenInterface(safe, contractAddress);
    abi = JSON.stringify(TokenInterface.abi);
    contractFunction = 'transferFrom';
  } else {
    abi = transaction.abi;
    contractFunction = transaction.contractFunction;
  }

  const getData = () => {
    const foreignProvider = getForeignProvider(safe.chainId);
    const contract = new ethers.Contract(contractAddress, abi, foreignProvider);
    const { inputs, name = '' } = contract.interface.functions[
      contractFunction
    ];

    const transactionValues = onLocalDevEnvironment
      ? {
          ...transaction,
          // src, dst and wad are the param names of the transferFrom function
          [`src-transferFrom`]: safeAddress,
          [`dst-transferFrom`]: AddressZero,
          [`wad-transferFrom`]: 1,
        }
      : transaction;
    const args = inputs?.map(extractMethodArgs(name, transactionValues)) || [];

    return contract.interface.functions[name].encode(args);
  };

  const encodedData = getData();

  return zodiacBridgeModule.interface.functions.executeTransaction.encode([
    contractAddress,
    0,
    encodedData,
    0,
  ]);
};

export const getChainNameFromSafe = (safeDisplayName: string) => {
  return safeDisplayName.match(/\(([^()]*)\)$/)?.pop() || '';
};

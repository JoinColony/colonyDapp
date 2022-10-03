import Web3 from 'web3';
import { getTokenClient, Network } from '@colony/colony-js';
import { Contract, ethers } from 'ethers';
import abis from '@colony/colony-js/lib-esm/abis';
import moveDecimal from 'move-decimal-point';
import { AddressZero } from 'ethers/constants';
import { BigNumber } from 'ethers/utils';

import { erc721 } from './abis'; // Temporary
import { SafeTransaction } from '~dashboard/Dialogs/ControlSafeDialog/ControlSafeDialog';
import { ColonySafe } from '~data/index';
import { Address, ModuleAddress } from '~types/index';
import { GNOSIS_AMB_BRIDGES, SAFE_NETWORKS } from '~constants';

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

const { ZodiacBridgeModule, AMB } = abis;

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

const getHomeProvider = () => {
  return onLocalDevEnvironment
    ? new ethers.providers.JsonRpcProvider(LOCAL_HOME_CHAIN)
    : new ethers.providers.Web3Provider(Web3.givenProvider); // Metamask
};

const getForeignProvider = (safe: Omit<ColonySafe, 'safeName'>) => {
  const network = SAFE_NETWORKS.find((n) => n.chainId === Number(safe.chainId));

  if (!network) {
    throw new Error(
      `Network not found. Please ensure safe is deployed to a supported network.`,
    );
  }

  return new ethers.providers.JsonRpcProvider(
    onLocalDevEnvironment ? LOCAL_FOREIGN_CHAIN : network.rpcUrl,
  );
};

export const getHomeBridge = (safe: Omit<ColonySafe, 'safeName'>) => {
  const homeProvider = getHomeProvider();
  const homeSigner = homeProvider.getSigner();
  const homeBridgeAddress: string | undefined = onLocalDevEnvironment
    ? LOCAL_HOME_BRIDGE_ADDRESS
    : GNOSIS_AMB_BRIDGES[safe.chainId]?.homeAMB;

  if (!homeBridgeAddress) {
    throw new Error(
      `Home bridge address for chain with chainID ${safe.chainId} not found.`,
    );
  }
  // @ts-ignore abi type is wrong.
  return new ethers.Contract(homeBridgeAddress, AMB.default.abi, homeSigner);
};

/* Currently only used to get the ForeignBridgeMock contract from Colony Network, for testing locally. */
const getBuildFromColonyNetwork = (contractName: string) => {
  /*
   * "isProduction" is injected by webpack in the relevant config.
   * This is to avoid a github actions build error. https://github.com/JoinColony/colonyDapp/actions/runs/3175487585/jobs/5176947845
   */
  // @ts-ignore
  // eslint-disable-next-line no-undef
  if (!isProduction) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, import/no-dynamic-require
    return require(`~lib/colonyNetwork/build/contracts/${contractName}.json`);
  }
  return undefined;
};

/* Only used locally in order to confirm foreign bridge received message from home bridge. */
export const getForeignBridgeMock = () => {
  if (!onLocalDevEnvironment) {
    return undefined;
  }

  if (!LOCAL_FOREIGN_BRIDGE_ADDRESS) {
    throw new Error(
      `Local foreign bridge address not found. Please set in your .env.`,
    );
  }

  let ForeignBridgeMock;

  /*
   * process.env.DEV is set by the QA server in case we want to have a debug build.
   * We don't have access to the compiled contracts then.
   */
  if (!process.env.DEV) {
    try {
      ForeignBridgeMock = getBuildFromColonyNetwork('ForeignBridgeMock');
    } catch {
      throw new Error(
        `Ensure you're on the correct colonyNetwork branch and that the ForeignBridgeMock is in the build folder.`,
      );
    }
  }

  if (ForeignBridgeMock) {
    return new ethers.Contract(
      LOCAL_FOREIGN_BRIDGE_ADDRESS,
      ForeignBridgeMock.abi,
      new ethers.providers.JsonRpcProvider(LOCAL_FOREIGN_CHAIN),
    );
  }

  return undefined;
};

const getErc721 = (
  safe: Omit<ColonySafe, 'safeName'>,
  erc721Address: Address,
) => {
  const foreignProvider = getForeignProvider(safe);

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
  const foreignProvider = getForeignProvider(safe);
  const tokenClient = await getTokenClient(tokenAddress, foreignProvider);
  return tokenClient.interface;
};

export const getZodiacModule = (
  zodiacModuleAddress: Address,
  safe: Omit<ColonySafe, 'safeName'>,
) => {
  const foreignProvider = getForeignProvider(safe);
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

export const getIdFromNFTDisplayName = (displayName: string) => {
  const chunks = displayName.split(' ');
  return chunks[chunks.length - 1].substring(1);
};

export const getRawTransactionData = (
  zodiacBridgeModule: Contract,
  transaction: SafeTransaction,
) => {
  if (!transaction.recipient) {
    throw new Error('Transaction does not contain a recipient.');
  }

  return zodiacBridgeModule.interface.functions.executeTransaction.encode([
    transaction.recipient.profile.walletAddress,
    Number(transaction.rawAmount),
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

  const safeAddress = onLocalDevEnvironment
    ? LOCAL_SAFE_ADDRESS
    : safe.contractAddress;
  const tokenId = onLocalDevEnvironment
    ? LOCAL_TOKEN_ID
    : Number(transaction.nftData.id);
  const erc721Address = onLocalDevEnvironment
    ? LOCAL_ERC721_ADDRESS
    : transaction.nftData.address;

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
    : transaction.tokenAddress;

  if (!safeAddress) {
    throw new Error('LOCAL_SAFE_ADDRESS not set in .env.');
  }

  if (!tokenAddress) {
    throw new Error('LOCAL_SAFE_TOKEN_ADDRESS not set in .env.');
  }

  const isSafeNativeToken = tokenAddress === AddressZero;
  const tokenDecimals = transaction.tokenData.decimals;
  const { recipient } = transaction;
  const getAmount = (): number => {
    if (isSafeNativeToken) {
      return moveDecimal(transaction.amount, tokenDecimals);
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

const getParsedJSONOrArrayFromString = (
  parameter: string,
): (string | number)[] | null => {
  try {
    const arrayResult = JSON.parse(parameter);
    return arrayResult.map((value) => {
      if (Number.isInteger(value)) {
        return new BigNumber(value).toString();
      }
      return value;
    });
  } catch (err) {
    return null;
  }
};

const isArrayParameter = (parameter: string): boolean =>
  /(\[\d*])+$/.test(parameter);

const extractMethodArgs = (
  signature: string,
  transaction: Record<string, any>,
) => ({ name = '' }) => {
  if (isArrayParameter(transaction[name || signature])) {
    return getParsedJSONOrArrayFromString(transaction[name || signature]);
  }
  return transaction[name || signature];
};

export const getContractInteractionData = async (
  zodiacBridgeModule: Contract,
  safe: ColonySafe,
  transaction: SafeTransaction,
) => {
  const safeAddress = onLocalDevEnvironment
    ? LOCAL_SAFE_ADDRESS
    : safe.contractAddress;
  const contractAddress = onLocalDevEnvironment
    ? LOCAL_SAFE_TOKEN_ADDRESS
    : transaction.contract.profile.walletAddress;
  let abi: string;
  let contractFunction: string;

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
    const foreignProvider = getForeignProvider(safe);
    const contract = new ethers.Contract(contractAddress, abi, foreignProvider);
    const { inputs, name = '', signature } = contract.interface.functions[
      contractFunction
    ];

    const transactionValues = onLocalDevEnvironment
      ? { ...transaction, src: safeAddress, dst: AddressZero, wad: 1 }
      : transaction;
    const args =
      inputs?.map(extractMethodArgs(signature, transactionValues)) || [];

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
  const splitDisplayName = safeDisplayName.split(' ');
  const chainNameInBrackets = splitDisplayName[splitDisplayName.length - 1];
  return chainNameInBrackets.substring(1, chainNameInBrackets.length - 1);
};

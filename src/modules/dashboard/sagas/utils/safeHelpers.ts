import Web3 from 'web3';
import { Network } from '@colony/colony-js';
import { Contract, ethers } from 'ethers';
import abis from '@colony/colony-js/lib-esm/abis';
import { erc721 } from './abis'; // Temporary
import { SafeTransaction } from '~redux/types/actions/colonyActions';
import { ColonySafe } from '~data/index';
import { Address } from '~types/index';
import { GNOSIS_AMB_BRIDGES, SAFE_NETWORKS } from '~constants';

export interface SelectedSafe {
  id: Address;
  profile: {
    displayName: string;
    walletAddress: Address;
  };
}

export type SelectedNFT = SelectedSafe;

const { ZodiacBridgeModule, AMB } = abis;

/* eslint-disable prefer-destructuring */
const LOCAL_HOME_BRIDGE_ADDRESS = process.env.LOCAL_HOME_BRIDGE_ADDRESS;
const LOCAL_FOREIGN_BRIDGE_ADDRESS = process.env.LOCAL_FOREIGN_BRIDGE_ADDRESS;
const LOCAL_ERC721_ADDRESS = process.env.LOCAL_ERC721_ADDRESS;
const LOCAL_SAFE_ADDRESS = process.env.LOCAL_SAFE_ADDRESS;
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

const getForeignProvider = (safe: ColonySafe) => {
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

export const getHomeBridge = (safe: ColonySafe) => {
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

const getBuildFromColonyNetwork = (contractName: string) =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires, max-len, global-require, import/no-dynamic-require
  require(`~lib/colonyNetwork/build/contracts/${contractName}.json`);

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

  // process.env.DEV is set by the QA server in case we want to have a debug build. We don't have access to the compiled contracts then.
  if (!process.env.DEV) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, max-len, global-require, import/no-dynamic-require
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

const getErc721 = (safe: ColonySafe, erc721Address: Address) => {
  const foreignProvider = getForeignProvider(safe);

  return new ethers.Contract(
    erc721Address,
    erc721.default.abi,
    foreignProvider,
  );
};

export const getZodiacModule = (
  zodiacModuleAddress: Address,
  safe: ColonySafe,
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
) =>
  zodiacBridgeModule.interface.functions.executeTransaction.encode([
    transaction.recipient.profile.walletAddress,
    Number(transaction.amount),
    transaction.data,
    0,
  ]);

export const getTransferNFTData = (
  zodiacBridgeModule: Contract,
  safe: ColonySafe,
  transaction: SafeTransaction,
) => {
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

export const getChainNameFromSafe = (safe: SelectedSafe) => {
  const splitDisplayName = safe.profile.displayName.split(' ');
  const chainNameInBrackets = splitDisplayName[splitDisplayName.length - 1];
  return chainNameInBrackets.substring(1, chainNameInBrackets.length - 1);
};

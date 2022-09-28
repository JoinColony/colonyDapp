import Web3 from 'web3';
import { Network } from '@colony/colony-js';
import { ethers } from 'ethers';
import abis from '@colony/colony-js/lib-esm/abis';

import { SafeTransaction } from '~redux/types/actions/colonyActions';
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

// eslint-disable-next-line prefer-destructuring
const LOCAL_HOME_BRIDGE_ADDRESS = process.env.LOCAL_HOME_BRIDGE_ADDRESS;
// eslint-disable-next-line prefer-destructuring
const LOCAL_FOREIGN_BRIDGE_ADDRESS = process.env.LOCAL_FOREIGN_BRIDGE_ADDRESS;
const LOCAL_HOME_CHAIN = 'http://127.0.0.1:8545';
const LOCAL_FOREIGN_CHAIN = 'http://127.0.0.1:8546';

export const onLocalDevEnvironment =
  process.env.NETWORK === Network.Local &&
  process.env.NODE_ENV === 'development';

const getHomeProvider = () => {
  return onLocalDevEnvironment
    ? new ethers.providers.JsonRpcProvider(LOCAL_HOME_CHAIN)
    : new ethers.providers.Web3Provider(Web3.givenProvider);
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
      ForeignBridgeMock = require(`~lib/colonyNetwork/build/contracts/ForeignBridgeMock.json`);
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

export const getRawTransactionData = (txs: SafeTransaction[]) =>
  txs.filter((t) => t.transactionType === 'rawTransaction');

export const getChainNameFromSafe = (safe: SelectedSafe) => {
  const splitDisplayName = safe.profile.displayName.split(' ');
  const chainNameInBrackets = splitDisplayName[splitDisplayName.length - 1];
  return chainNameInBrackets.substring(1, chainNameInBrackets.length - 1);
};

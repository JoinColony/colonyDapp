import { Network } from '@colony/colony-js';

import { Color } from '~core/ColorTag';

export type TokenInfo = {
  name: string;
  symbol: string;
  decimals?: number;
};

export type NetworkInfo = {
  name: string;
  chainId: number;
  shortName: string;
  apiUri: string;
  description?: string;
  displayENSDomain?: string;
  /**
   * Used just to display references to the current networks's
   */
  blockExplorerName?: string;
  blockExplorerUrl?: string;
  /**
   * Link to a token list from the current network's block explorer.
   * This will just be used for information messages and tooltips.
   * We actually linking to it we have a method that generates the
   * link programatically: `getBlockExplorerLink()`
   */
  tokenExplorerLink?: string;
  contractAddressLink: string;
  /*
   * Used when adding the network to Metamask
   */
  rpcUrl?: string;
  /*
   * Used when interacting with Safe Transaction Service
   */
  safeTxService?: string;
};

export const DEFAULT_NETWORK = process.env.NETWORK || Network.Goerli;
export const COLONY_TOTAL_BALANCE_DOMAIN_ID = 0;
export const DEFAULT_TOKEN_DECIMALS = 18;

export enum ROLES_COMMUNITY {
  founder = 'role.founder',
  admin = 'role.admin',
  member = 'role.member',
}

export const XDAI_TOKEN: TokenInfo = {
  /*
   * Needs to be this exact name, otherwise Metamask marks it as "not valid" when adding it
   */
  name: 'xDAI Token', //
  /*
   * Needs to be this exact name, otherwise Metamask marks it as "not valid" when adding it
   */
  symbol: 'xDAI',
  decimals: 18,
};

export const ETHER_TOKEN: TokenInfo = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
};

export const GOERLI_TOKEN: TokenInfo = {
  name: 'Goerli Ether',
  symbol: 'GOETH',
  decimals: 18,
};

export const GNOSIS_NETWORK: NetworkInfo = {
  /*
   * Needs to be this exact name, otherwise Metamask marks it as "not valid" when adding it
   */
  name: 'Gnosis Chain',
  chainId: 100,
  shortName: 'xDai',
  displayENSDomain: 'joincolony.colonyxdai',
  blockExplorerName: 'Blockscout',
  blockExplorerUrl: 'https://blockscout.com/poa/xdai',
  tokenExplorerLink: 'https://blockscout.com/poa/xdai/tokens',
  contractAddressLink: 'https://blockscout.com/poa/xdai/address',
  rpcUrl: 'https://rpc.gnosischain.com',
  safeTxService: 'https://safe-transaction.xdai.gnosis.io/api',
  apiUri: 'https://blockscout.com/xdai/mainnet/api',
};

export const ETHEREUM_NETWORK: NetworkInfo = {
  name: 'Ethereum',
  chainId: 1,
  shortName: 'ETH',
  blockExplorerName: 'Etherscan',
  blockExplorerUrl: 'https://etherscan.io',
  displayENSDomain: 'joincolony.eth',
  tokenExplorerLink: 'https://etherscan.io/tokens',
  contractAddressLink: 'https://etherscan.io/address',
  rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  safeTxService: 'https://safe-transaction.mainnet.gnosis.io/api',
  apiUri: 'https://api.etherscan.io/api',
};

export const GOERLI_NETWORK: NetworkInfo = {
  name: 'Goerli',
  chainId: 5,
  shortName: 'GTH',
  blockExplorerName: 'Etherscan',
  blockExplorerUrl: 'https://goerli.etherscan.io',
  displayENSDomain: 'joincolony.eth',
  tokenExplorerLink: 'https://goerli.etherscan.io/tokens',
  contractAddressLink: 'https://goerli.etherscan.io/address',
  rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  safeTxService: 'https://safe-transaction.goerli.gnosis.io/api',
  apiUri: 'https://api-goerli.etherscan.io/api',
};

const ARBITRUM_NETWORK: NetworkInfo = {
  name: 'Arbitrum',
  chainId: 42161,
  shortName: 'ETH',
  contractAddressLink: '',
  safeTxService: 'https://safe-transaction.arbitrum.gnosis.io/api',
  rpcUrl: 'https://rpc.ankr.com/arbitrum',
  apiUri: 'https://api.arbiscan.io/api',
};

const AURORA_NETWORK: NetworkInfo = {
  name: 'Aurora',
  chainId: 1313161554,
  shortName: 'ETH',
  contractAddressLink: '',
  safeTxService: 'https://safe-transaction.aurora.gnosis.io/api',
  rpcUrl: 'https://testnet.aurora.dev/',
  apiUri: 'https://api.aurorascan.dev/api',
};

const AVALANCHE_NETWORK: NetworkInfo = {
  name: 'Avalanche',
  chainId: 43114,
  shortName: 'AVAX',
  contractAddressLink: '',
  safeTxService: 'https://safe-transaction.avalanche.gnosis.io/api',
  rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
  apiUri: 'https://api.snowtrace.io/api',
};

export const BINANCE_NETWORK: NetworkInfo = {
  name: 'Binance Smart Chain',
  chainId: 56,
  shortName: 'BNB',
  contractAddressLink: '',
  safeTxService: 'https://safe-transaction.bsc.gnosis.io/api',
  rpcUrl: 'https://bsc-dataseed.binance.org/',
  apiUri: 'https://api.bscscan.com/api',
};

const OPTIMISM_NETWORK: NetworkInfo = {
  name: 'Optimism',
  chainId: 10,
  shortName: 'ETH',
  contractAddressLink: '',
  safeTxService: 'https://safe-transaction.optimism.gnosis.io/api',
  rpcUrl: 'https://mainnet.optimism.io',
  apiUri: 'https://api-optimistic.etherscan.io/api',
};

export const POLYGON_NETWORK: NetworkInfo = {
  name: 'Polygon',
  chainId: 137,
  shortName: 'MATIC',
  contractAddressLink: '',
  safeTxService: 'https://safe-transaction.polygon.gnosis.io/api',
  rpcUrl: 'https://polygon-rpc.com',
  apiUri: 'https://api.polygonscan.com/api',
};

export const RINKEBY_NETWORK: NetworkInfo = {
  name: 'Rinkeby',
  chainId: 4,
  shortName: 'RIN',
  contractAddressLink: '',
  safeTxService: 'https://safe-transaction.rinkeby.gnosis.io/api',
  rpcUrl: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  apiUri: 'https://api-rinkeby.etherscan.io/api',
};

/*
 * @NOTE Local Network
 * ChainId is manually set by us, since ganache randomizes it on each start
 */
export const GANACHE_NETWORK: NetworkInfo = {
  name: 'Local Ganache Instance',
  chainId: 1337,
  shortName: 'Ganache',
  blockExplorerName: 'Noexplorer',
  blockExplorerUrl: 'http://localhost',
  displayENSDomain: 'joincolony.eth',
  tokenExplorerLink: 'http://localhost',
  contractAddressLink: 'http://localhost',
  rpcUrl: 'http://localhost:8545',
  apiUri: '',
};

export const NETWORK_DATA: { [key: string]: NetworkInfo } = {
  [Network.Local]: GANACHE_NETWORK,
  [Network.Xdai]: GNOSIS_NETWORK,
  [Network.XdaiFork]: GNOSIS_NETWORK,
  [Network.Goerli]: GOERLI_NETWORK,
  [Network.Mainnet]: ETHEREUM_NETWORK,
};

export const TOKEN_DATA = {
  [Network.Local]: ETHER_TOKEN,
  [Network.Xdai]: XDAI_TOKEN,
  [Network.XdaiFork]: XDAI_TOKEN,
  [Network.Goerli]: GOERLI_TOKEN,
  [Network.Mainnet]: ETHER_TOKEN,
};

export const SUPPORTED_NETWORKS = {
  [GNOSIS_NETWORK.chainId]: GNOSIS_NETWORK,
  [ETHEREUM_NETWORK.chainId]: ETHEREUM_NETWORK,
  [GOERLI_NETWORK.chainId]: GOERLI_NETWORK,
  [GANACHE_NETWORK.chainId]: GANACHE_NETWORK,
};

export const SAFE_NETWORKS: NetworkInfo[] = [
  GNOSIS_NETWORK,
  ETHEREUM_NETWORK,
  ARBITRUM_NETWORK,
  AURORA_NETWORK,
  AVALANCHE_NETWORK,
  BINANCE_NETWORK,
  OPTIMISM_NETWORK,
  POLYGON_NETWORK,
  GOERLI_NETWORK,
  RINKEBY_NETWORK,
];

export const SAFE_NAMES_MAP = SAFE_NETWORKS.reduce(
  (acc, safe) => ({
    ...acc,
    [safe.chainId]: safe.name,
  }),
  {},
);

export const DEFAULT_NETWORK_TOKEN = TOKEN_DATA[DEFAULT_NETWORK];

export const DEFAULT_NETWORK_INFO = NETWORK_DATA[DEFAULT_NETWORK];

/*
 * "Home" here always refers to Gnosis Chain.
 * "Foreign" is the chain to which we are bridging.
 */

interface AmbBridge {
  homeAMB: string;
  foreignAMB: string;
  monitor?: string;
  referenceUrl?: string;
  homeGasLimit?: number;
  foreignGasLimit?: number;
  homeFinalizationRate?: number;
  foreignFinalizationRate: number;
}

export const GNOSIS_AMB_BRIDGES: { [x: number]: AmbBridge } = {
  [ETHEREUM_NETWORK.chainId]: {
    homeAMB: '0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
    foreignAMB: '0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
    monitor: 'https://alm-xdai.herokuapp.com/',
    referenceUrl:
      'https://docs.tokenbridge.net/eth-xdai-amb-bridge/about-the-eth-xdai-amb',
    homeGasLimit: 2000000,
    foreignGasLimit: 2000000,
    homeFinalizationRate: 20,
    foreignFinalizationRate: 20,
  },
  [BINANCE_NETWORK.chainId]: {
    homeAMB: '0x162E898bD0aacB578C8D5F8d6ca588c13d2A383F',
    foreignAMB: '0x05185872898b6f94AA600177EF41B9334B1FA48B',
    monitor: 'https://alm-bsc-xdai.herokuapp.com/',
    referenceUrl:
      'https://docs.tokenbridge.net/bsc-xdai-amb/about-the-bsc-xdai-amb',
    homeGasLimit: 2000000,
    foreignGasLimit: 2000000,
    homeFinalizationRate: 20,
    foreignFinalizationRate: 12,
  },
  [RINKEBY_NETWORK.chainId]: {
    homeAMB: '0xc38D4991c951fE8BCE1a12bEef2046eF36b0FA4A',
    foreignAMB: '0xD4075FB57fCf038bFc702c915Ef9592534bED5c1',
    monitor: 'https://alm-rinkeby.herokuapp.com/',
    referenceUrl: `https://docs.tokenbridge.net/rinkeby-xdai-amb-bridge/about-the-rinkeby-xdai-amb`,
    homeGasLimit: 3000000,
    foreignGasLimit: 3000000,
    homeFinalizationRate: 20,
    foreignFinalizationRate: 12,
  },
};

export const ALLDOMAINS_DOMAIN_SELECTION = {
  id: String(COLONY_TOTAL_BALANCE_DOMAIN_ID),
  color: Color.Yellow,
  ethDomainId: COLONY_TOTAL_BALANCE_DOMAIN_ID,
  name: 'All Teams',
  ethParentDomainId: null,
  description: '',
};

export const SMALL_TOKEN_AMOUNT_FORMAT = '0.00000...';

// @NOTE this is the magic number used in the contract
// to identify the type of motion as a Decision
export const ACTION_DECISION_MOTION_CODE = '0x12345678';
export const LOCAL_STORAGE_DECISION_KEY = 'decision';

export const SAFE_ALREADY_EXISTS = 'alreadyExists';

export const FETCH_ABORTED = 'fetchAborted';

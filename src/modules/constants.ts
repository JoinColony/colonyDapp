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
  description?: string;
  displayENSDomain?: string;
  /**
   * Used just to display references to the current networks's
   */
  blockExplorerName?: string;
  /**
   * Link to a token list from the current network's block explorer.
   * This will just be used for information messages and tooltips.
   * We actually linking to it we have a method that generates the
   * link programatically: `getBlockExplorerLink()`
   */
  tokenExplorerLink?: string;
  contractAddressLink: string;
};

export const DEFAULT_NETWORK = process.env.NETWORK || Network.Goerli;
export const COLONY_TOTAL_BALANCE_DOMAIN_ID = 0;
export const DEFAULT_TOKEN_DECIMALS = 18;

export enum ROLES_COMMUNITY {
  founder = 'role.founder',
  admin = 'role.admin',
  member = 'role.member',
}

const XDAI_TOKEN: TokenInfo = {
  name: 'XDAI Token',
  symbol: 'XDAI',
  decimals: 18,
};

const ETHER_TOKEN: TokenInfo = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
};

const GOERLI_TOKEN: TokenInfo = {
  name: 'Goerli Ether',
  symbol: 'GOETH',
  decimals: 18,
};

const XDAI_NETWORK: NetworkInfo = {
  name: 'xDai Chain',
  chainId: 100,
  shortName: 'xDai',
  displayENSDomain: 'joincolony.colonyxdai',
  blockExplorerName: 'Blockscout',
  tokenExplorerLink: 'https://blockscout.com/poa/xdai/tokens',
  contractAddressLink: 'https://blockscout.com/poa/xdai/address',
};

const ETHEREUM_NETWORK: NetworkInfo = {
  name: 'Ethereum',
  chainId: 1,
  shortName: 'ETH',
  blockExplorerName: 'Etherscan',
  displayENSDomain: 'joincolony.eth',
  tokenExplorerLink: 'https://etherscan.io/tokens',
  contractAddressLink: 'https://etherscan.io/address',
};

const GOERLI_NETWORK: NetworkInfo = {
  name: 'Goerli Testnet',
  chainId: 5,
  shortName: 'GTH',
  blockExplorerName: 'Etherscan',
  displayENSDomain: 'joincolony.eth',
  tokenExplorerLink: 'https://goerli.etherscan.io/tokens',
  contractAddressLink: 'https://goerli.etherscan.io/address',
};

/*
 * @NOTE Local Network
 * ChainId is manually set by us, since ganache randomizes it on each start
 */
const GANACHE_NETWORK: NetworkInfo = {
  name: 'Local Ganache Instance',
  chainId: 13131313,
  shortName: 'Ganache',
  blockExplorerName: 'Noexplorer',
  displayENSDomain: 'joincolony.eth',
  tokenExplorerLink: 'http://localhost',
  contractAddressLink: 'http://localhost',
};

export const NETWORK_DATA: { [key: string]: NetworkInfo } = {
  [Network.Local]: GANACHE_NETWORK,
  [Network.Xdai]: XDAI_NETWORK,
  [Network.XdaiFork]: XDAI_NETWORK,
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

export const ALLOWED_NETWORKS = {
  [XDAI_NETWORK.chainId]: XDAI_NETWORK,
  [GOERLI_NETWORK.chainId]: GOERLI_NETWORK,
  [GANACHE_NETWORK.chainId]: GANACHE_NETWORK,
};

export const DEFAULT_NETWORK_TOKEN = TOKEN_DATA[DEFAULT_NETWORK];

export const DEFAULT_NETWORK_INFO = NETWORK_DATA[DEFAULT_NETWORK];

export const METACOLONY_ENS = 'meta';

export const ALLDOMAINS_DOMAIN_SELECTION = {
  id: String(COLONY_TOTAL_BALANCE_DOMAIN_ID),
  color: Color.Yellow,
  ethDomainId: COLONY_TOTAL_BALANCE_DOMAIN_ID,
  name: 'All Teams',
  ethParentDomainId: null,
  description: '',
};

export const TOKEN_LOGOS_REPO_URL = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains`;

export const NETWORK_RELEASES_URL = `https://github.com/JoinColony/colonyNetwork/releases/tag`;

export const SMALL_TOKEN_AMOUNT_FORMAT = '0.00000...';

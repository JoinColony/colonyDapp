import { Network } from '@colony/colony-js';

export type TokenInfo = {
  name: string;
  symbol: string;
  decimals?: number;
};

export type NetworkInfo = {
  name: string;
  description?: string;
  displayENSDomain?: string;
  /**
   * Link to a token list from the current network's block scout.
   * This will just be used for information messages and tooltips.
   * We actually linking to it we have a method that generates the
   * link programatically: `getBlockExplorerLink()`
   */
  tokenScout?: string;
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
  name: 'XDAI Token',
  symbol: 'XDAI',
  decimals: 18,
};

export const ETHER_TOKEN: TokenInfo = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
};

export const XDAI_NETWORK: NetworkInfo = {
  name: 'xDai Chain',
  displayENSDomain: 'joincolony.colonyxdai',
  tokenScout: 'https://blockscout.com/poa/xdai/tokens',
};

export const ETHEREUM_NETWORK: NetworkInfo = {
  name: 'Ethereum',
  displayENSDomain: 'joincolony.eth',
  tokenScout: 'https://etherscan.io/tokens',
};

export const DEFAULT_NETWORK_TOKEN =
  DEFAULT_NETWORK === Network.Xdai ? XDAI_TOKEN : ETHER_TOKEN;

export const DEFAULT_NETWORK_INFO =
  DEFAULT_NETWORK === Network.Xdai ? XDAI_NETWORK : ETHEREUM_NETWORK;

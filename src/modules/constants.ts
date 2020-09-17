import { Network } from '@colony/colony-js';

export const DEFAULT_NETWORK = process.env.NETWORK || Network.Goerli;
export const COLONY_TOTAL_BALANCE_DOMAIN_ID = 0;
export const DEFAULT_TOKEN_DECIMALS = 18;

export enum ROLES_COMMUNITY {
  founder = 'role.founder',
  admin = 'role.admin',
  member = 'role.member',
}

type TokenInfo = {
  name: string;
  symbol: string;
  decimals?: number;
};

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

export const DEFAULT_NETWORK_TOKEN =
  DEFAULT_NETWORK === Network.Xdai ? XDAI_TOKEN : ETHER_TOKEN;

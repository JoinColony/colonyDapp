export const DEFAULT_NETWORK = process.env.NETWORK || 'goerli';
export const COLONY_TOTAL_BALANCE_DOMAIN_ID = 0;
export const ROOT_DOMAIN = 1;
export const DEFAULT_TOKEN_DECIMALS = 18;

// A duplication of the roles constants in colonyJS, but more accessible
export enum ROLES {
  RECOVERY = 'RECOVERY',
  ROOT = 'ROOT',
  ARBITRATION = 'ARBITRATION',
  ARCHITECTURE = 'ARCHITECTURE',
  ARCHITECTURE_SUBDOMAIN = 'ARCHITECTURE_SUBDOMAIN',
  FUNDING = 'FUNDING',
  ADMINISTRATION = 'ADMINISTRATION',
}

export enum ROLES_COMMUNITY {
  founder = 'role.founder',
  admin = 'role.admin',
  member = 'role.member',
}

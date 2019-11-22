export const DEFAULT_NETWORK = process.env.NETWORK || 'goerli';
export const COLONY_TOTAL_BALANCE_DOMAIN_ID = 0;
export const ROOT_DOMAIN = 1;

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

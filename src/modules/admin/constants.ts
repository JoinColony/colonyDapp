import {
  COLONY_ROLE_ADMINISTRATION,
  COLONY_ROLE_ARBITRATION,
  COLONY_ROLE_ARCHITECTURE,
  COLONY_ROLE_ARCHITECTURE_SUBDOMAIN,
  COLONY_ROLE_FUNDING,
  COLONY_ROLE_RECOVERY,
  COLONY_ROLE_ROOT,
} from '@colony/colony-js-client';

export const ADMIN_NAMESPACE = 'admin';
export const ADMIN_TRANSACTIONS = 'transactions';
export const ADMIN_UNCLAIMED_TRANSACTIONS = 'unclaimedTransactions';

export const ROLE_MESSAGES = {
  [COLONY_ROLE_ADMINISTRATION]: 'role.administration',
  [COLONY_ROLE_ARBITRATION]: 'role.arbitration',
  [COLONY_ROLE_ARCHITECTURE]: 'role.architecture',
  [COLONY_ROLE_ARCHITECTURE_SUBDOMAIN]: 'role.architectureSubdomain',
  [COLONY_ROLE_FUNDING]: 'role.funding',
  [COLONY_ROLE_RECOVERY]: 'role.recovery',
  [COLONY_ROLE_ROOT]: 'role.root',
};

export const COLONY_TOTAL_BALANCE_DOMAIN_ID = '0';

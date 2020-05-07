import { ColonyRole } from '@colony/colony-js';

export const ADMIN_NAMESPACE = 'admin';
export const ADMIN_TRANSACTIONS = 'transactions';
export const ADMIN_UNCLAIMED_TRANSACTIONS = 'unclaimedTransactions';

export const ROLE_MESSAGES = {
  [ColonyRole.Administration]: 'role.administration',
  [ColonyRole.Arbitration]: 'role.arbitration',
  [ColonyRole.Architecture]: 'role.architecture',
  [ColonyRole.ArchitectureSubdomain_DEPRECATED]: 'role.architectureSubdomain',
  [ColonyRole.Funding]: 'role.funding',
  [ColonyRole.Recovery]: 'role.recovery',
  [ColonyRole.Root]: 'role.root',
};

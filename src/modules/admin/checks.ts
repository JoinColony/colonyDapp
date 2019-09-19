import { Address } from '~types/index';

export const canEditTokens = (
  roles: { founder: Address; admins: Address[] } | void,
  walletAddress: Address,
) => roles && roles.founder === walletAddress;

import { RolesType } from '~immutable/index';
import { Address } from '~types/index';

export const canEditTokens = (
  roles: RolesType | void,
  walletAddress: Address,
) => roles && roles.founder === walletAddress;

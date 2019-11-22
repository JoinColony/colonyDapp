import { ROLES } from '~constants';
import { Address, DomainsMapType } from '~types/index';

export const canEditTokens = (
  roles: { founder: Address; admins: Address[] } | void,
  walletAddress: Address,
) => roles && roles.founder === walletAddress;

export const canMoveTokens = (
  colonyRoles: DomainsMapType,
  walletAddress: Address,
) =>
  colonyRoles &&
  !!Object.values(colonyRoles).find(users =>
    Object.entries(users).find(
      ([userAddress, roles]) =>
        userAddress === walletAddress && roles[ROLES.FUNDING],
    ),
  );

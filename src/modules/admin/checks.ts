import { COLONY_ROLE_FUNDING } from '@colony/colony-js-client';

import { Address } from '~types/index';

export const canEditTokens = (
  roles: { founder: Address; admins: Address[] } | void,
  walletAddress: Address,
) => roles && roles.founder === walletAddress;

export const canMoveTokens = (
  domainRoles: {
    [domainId: number]: { [userAddress: string]: { [role: string]: boolean } };
  },
  walletAddress: Address,
) =>
  domainRoles &&
  !!Object.values(domainRoles).find(users =>
    Object.entries(users).find(
      ([userAddress, roles]) =>
        userAddress === walletAddress && roles[COLONY_ROLE_FUNDING],
    ),
  );

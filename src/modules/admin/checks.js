/* @flow */

import type { RolesType } from '~immutable';
import type { Address } from '~types';

// eslint-disable-next-line import/prefer-default-export
export const canEditTokens = (roles: ?RolesType, walletAddress: Address) =>
  roles &&
  (roles.admins.includes(walletAddress) || roles.founder === walletAddress);

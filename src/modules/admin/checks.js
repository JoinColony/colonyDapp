/* @flow */

import type { RolesType } from '~immutable';
import type { Address } from '~types';

import { addressEquals } from '~utils/strings';

// TODO compare token owner against walletAddress
export const canMintTokens = (roles: ?RolesType, walletAddress: Address) =>
  roles && addressEquals(roles.founder, walletAddress);

export const canEditTokens = (roles: ?RolesType, walletAddress: Address) =>
  roles &&
  (roles.admins.find(address => addressEquals(address, walletAddress)) ||
    addressEquals(roles.founder, walletAddress));

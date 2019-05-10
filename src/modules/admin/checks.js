/* @flow */

import type { RolesType } from '~immutable';
import type { Address } from '~types';

import { addressEquals } from '~utils/strings';

// eslint-disable-next-line import/prefer-default-export
export const canEditTokens = (roles: ?RolesType, walletAddress: Address) =>
  roles &&
  (roles.admins.find(address => addressEquals(address, walletAddress)) ||
    addressEquals(roles.founder, walletAddress));

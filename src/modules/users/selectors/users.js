/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type {
  DataRecordType,
  RootStateRecord,
  UserPermissionsType,
  UserRecordType,
} from '~immutable';
import type { ENSName } from '~types';

import {
  USERS_ALL_USERS,
  USERS_AVATARS,
  USERS_CURRENT_USER,
  USERS_CURRENT_USER_PROFILE,
  USERS_CURRENT_USER_TRANSACTIONS,
  USERS_CURRENT_USER_PERMISSIONS,
  USERS_NAMESPACE as ns,
  USERS_USERNAMES,
  USERS_USERS,
  USERS_CURRENT_USER_METADATA,
} from '../constants';

/*
 * Username/address getters
 */
const getUsernames = (state: RootStateRecord) =>
  state.getIn([ns, USERS_ALL_USERS, USERS_USERNAMES], ImmutableMap());
const getAddressFromProps = (
  state: RootStateRecord,
  { address }: { address: string },
) => address;

const getUsernameFromUserData = (user: DataRecordType<UserRecordType>) =>
  user && user.getIn(['record', 'profile', 'username']);

/*
 * Username/address selectors
 */
export const usernameSelector = createSelector(
  getAddressFromProps,
  getUsernames,
  (address, usernames) => usernames.get(address),
);

export const userAddressSelector = (
  state: RootStateRecord,
  username: string,
) => {
  const users = state.getIn([ns, USERS_ALL_USERS, USERS_USERNAMES]);
  if (!users) return null;
  return users.findKey(user => getUsernameFromUserData(user) === username);
};

/*
 * User getters
 */
const getUsers = (state: RootStateRecord) =>
  state.getIn([ns, USERS_ALL_USERS, USERS_USERS], ImmutableMap());

/*
 * User selectors
 */
export const singleUserSelector = (state: RootStateRecord, address: string) =>
  state.getIn([ns, USERS_ALL_USERS, USERS_USERS, address]);

export const usersExceptSelector = (
  state: RootStateRecord,
  except: string[] | string,
) => {
  const users = state.getIn([ns, USERS_ALL_USERS, USERS_USERS]);
  const exceptionsArray = [].concat(except);
  if (!users) return users;
  return users.filter((user, address) => !exceptionsArray.includes(address));
};

export const userByAddressSelector = createSelector(
  getAddressFromProps,
  getUsers,
  (address, users) => users.get(address),
);

/*
 * Avatar selectors
 */
export const userAvatarByAddressSelector = (
  state: RootStateRecord,
  address: string,
) => state.getIn([ns, USERS_ALL_USERS, USERS_AVATARS, address]);

/*
 * Current user getters
 */
const getCurrentUser = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER]);
const getCurrentUserAddress = (state: RootStateRecord) =>
  state.getIn([
    ns,
    USERS_CURRENT_USER,
    USERS_CURRENT_USER_PROFILE,
    'walletAddress',
  ]);
const getCurrentUserBalance = (state: RootStateRecord) =>
  state.getIn(
    [ns, USERS_CURRENT_USER, USERS_CURRENT_USER_PROFILE, 'balance'],
    0,
  );
const getCurrentUserTransactions = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_TRANSACTIONS]);
const getCurrentUserColonyPermissions = (
  state: RootStateRecord,
  ensName: ENSName,
) =>
  state.getIn([
    ns,
    USERS_CURRENT_USER,
    USERS_CURRENT_USER_PERMISSIONS,
    ensName,
  ]);
const getCurrentUserMetadata = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_METADATA]);

/*
 * Current user selectors
 */
export const currentUserSelector = createSelector(
  getCurrentUser,
  user => user,
);
export const currentUserAddressSelector = createSelector(
  getCurrentUserAddress,
  address => address,
);
export const currentUserBalanceSelector = createSelector(
  getCurrentUserBalance,
  balance => balance,
);
export const currentUserTransactionsSelector = createSelector(
  getCurrentUserTransactions,
  transactions => transactions,
);
export const currentUserColonyPermissionsSelector = createSelector(
  getCurrentUserColonyPermissions,
  permissions => permissions,
);
export const currentUserMetadataSelector = createSelector(
  getCurrentUserMetadata,
  metadata => metadata,
);

// TODO this doesn't quite fit here, maybe move?
export const canEnterRecoveryMode = (permissions?: UserPermissionsType) =>
  !!(permissions && permissions.canEnterRecoveryMode);

export const canCreateTask = (permissions?: UserPermissionsType) =>
  !!(permissions && permissions.isAdmin);

export const canAdminister = (permissions?: UserPermissionsType) =>
  !!(permissions && permissions.isAdmin);

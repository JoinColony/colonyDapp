/* @flow */

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';

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
  USERS_CURRENT_USER_TOKENS,
  USERS_CURRENT_USER_TRANSACTIONS,
  USERS_CURRENT_USER_PERMISSIONS,
  USERS_NAMESPACE as ns,
  USERS_USERS,
  USERS_CURRENT_USER_METADATA,
  USERS_CURRENT_USER_SUBSCRIBED_COLONIES,
} from '../constants';

/*
 * Username/address getters
 */
const getUsernameFromUserData = (user?: DataRecordType<UserRecordType>) =>
  user && user.getIn(['record', 'profile', 'username']);

/*
 * Username/address input selectors
 */
export const userAddressSelector = (state: RootStateRecord, username: string) =>
  state
    .getIn([ns, USERS_ALL_USERS, USERS_USERS], ImmutableMap())
    .findKey(user => getUsernameFromUserData(user) === username);

export const usernameSelector = (state: RootStateRecord, address: string) =>
  getUsernameFromUserData(
    state.getIn([ns, USERS_ALL_USERS, USERS_USERS, address]),
  );

/*
 * User input selectors
 */
export const userSelector = (state: RootStateRecord, address: string) =>
  state.getIn([ns, USERS_ALL_USERS, USERS_USERS, address]);

export const userByUsernameSelector = (
  state: RootStateRecord,
  username: string,
) =>
  state
    .getIn([ns, USERS_ALL_USERS, USERS_USERS], ImmutableMap())
    .find(user => getUsernameFromUserData(user) === username);

export const usersExceptSelector = (
  state: RootStateRecord,
  except: string[] | string = [],
) =>
  state
    .getIn([ns, USERS_ALL_USERS, USERS_USERS], ImmutableMap())
    .filter((user, address) => ![].concat(except).includes(address));

usersExceptSelector.transform = (
  input: ImmutableMap<string, DataRecordType<UserRecordType>>,
) =>
  input
    .map(user => user.record)
    .filter(Boolean)
    .toList()
    .toJS();

/*
 * Avatar input selectors
 */
export const userAvatarByAddressSelector = (
  state: RootStateRecord,
  address: string,
) => state.getIn([ns, USERS_ALL_USERS, USERS_AVATARS, address]);

/*
 * Current user input selectors
 */
export const currentUserSelector = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER]);
export const currentUserAddressSelector = (state: RootStateRecord) =>
  state.getIn([
    ns,
    USERS_CURRENT_USER,
    USERS_CURRENT_USER_PROFILE,
    'walletAddress',
  ]);
export const currentUserBalanceSelector = (state: RootStateRecord) =>
  state.getIn(
    [ns, USERS_CURRENT_USER, USERS_CURRENT_USER_PROFILE, 'balance'],
    0,
  );
export const currentUserTokensSelector = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_TOKENS]);
export const currentUserTransactionsSelector = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_TRANSACTIONS]);
export const currentUserColonyPermissionsSelector = (
  state: RootStateRecord,
  ensName: ENSName,
) =>
  state.getIn([
    ns,
    USERS_CURRENT_USER,
    USERS_CURRENT_USER_PERMISSIONS,
    ensName,
  ]);
export const currentUserMetadataSelector = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_METADATA]);

export const currentUserColoniesSelector = (state: RootStateRecord) =>
  state.getIn(
    [ns, USERS_CURRENT_USER, USERS_CURRENT_USER_SUBSCRIBED_COLONIES],
    ImmutableSet(),
  );

/*
 * User permissions getters
 */
export const canEnterRecoveryMode = (permissions?: UserPermissionsType) =>
  !!(permissions && permissions.canEnterRecoveryMode);

export const canCreateTask = (permissions?: UserPermissionsType) =>
  !!(permissions && permissions.isAdmin);

export const canAdminister = (permissions?: UserPermissionsType) =>
  !!(permissions && permissions.isAdmin);

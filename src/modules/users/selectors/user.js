/* @flow */

import { createSelector } from 'reselect';

import { Map as ImmutableMap } from 'immutable';

import type {
  DataRecordType,
  RootStateRecord,
  UserRecordType,
} from '~immutable';
import type { Address } from '~types';

import {
  USERS_ALL_USERS,
  USERS_CURRENT_USER,
  USERS_CURRENT_USER_TOKENS,
  USERS_CURRENT_USER_TRANSACTIONS,
  USERS_CURRENT_USER_PERMISSIONS,
  USERS_NAMESPACE as ns,
  USERS_USERS,
  USERS_CURRENT_USER_METADATA,
  USERS_CURRENT_USER_SUBSCRIBED_COLONIES,
  USERS_CURRENT_USER_TASKS,
  USERS_CURRENT_USER_ACTIVITIES,
} from '../constants';
import { walletAddressSelector } from './wallet';

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

export const usernameSelector = (state: RootStateRecord, address: Address) =>
  getUsernameFromUserData(
    state.getIn([ns, USERS_ALL_USERS, USERS_USERS, address]),
  );

/*
 * User input selectors
 */
export const userSelector = (state: RootStateRecord, address: Address) =>
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
 * Current user input selectors
 */
export const currentUserSelector = createSelector(
  (state: RootStateRecord) =>
    state.getIn([ns, USERS_ALL_USERS, USERS_USERS], ImmutableMap()),
  walletAddressSelector,
  (users, walletAddress) => users.get(walletAddress),
);

export const currentUserBalanceSelector = createSelector(
  currentUserSelector,
  user => (user ? user.getIn(['record', 'profile', 'balance']) : null),
);

export const currentUsernameSelector = createSelector(
  currentUserSelector,
  user => (user ? user.getIn(['record', 'profile', 'username']) : null),
);

export const currentUserTokensSelector = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_TOKENS]);

export const currentUserTransactionsSelector = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_TRANSACTIONS]);

export const currentUserColonyPermissionsSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
) =>
  state.getIn([
    ns,
    USERS_CURRENT_USER,
    USERS_CURRENT_USER_PERMISSIONS,
    colonyAddress,
  ]);

export const currentUserMetadataSelector = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_METADATA]);

export const currentUserColoniesSelector = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_SUBSCRIBED_COLONIES]);

export const currentUserDraftIdsSelector = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_TASKS]);

export const currentUserRecentTokensSelector = createSelector(
  currentUserTokensSelector,
  currentUserTransactionsSelector,
  (tokens, transactions) =>
    Array.from(
      new Map([
        ...((tokens && tokens.record && tokens.record.entries()) || []),
        ...((transactions && transactions.record) || []).map(({ token }) => [
          token,
          { address: token },
        ]),
      ]).values(),
    ),
);

/*
 * Given a user address, select (in order of preference):
 * - The display name from the user profile
 * - The username from the user profile
 * - The user address
 */
export const friendlyUsernameSelector = createSelector(
  userSelector,
  (_, userAddress) => userAddress,
  (user, userAddress): string => {
    const { displayName, username } =
      (user && user.getIn(['record', 'profile'])) || {};
    return displayName || username || userAddress;
  },
);

/*
 * User activities (Eg: Inbox)
 */
const getCurrentUserActivities = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_ACTIVITIES]);

export const currentUserActivitiesSelector = createSelector(
  getCurrentUserActivities,
  activitities => activitities,
);

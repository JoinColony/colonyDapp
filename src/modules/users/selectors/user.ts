import { createSelector } from 'reselect';

import { Map as ImmutableMap } from 'immutable';
import { isAddress } from 'web3-utils';

import {
  DataRecordType,
  RootStateRecord,
  UserRecordType,
} from '~immutable/index';
import { Address } from '~types/index';

import {
  USERS_ALL_USERS,
  USERS_COLONIES,
  USERS_CURRENT_USER,
  USERS_CURRENT_USER_PROFILE,
  USERS_CURRENT_USER_TOKENS,
  USERS_CURRENT_USER_TRANSACTIONS,
  USERS_CURRENT_USER_PERMISSIONS,
  USERS_NAMESPACE as ns,
  USERS_USERS,
  USERS_CURRENT_USER_TASKS,
  USERS_INBOX_ITEMS,
  USERS_CURRENT_USER_NOTIFICATION_METADATA,
} from '../constants';

/*
 * Username getters
 */
const getUsernameFromUserData = (user?: DataRecordType<UserRecordType>) =>
  user && user.getIn(['record', 'profile', 'username']);

/*
 * Address getters
 */
const getWalletAddressFromUserData = (
  users: ImmutableMap<string, DataRecordType<UserRecordType>>,
) => Object.keys(users.toJS()).filter(key => isAddress(key));

export const allUsersSelector = (state: RootStateRecord) =>
  // @ts-ignore
  state.getIn([ns, USERS_ALL_USERS, USERS_USERS], ImmutableMap());

export const allUsersAddressesSelector = createSelector(
  allUsersSelector,
  users => getWalletAddressFromUserData(users),
);

/*
 * Username input selectors
 */
export const userAddressSelector = (state: RootStateRecord, username: string) =>
  state
    // @ts-ignore
    .getIn([ns, USERS_ALL_USERS, USERS_USERS], ImmutableMap())
    .findKey(user => getUsernameFromUserData(user) === username);

export const userColoniesSelector = (
  state: RootStateRecord,
  address: Address,
) => state.getIn([ns, USERS_ALL_USERS, USERS_COLONIES, address]);

export const usernameSelector = (state: RootStateRecord, address: Address) =>
  getUsernameFromUserData(
    state.getIn([ns, USERS_ALL_USERS, USERS_USERS, address]),
  );

/*
 * User input selectors
 */
export const userSelector = (state: RootStateRecord, address: Address) =>
  state.getIn([ns, USERS_ALL_USERS, USERS_USERS, address]);

export const usersExceptSelector = createSelector(
  allUsersSelector,
  (allUsers, except: string[] | string = []) =>
    allUsers.filter((user, address) => ![].concat(except).includes(address)),
);

// @ts-ignore
usersExceptSelector.transform = (
  input: ImmutableMap<string, DataRecordType<UserRecordType>>,
) =>
  input
    .map(user => user.record)
    .filter(Boolean)
    .toList()
    .toJS();

export const usersByAddressesSelector = (
  state: RootStateRecord,
  addresses: string[],
) =>
  state
    // @ts-ignore
    .getIn([ns, USERS_ALL_USERS, USERS_USERS], ImmutableMap())
    .filter((_, address) => addresses.includes(address));

/*
 * Current user input selectors
 */
export const currentUserSelector = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER]);
export const currentUsernameSelector = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_PROFILE, 'username']);
export const walletAddressSelector = (state: RootStateRecord) =>
  state.getIn([
    ns,
    USERS_CURRENT_USER,
    USERS_CURRENT_USER_PROFILE,
    'walletAddress',
  ]);
export const currentUserBalanceSelector = (state: RootStateRecord) =>
  state.getIn(
    [ns, USERS_CURRENT_USER, USERS_CURRENT_USER_PROFILE, 'balance'],
    // @ts-ignore
    0,
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
export const currentUserMetadataSelector = (state: RootStateRecord) => {
  // @ts-ignore
  const { inboxStoreAddress, metadataStoreAddress } =
    state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_PROFILE]) || {};
  return { inboxStoreAddress, metadataStoreAddress };
};

export const currentUserDraftIdsSelector = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_TASKS]);

export const currentUserRecentTokensSelector = createSelector(
  currentUserTokensSelector,
  currentUserTransactionsSelector,
  (tokens, transactions) =>
    Array.from(
      new Map([
        ...((tokens &&
          tokens.record &&
          tokens.record.map(token => [token.address, token])) ||
          []),
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
    // @ts-ignore
    const { displayName, username } =
      (user && user.getIn(['record', 'profile'])) || {};
    return displayName || username || userAddress;
  },
);

/*
 * User activities (Eg: Inbox)
 */
const getInboxItems = (state: RootStateRecord) =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_INBOX_ITEMS]);

/*
 * User notification metadata
 */
const getCurrentUserNotificationMetadata = (state: RootStateRecord) =>
  state.getIn([
    ns,
    USERS_CURRENT_USER,
    USERS_CURRENT_USER_NOTIFICATION_METADATA,
  ]) || {};

export const inboxItemsSelector = createSelector(
  getInboxItems,
  getCurrentUserNotificationMetadata,
  (activities, { readUntil = 0, exceptFor = [] }) =>
    activities &&
    activities.map(
      activity =>
        activity &&
        activity.set(
          'unread',
          new Date(activity.timestamp) > new Date(readUntil) ||
            exceptFor.includes(activity.id),
        ),
    ),
);

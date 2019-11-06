import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';
import { isAddress } from 'web3-utils';

import {
  FetchableDataRecord,
  UserNotificationMetadataRecord,
  UserRecord,
  UserType,
} from '~immutable/index';
import { Address } from '~types/index';
import { FetchableContractTransactionList } from '../../admin/state';

import { RootStateRecord } from '../../state';
import {
  USERS_ALL_USERS,
  USERS_COLONIES,
  USERS_CURRENT_USER,
  USERS_CURRENT_USER_PROFILE,
  USERS_CURRENT_USER_TOKENS,
  USERS_CURRENT_USER_TRANSACTIONS,
  USERS_NAMESPACE as ns,
  USERS_USERS,
  USERS_CURRENT_USER_TASKS,
  USERS_INBOX_ITEMS,
  USERS_CURRENT_USER_NOTIFICATION_METADATA,
} from '../constants';
import {
  CurrentUserInboxItemsType,
  CurrentUserTasksType,
  CurrentUserTokensType,
  UserColonies,
  UsersMap,
} from '../state';

const getUsernameFromUserData = (
  user?: FetchableDataRecord<UserRecord>,
): string | undefined => user && user.getIn(['record', 'profile', 'username']);

export const allUsersSelector = (state: RootStateRecord): UsersMap =>
  state.getIn([ns, USERS_ALL_USERS, USERS_USERS]) || ImmutableMap();

export const allUsersAddressesSelector = (state: RootStateRecord) =>
  allUsersSelector(state);

allUsersAddressesSelector.transform = (
  users: ImmutableMap<string, FetchableDataRecord<UserRecord>>,
): Address[] => Object.keys(users.toJS()).filter(key => isAddress(key));

/*
 * Username input selectors
 */
export const userColoniesSelector = (
  state: RootStateRecord,
  address: Address,
): FetchableDataRecord<UserColonies> =>
  state.getIn([ns, USERS_ALL_USERS, USERS_COLONIES, address]);

export const usernameSelector = (
  state: RootStateRecord,
  address: Address,
): string | undefined =>
  getUsernameFromUserData(
    state.getIn([ns, USERS_ALL_USERS, USERS_USERS, address]),
  );

/*
 * User input selectors
 */
export const userSelector = (
  state: RootStateRecord,
  address: Address,
): FetchableDataRecord<UserRecord> | undefined =>
  state.getIn([ns, USERS_ALL_USERS, USERS_USERS, address]);

export const usersExceptSelector = createSelector(
  allUsersSelector,
  (allUsers, except: string[] | string = []) =>
    allUsers.filter(
      (user, address) => !([] as string[]).concat(except).includes(address),
    ),
);

Object.defineProperty(usersExceptSelector, 'transform', {
  value: (input: ImmutableMap<string, FetchableDataRecord<UserRecord>>) =>
    input
      .map(user => user.record)
      .filter(Boolean)
      .toList()
      .toJS(),
});

export const specificUsersSelector = (state: RootStateRecord): UsersMap =>
  state.getIn([ns, USERS_ALL_USERS, USERS_USERS]);

specificUsersSelector.filter = (
  users: UsersMap = ImmutableMap() as UsersMap,
  addresses: Address[],
) => users.filter((_, address) => addresses.includes(address));

/*
 * Current user input selectors
 */
export const currentUserSelector = (state: RootStateRecord): UserType =>
  state.getIn([ns, USERS_CURRENT_USER]);
export const currentUsernameSelector = (
  state: RootStateRecord,
): string | undefined =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_PROFILE, 'username']);
export const walletAddressSelector = (state: RootStateRecord): Address =>
  state.getIn([
    ns,
    USERS_CURRENT_USER,
    USERS_CURRENT_USER_PROFILE,
    'walletAddress',
  ]);
export const currentUserBalanceSelector = (state: RootStateRecord): string =>
  state.getIn([
    ns,
    USERS_CURRENT_USER,
    USERS_CURRENT_USER_PROFILE,
    'balance',
  ]) || '0';

export const currentUserTokensSelector = (
  state: RootStateRecord,
): CurrentUserTokensType =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_TOKENS]);

export const currentUserTransactionsSelector = (
  state: RootStateRecord,
): FetchableContractTransactionList =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_TRANSACTIONS]);

export const currentUserMetadataSelector = (state: RootStateRecord) => {
  // @ts-ignore
  const { inboxStoreAddress, metadataStoreAddress } =
    state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_PROFILE]) || {};
  return { inboxStoreAddress, metadataStoreAddress };
};

export const currentUserDraftIdsSelector = (
  state: RootStateRecord,
): FetchableDataRecord<CurrentUserTasksType> =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_TASKS]);

export const currentUserRecentTokensSelector = createSelector(
  currentUserTokensSelector,
  currentUserTransactionsSelector,
  (tokens, transactions) =>
    Array.from(
      // @ts-ignore
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
const getInboxItems = (state: RootStateRecord): CurrentUserInboxItemsType =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_INBOX_ITEMS]);

/*
 * User notification metadata
 */
const getCurrentUserNotificationMetadata = (
  state: RootStateRecord,
): UserNotificationMetadataRecord =>
  state.getIn([
    ns,
    USERS_CURRENT_USER,
    USERS_CURRENT_USER_NOTIFICATION_METADATA,
  ]) || {};

export const inboxItemsSelector = createSelector(
  getInboxItems,
  getCurrentUserNotificationMetadata,
  (data, { readUntil = 0, exceptFor = [] }) =>
    data &&
    data.update('record', (list: typeof data['record']) =>
      list
        ? list.map(
            activity =>
              activity &&
              activity.set(
                'unread',
                new Date(activity.timestamp || 0) > new Date(readUntil) ||
                  exceptFor.includes(activity.id),
              ),
          )
        : list,
    ),
);

import { createSelector } from 'reselect';

import {
  FetchableDataRecord,
  UserNotificationMetadataRecord,
} from '~immutable/index';
import { Address } from '~types/index';
import { FetchableContractTransactionList } from '../../admin/state';

import { RootStateRecord } from '../../state';
import {
  USERS_ALL_USERS,
  USERS_COLONIES,
  USERS_CURRENT_USER,
  USERS_CURRENT_USER_TOKENS,
  USERS_CURRENT_USER_TRANSACTIONS,
  USERS_NAMESPACE as ns,
  USERS_CURRENT_USER_TASKS,
  USERS_INBOX_ITEMS,
  USERS_CURRENT_USER_NOTIFICATION_METADATA,
} from '../constants';
import {
  CurrentUserInboxItemsType,
  CurrentUserTasksType,
  CurrentUserTokensType,
  UserColonies,
} from '../state';

interface CurrentUserData {
  username?: string;
  walletAddress: string;
  balance: string;
}

/*
 * Username input selectors
 */
export const userColoniesSelector = (
  state: RootStateRecord,
  address: Address,
): FetchableDataRecord<UserColonies> =>
  state.getIn([ns, USERS_ALL_USERS, USERS_COLONIES, address]);

/*
 * Current user input selectors
 */

export const currentUserTokensSelector = (
  state: RootStateRecord,
): CurrentUserTokensType =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_TOKENS]);

export const currentUserTransactionsSelector = (
  state: RootStateRecord,
): FetchableContractTransactionList =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_TRANSACTIONS]);

export const currentUserMetadataSelector = () => {
  // FIXME remove Just stubs, this isn't real
  return { inboxStoreAddress: '', metadataStoreAddress: '' };
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
// export const friendlyUsernameSelector = createSelector(
//   userSelector,
//   (_, userAddress) => userAddress,
//   (user, userAddress): string => {
//     // @ts-ignore
//     const { displayName, username } =
//       (user && user.getIn(['record', 'profile'])) || {};
//     return displayName || username || userAddress;
//   },
// );

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

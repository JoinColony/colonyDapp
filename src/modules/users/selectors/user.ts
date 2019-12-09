import { createSelector } from 'reselect';

import { FetchableContractTransactionList } from '../../admin/state';

import { RootStateRecord } from '../../state';
import {
  USERS_CURRENT_USER,
  USERS_CURRENT_USER_TOKENS,
  USERS_CURRENT_USER_TRANSACTIONS,
  USERS_NAMESPACE as ns,
  USERS_INBOX_ITEMS,
} from '../constants';
import { CurrentUserInboxItemsType, CurrentUserTokensType } from '../state';

interface CurrentUserData {
  username?: string;
  walletAddress: string;
  balance: string;
}

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
 * User activities (Eg: Inbox)
 */
const getInboxItems = (state: RootStateRecord): CurrentUserInboxItemsType =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_INBOX_ITEMS]);

// FIXME this is just temporary, we need to find a way to store the read state of
// blockchain inbox items
export const inboxItemsSelector = getInboxItems;

// export const inboxItemsSelector = createSelector(
//   getInboxItems,
//   getCurrentUserNotificationMetadata,
//   (data, { readUntil = 0, exceptFor = [] }) =>
//     data &&
//     data.update('record', (list: typeof data['record']) =>
//       list
//         ? list.map(
//             activity =>
//               activity &&
//               activity.set(
//                 'unread',
//                 new Date(activity.timestamp || 0) > new Date(readUntil) ||
//                   exceptFor.includes(activity.id),
//               ),
//           )
//         : list,
//     ),
// );

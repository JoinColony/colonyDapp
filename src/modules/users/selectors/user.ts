import { FetchableContractTransactionList } from '../../admin/state';

import { RootStateRecord } from '../../state';
import {
  USERS_CURRENT_USER,
  USERS_CURRENT_USER_TRANSACTIONS,
  USERS_NAMESPACE as ns,
} from '../constants';

interface CurrentUserData {
  username?: string;
  walletAddress: string;
  balance: string;
}

/*
 * Current user input selectors
 */

export const currentUserTransactionsSelector = (
  state: RootStateRecord,
): FetchableContractTransactionList =>
  state.getIn([ns, USERS_CURRENT_USER, USERS_CURRENT_USER_TRANSACTIONS]);

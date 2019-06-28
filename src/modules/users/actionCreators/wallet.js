/* @flow */

import { ACTIONS } from '~redux';
import type { Action } from '~redux';
import type { WalletSpecificType } from '~immutable';

// eslint-disable-next-line import/prefer-default-export
export const fetchAccounts = (
  walletType: WalletSpecificType,
): Action<typeof ACTIONS.WALLET_FETCH_ACCOUNTS> => ({
  type: ACTIONS.WALLET_FETCH_ACCOUNTS,
  payload: { walletType },
});

import { ActionTypes, AllActions } from '~redux/index';

import { WalletMethod } from '~immutable/index';

export const fetchAccounts = (walletType: WalletMethod): AllActions => ({
  type: ActionTypes.WALLET_FETCH_ACCOUNTS,
  payload: { walletType },
});

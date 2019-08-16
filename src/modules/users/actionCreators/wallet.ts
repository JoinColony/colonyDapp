import { ActionTypes, AllActions } from '~redux/index';

import { WalletSpecificType } from '~immutable/index';

export const fetchAccounts = (walletType: WalletSpecificType): AllActions => ({
  type: ActionTypes.WALLET_FETCH_ACCOUNTS,
  payload: { walletType },
});

import { ActionTypes, AllActions } from '~redux/index';

import { WALLET_SPECIFICS } from '~immutable/index';

export const fetchAccounts = (walletType: WALLET_SPECIFICS): AllActions => ({
  type: ActionTypes.WALLET_FETCH_ACCOUNTS,
  payload: { walletType },
});

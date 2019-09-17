import { createSelector } from 'reselect';

import { RootStateRecord } from '../../state';
import { USERS_NAMESPACE as ns, USERS_WALLET } from '../constants';

export const walletSelector = (state: RootStateRecord) =>
  state.getIn([ns, USERS_WALLET]);

export const walletTypeSelector = createSelector(
  walletSelector,
  wallet => wallet && wallet.walletType,
);

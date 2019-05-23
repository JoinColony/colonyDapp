/* @flow */

import { createSelector } from 'reselect';

import type { RootStateRecord } from '~immutable';

import { WalletRecord } from '~immutable';
import { USERS_NAMESPACE as ns, USERS_WALLET } from '../constants';

export const walletSelector = (state: RootStateRecord) =>
  state.getIn([ns, USERS_WALLET], WalletRecord());

export const walletTypeSelector = createSelector(
  walletSelector,
  wallet => wallet && wallet.walletType,
);

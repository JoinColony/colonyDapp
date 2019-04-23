/* @flow */

import type { RootStateRecord } from '~immutable';

import { USERS_NAMESPACE, USERS_WALLET } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const walletAddressSelector = (state: RootStateRecord) =>
  state.getIn([USERS_NAMESPACE, USERS_WALLET, 'currentAddress']);

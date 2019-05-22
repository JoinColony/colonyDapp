/* @flow */

import type { RootStateRecord } from '~immutable';

import { USERS_NAMESPACE as ns, USERS_WALLET } from '../constants';

/* eslint-disable-next-line import/prefer-default-export */
export const walletTypeSelector = (state: RootStateRecord) =>
  state.getIn([ns, USERS_WALLET, 'walletType']);

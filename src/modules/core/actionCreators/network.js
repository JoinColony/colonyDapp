/* @flow */
/* eslint-disable import/prefer-default-export */

import type { Action } from '~redux';

import { ACTIONS } from '~redux';

export const fetchNetworkFee = (): Action<
  typeof ACTIONS.NETWORK_FETCH_FEE,
> => ({
  type: ACTIONS.NETWORK_FETCH_FEE,
});

export const fetchNetworkVersion = (): Action<
  typeof ACTIONS.NETWORK_FETCH_VERSION,
> => ({
  type: ACTIONS.NETWORK_FETCH_VERSION,
});
